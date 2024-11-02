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


app = FastAPI()

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
@app.post("/api/predict_log/")
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


@app.post("/api/predict_lin/")
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

@app.post("/api/predict_visitor_random/")
def predict_visitor(data: dict):
    # Ensure models are loaded
    if not random_forest_model or not scaler:
        raise HTTPException(status_code=500, detail="Models or scalers not loaded.")

    #preparing data
    dataframe = pd.DataFrame(data, index=[0])

    visitor_transform_data = dataframe.drop(columns=['Year', 'Month', 'State', 'Number of arriving visitors'])

    dataframe[visitor_transform_data.columns] = scaler.transform(visitor_transform_data)

    dataframe = pd.get_dummies(dataframe, columns=['State'], prefix=['State']).astype('int64')
    dataframe = dataframe.reindex(columns=random_forest_model.feature_names_in_, fill_value=0)

    visitor_prediction = random_forest_model.predict(
        visitor_transform_data.drop(dataframe)[0])

    # Return the result
    return {"Number of arriving visitors": max(0, visitor_prediction)}



#chatgpt answer/ still nid modify
@app.post("/data/temperature_range/")



# Custom 404 handler for non-existent routes
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"detail": "The resource you are looking for does not exist."}

