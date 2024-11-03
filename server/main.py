from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Optional
import joblib
import numpy as np
import pandas as pd
#data preparation
from sklearn.preprocessing import MinMaxScaler
#logistic reg
from sklearn.linear_model import LogisticRegression
#linear reg
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error
from math import sqrt

#random forest
from sklearn.ensemble import RandomForestRegressor


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

    print(random_forest_model)


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
@app.post("/api/predict/rain_indicator/")
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
    return {"rain_mm_prediction": max(0, rain_mm_prediction)}


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


#chatgpt answer/ still nid modify
# @app.post("/data/temperature_range/")
# def predict_temperature_range(date_range: DateRangeRequest, data: WeatherData):
#     # Ensure models are loaded
#     if not temperature_model or not scaler:
#         raise HTTPException(status_code=500, detail="Model or scaler not loaded.")
#
#     # Parse and validate dates
#     try:
#         start_date = datetime.strptime(date_range.start_date, "%Y-%m-%d")
#         end_date = datetime.strptime(date_range.end_date, "%Y-%m-%d")
#     except ValueError:
#         raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
#
#     # Check if start_date is before end_date
#     if start_date > end_date:
#         raise HTTPException(status_code=400, detail="Start date must be before end date.")
#
#     # Calculate the number of days in the range
#     num_days = (end_date - start_date).days + 1
#     date_list = [start_date + timedelta(days=i) for i in range(num_days)]
#
#     # Prepare input data for predictions
#     input_data = pd.DataFrame([data.dict()])
#     input_data_processed = pd.get_dummies(input_data)
#     input_data_processed = input_data_processed.reindex(columns=scaler.feature_names_in_, fill_value=0)
#
#     # Scale input data
#     scaled_data = scaler.transform(input_data_processed)
#
#     # Collect temperature predictions for each day
#     predictions = []
#     for single_date in date_list:
#         # Predict temperature for each day in the range
#         predicted_temperature = temperature_model.predict(scaled_data)[0]
#
#         # Store the prediction with the date
#         predictions.append({
#             "date": single_date.strftime("%Y-%m-%d"),
#             "predicted_temperature": predicted_temperature
#         })
#
#     # Return the list of daily temperature predictions
#     return {"daily_temperature_predictions": predictions}


@app.get('/api/data/weather')
def get_weather_data(weatherType, fromDate, toDate):
    pass


@app.get('/api/data/visitors')
def get_visitors_data(weatherType, fromDate, toDate):
    pass


# Custom 404 handler for non-existent routes
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"detail": "The resource you are looking for does not exist."}

