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
    global logistic_model, linear_model, scaler, target_scaler
    logistic_model = joblib.load("models/logistic_regression_model.pkl")
    linear_model = joblib.load("models/linear_regression_model.pkl")
    scaler = joblib.load("models/scaler.pkl")
    target_scaler = joblib.load("models/target_scaler.pkl")

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

    dataframe = pd.get_dummies(dataframe, columns=['State'], prefix=['State']).astype('int64')

    log_transform_data = dataframe.drop(
        columns=['Day', 'Month', 'Year', 'State', 'Wind_Direction', 'Time_since_midnight', 'Dir_9am', 'Dir_3pm',
                 'Temp_Diff'])
    dataframe[log_transform_data.columns] = scaler.transform(log_transform_data)

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
    dataframe = pd.get_dummies(dataframe, columns=['State'], prefix=['State']).astype('int64')

    lin_transform_data = data.drop(
        columns=['Day', 'Month', 'Year', 'State', 'Wind_Direction', 'Time_since_midnight', 'Dir_9am', 'Dir_3pm',
                 'Temp_Diff'])

    dataframe[lin_transform_data.columns] = scaler.inverse_transform(lin_transform_data)

    rain_mm_prediction = linear_model.predict(dataframe)[0]

# Return the result
    return {"rain_mm_prediction": int(rain_mm_prediction)}



@app.post("/api/predict_visitor_random/")
def predict_visitor(data: dict):
    # Ensure models are loaded
    if not visitor_model or not scaler:
        raise HTTPException(status_code=500, detail="Models or scalers not loaded.")

    #preparing data
    visitor_scaler = MinMaxScaler()
    visitor_transform_data = data.drop(columns=['Year', 'Month', 'State', 'Number of arriving visitors'])
    visitor_scaler.fit(visitor_transform_data)
    data[visitor_transform_data.columns] = visitor_scaler.transform(visitor_transform_data)

    visitor_target_scaler_reg = MinMaxScaler()
    visitor_target_scaler_reg.fit(data[['Number of arriving visitors']])
    data[['Number of arriving visitors']] = visitor_target_scaler_reg.transform(data[['Number of arriving visitors']])

    visitor_data_processed = pd.get_dummies(data, columns=['State'], prefix=['State']).astype('float64')

    ranfor = RandomForestRegressor(10, random_state=42)

    target_data = data.copy()
    target_data["Is predicted"] = 0

    predict_visitor_data = data.copy()
    predict_visitor_data['Number of arriving visitors'] = ranfor.predict(
        visitor_data_processed.drop(['Number of arriving visitors'], axis=1))
    predict_visitor_data["Is predicted"] = 1

    visitor_prediction = pd.concat([target_data, predict_visitor_data])



# Custom 404 handler for non-existent routes
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"detail": "The resource you are looking for does not exist."}

