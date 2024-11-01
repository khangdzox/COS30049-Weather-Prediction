from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import joblib
import numpy as np
import pandas as pd

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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Weather Prediction API"}


# Load models at startup
@app.on_event("startup")
def load_models():
    global logistic_model, linear_model, scaler, target_scaler
    logistic_model = joblib.load("models/logistic_regression_model.pkl")
    linear_model = joblib.load("models/linear_regression_model.pkl")
    scaler = joblib.load("models/scaler.pkl")
    target_scaler = joblib.load("models/target_scaler.pkl")

# Prediction endpoint
@app.post("/predict/")
def predict_weather(data: dict):
    # Ensure models are loaded
    if not logistic_model or not scaler:
        raise HTTPException(status_code=500, detail="Models or scalers not loaded.")

    # Convert input data to match model's feature set
    # For example, if you need 'State' dummy variables, prepare them here
    input_data = pd.DataFrame([data])
    input_data_processed = pd.get_dummies(input_data)

    # Align columns with training data
    input_data_processed = input_data_processed.reindex(columns=logistic_model.feature_names_in_, fill_value=0)

    # Scale the input data
    scaled_data = scaler.transform(input_data_processed)

    # Make predictions
    rain_prediction_indicator = logistic_model.predict(scaled_data)[0]

    # Return the result
    return {"rain_prediction_indicator": int(rain_prediction_indicator)}


# Custom 404 handler for non-existent routes
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"detail": "The resource you are looking for does not exist."}

