# Weather Forecast Web Application
This is a React web application that uses scikit-learn machine learning model and FastAPI to predict the tomorrow weather and to visualize historical data in our datasets.

## Requirements
### React Web Application
- Node.js
- React
- React Router
- D3.js
- Material-UI (@mui/material, @mui/icons-material)
- TopoJSON

To install the required packages, run the following command:
```bash
npm install
```

### FastAPI and scikit-learn
- fastapi[standard]
- scikit-learn==1.5.1
- pandas==2.2.2
- numpy==1.26.4
- joblib==1.4.2

To install the required packages, run the following command:
```bash
pip install fastapi[standard] scikit-learn==1.5.1 pandas==2.2.2 numpy==1.26.4 joblib==1.4.2
```

### AI Models
The machine learning models are trained and saved in the `server/models` directory.

## Usage

To start the React web application, run the following command:
```bash
npm start
```

To start the FastAPI server, run the following command:
```bash
cd server
fastapi run main.py
```

To access the web application, open your browser and go to `http://localhost:3000`.