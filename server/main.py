from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Optional
import joblib
from datetime import datetime
import pandas as pd

class DateRangeRequest(BaseModel):
    start_date: str  # Expecting format "YYYY-MM-DD"
    end_date: str    # Expecting format "YYYY-MM-DD"

# Data model for weather prediction input
class WeatherData(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None

# Placeholders for the AI models and scalers
logistic_model = None
linear_model = None
random_forest_model = None
scaler = None
target_scaler = None

# Load models at startup
def load_models():
    global logistic_model, linear_model, scaler, target_scaler, random_forest_model
    logistic_model = joblib.load("models/logistic_regression_model.pkl")
    linear_model = joblib.load("models/linear_regression_model.pkl")
    scaler = joblib.load("models/scaler.pkl")
    target_scaler = joblib.load("models/target_scaler.pkl")
    random_forest_model = joblib.load("models/random_forest_model.pkl")

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    try:
        yield
    finally:
        pass

# Create the FastAPI app
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
def read_root():
    return {"message": "Welcome to the Weather Prediction API"}

# Prediction endpoint
@app.post("/api/predict/rain_indicator")
def predict_weather_log(data: dict):
    # Ensure models are loaded
    if not logistic_model or not scaler:
        raise HTTPException(status_code=500, detail="Models or scalers not loaded.")

    #preparing data (normalizing)
    dataframe = pd.DataFrame(data, index=[0])

    log_transform_data = dataframe.drop(
        columns=['Day', 'Month', 'Year', 'State', 'Wind_Direction', 'Time_since_midnight', 'Dir_9am', 'Dir_3pm',
                 'Temp_Diff'])
    dataframe[log_transform_data.columns] = scaler.transform(log_transform_data)

    dataframe = pd.get_dummies(dataframe, columns=['State'], prefix=['State']).astype('int64')

    dataframe = dataframe.reindex(columns=logistic_model.feature_names_in_, fill_value=0)

    #logistic regression
    rain_prediction_indicator = logistic_model.predict(dataframe)[0]

    # Return the result
    return {"rain_prediction_indicator": int(rain_prediction_indicator)}

@app.post("/api/predict/rain_mm")
def predict_weather_lin(data: dict):
    # Ensure models are loaded
    if not linear_model or not scaler:
        raise HTTPException(status_code=500, detail="Models or scalers not loaded.")

    #preparing data (normalizing)
    dataframe = pd.DataFrame(data, index=[0])

    lin_transform_data = dataframe.drop(
        columns=['Day', 'Month', 'Year', 'State', 'Wind_Direction', 'Time_since_midnight', 'Dir_9am', 'Dir_3pm',
                 'Temp_Diff'])

    dataframe[lin_transform_data.columns] = scaler.inverse_transform(lin_transform_data)

    dataframe = pd.get_dummies(dataframe, columns=['State'], prefix=['State']).astype('int64')
    dataframe = dataframe.reindex(columns=linear_model.feature_names_in_, fill_value=0)

    rain_mm_prediction = linear_model.predict(dataframe)[0]

    # Return the result
    return {"rain_prediction_mm": max(0, rain_mm_prediction)}


@app.post("/api/predict/visitor")
def predict_visitor(data: dict):
    # Ensure models are loaded
    if not random_forest_model or not scaler:
        raise HTTPException(status_code=500, detail="Models or scalers not loaded.")

    #preparing data
    dataframe = pd.DataFrame(data, index=[0])

    dataframe = pd.get_dummies(dataframe, columns=['State'], prefix=['State']).astype('int64')
    dataframe = dataframe.reindex(columns=random_forest_model.feature_names_in_, fill_value=0)

    visitor_prediction = random_forest_model.predict(dataframe)[0]

    # Return the result
    return {"Number of arriving visitors": max(0, visitor_prediction)}

@app.get('/api/data/weather')
def get_weather_data(
    state: str = Query(..., description="State to filter data by (e.g., 'VIC')"),
    weatherType: Optional[str] = Query(None, description="Type of weather data to filter (e.g., 'Rain_mm', 'Temp_Max')"),
    fromDate: str = Query(..., description="Start date in YYYY-MM-DD format"),
    toDate: str = Query(..., description="End date in YYYY-MM-DD format")
):

    # Load the data from CSV
    try:
        weather_data = pd.read_csv("weather.csv")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load data: {e}")

    # Parse the fromDate and toDate parameters
    try:
        start_date = datetime.strptime(fromDate, "%Y-%m-%d")
        end_date = datetime.strptime(toDate, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Check if start_date is before end_date
    if start_date > end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date.")

    # Convert 'Year', 'Month', 'Day' columns to a single 'Date' column for filtering
    weather_data['Date'] = pd.to_datetime(weather_data[['Year', 'Month', 'Day']])

    # Filter by date range
    filtered_data = weather_data[(weather_data['Date'] >= start_date) & (weather_data['Date'] <= end_date)]

    # Filter by state
    if 'State' not in weather_data.columns:
        raise HTTPException(status_code=400, detail="State column not found in the data.")

    filtered_data = filtered_data[filtered_data['State'] == state]

    # Filter by weatherType if provided
    if weatherType:
        if weatherType not in filtered_data.columns:
            raise HTTPException(status_code=400, detail=f"'{weatherType}' is not a valid column in the data.")
        filtered_data = filtered_data[['Date', weatherType]]
        filtered_data['Date'] = filtered_data['Date'].dt.strftime('%Y-%m-%d')
    else:
        filtered_data = filtered_data.drop(columns=['State', 'Year', 'Month', 'Day', 'Tomorrow_Rain_mm', 'Tomorrow_Rain_Indicator'])
        filtered_data['Date'] = filtered_data['Date'].dt.strftime('%Y-%m-%d')

    # Convert the filtered data to a dictionary format for JSON response
    result = filtered_data.to_dict(orient="records")

    return result

@app.get('/api/data/visitors')
def get_visitors_data(
    state: str = Query(..., description="State to filter data by (e.g., 'VIC')"),
    columns: Optional[str] = Query(None, description="Type of data to filter (e.g., 'Monthly rainfall', 'Monthly mean maximum temperature')"),
    fromDate: str = Query(..., description="Start date in YYYY-MM format"),
    toDate: str = Query(..., description="End date in YYYY-MM format")
):
    # Load the data from CSV
    try:
        data = pd.read_csv("weather_vs_visitors.csv")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load data: {e}")

    # Parse the fromDate and toDate parameters
    try:
        start_date = datetime.strptime(fromDate, "%Y-%m")
        end_date = datetime.strptime(toDate, "%Y-%m")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM.")

    # Check if start_date is before end_date
    if start_date > end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date.")

    # Convert 'Year' and 'Month' columns to a single 'Date' column for filtering
    data['Date'] = pd.to_datetime(data[['Year', 'Month']].assign(Day=1))

    # Filter data by date range and state
    filtered_data = data[(data['Date'] >= start_date) & (data['Date'] <= end_date) & (data['State'] == state)]

    # If weatherType is provided, filter by that column; otherwise, return all columns
    if columns:
        if columns not in filtered_data.columns:
            raise HTTPException(status_code=400, detail=f"'{columns}' is not a valid column in the data.")
        filtered_data = filtered_data[['Date', columns]]
        filtered_data['Date'] = filtered_data['Date'].dt.strftime('%Y-%m')
    else:
        filtered_data = filtered_data.drop(columns=['State', 'Year', 'Month'])
        filtered_data['Date'] = filtered_data['Date'].dt.strftime('%Y-%m-%d')

    # Convert the filtered data to a dictionary format for JSON response
    result = filtered_data.to_dict(orient="records")

    return result


# Custom 404 handler for non-existent routes
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"detail": "The resource you are looking for does not exist."}

