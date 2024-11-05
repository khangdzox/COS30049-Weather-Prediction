import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button, FormControl, Grid2, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ForecastCard from '../components/ForecastCard';
import BarGraph from '../components/BarGraph';
import LineGraph from '../components/LineGraph';

// Add field mappings for form labels
const mapNameToLabel = {
  Date: 'Date',
  State: 'State',
  Temp_Min: 'Minimum Temperature (°C)',
  Temp_Max: 'Maximum Temperature (°C)',
  Rain_mm: 'Rainfall (mm)',
  Evaporation_mm: 'Evaporation (mm)',
  Sun_hours: 'Sun Hours',
  Wind_Direction: 'Wind Direction',
  Wind_Speed: 'Wind Speed (km/h)',
  Time_since_midnight: 'Time Since Midnight',
  Temp_9am: 'Temperature at 9am (°C)',
  RH_9am: 'RH at 9am (%)',
  Cld_9am: 'Cloud at 9am',
  Dir_9am: 'Wind Direction at 9am',
  Spd_9am: 'Wind Speed at 9am (km/h)',
  MSLP_9am: 'MSLP at 9am',
  Temp_3pm: 'Temperature at 3pm (°C)',
  RH_3pm: 'RH at 3pm (%)',
  Cld_3pm: 'Cloud at 3pm',
  Dir_3pm: 'Wind Direction at 3pm',
  Spd_3pm: 'Wind Speed at 3pm (km/h)',
  MSLP_3pm: 'MSLP at 3pm',
}

const mapWeatherTypeToGraphType = (weatherType) => {
  if (['Rain_mm', 'Evaporation_mm', 'Wind_Speed'].includes(weatherType)) {
    return 'bar';
  } else {
    return 'line';
  }
}

function Home() {
  const [location, setLocation] = useOutletContext();
  const [today, setToday] = useState('2024-09-23');
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('');
  const [formResult, setFormResults] = useState({severity: '', message: ''});
  const [forecastCardData, setForecastCardData] = useState([]); // Store forecast data from API
  const [forecastCardPrediction, setForecastCardPrediction] = useState(''); // Store forecast prediction
  const [missingFields, setMissingFields] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [forecastType, setForecastType] = useState('logistic');
  const [formData, setFormData] = useState({
    Day: '', Month: '', Year: '', State: '', Temp_Min: '', Temp_Max: '', Rain_mm: '', Evaporation_mm: '', Sun_hours: '',
    Wind_Direction: '', Wind_Speed: '', Time_since_midnight: '', Temp_9am: '', RH_9am: '', Cld_9am: '', Dir_9am: '',
    Spd_9am: '', MSLP_9am: '', Temp_3pm: '', RH_3pm: '', Cld_3pm: '', Dir_3pm: '', Spd_3pm: '', MSLP_3pm: '', Temp_Diff: '', Rain_Indicator: ''
  });

  useEffect(() => {
    // setToday(new Date().toISOString().split('T')[0]);
    const threedaysago = new Date(today);
    threedaysago.setDate(threedaysago.getDate() - 3);

    fetch(`http://localhost:8000/api/data/weather?state=${location}&fromDate=${threedaysago.toISOString().split('T')[0]}&toDate=${today}`)
    .then(response => response.json())
    .then(data => {
      setForecastCardData(data);
    })
    .catch(error => console.error('Error fetching forecast data:', error));
  }, [location, today]);

  useEffect(() => {
    if (forecastCardData.length > 0) {
      // get a copy of the last day's data
      const todayData = {...forecastCardData[forecastCardData.length - 1]};
      todayData.Day = new Date(today).getDay();
      todayData.Month = new Date(today).getMonth();
      todayData.Year = new Date(today).getFullYear();
      todayData.State = location;
      delete todayData.Date;

      fetch('http://localhost:8000/api/predict/rain_mm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todayData)
      })
      .then(response => response.json())
      .then(data => {
        setForecastCardPrediction(data.rain_prediction_mm);
      })
      .catch(error => console.error('Error fetching forecast prediction:', error));
    }
  }, [forecastCardData, location, today]);

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      let updatedFormData = { ...prevFormData, [name]: value };

      // Handle specific field relationships if needed
      if (name === 'Temp_Min' || name === 'Temp_Max') {
        if (updatedFormData.Temp_Min && updatedFormData.Temp_Max) {
          updatedFormData.Temp_Diff = parseFloat(updatedFormData.Temp_Max) - parseFloat(updatedFormData.Temp_Min);
        }
      }
      if (name === 'Rain_mm') {
        updatedFormData.Rain_Indicator = parseFloat(value) > 0 ? '1' : '0';
      }

      return updatedFormData;
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const missingFieldsList = Object.keys(formData).filter((field) => formData[field] === '');
    setMissingFields(missingFieldsList);

    if (missingFieldsList.length === 0) {
      setFormResults({ severity: 'success', message: 'Weather data submitted successfully!' });
      // Send formData to your API here if needed
    } else {
      setMissingFields([]);
      if (forecastType === 'linear') {
        fetch('http://localhost:8000/api/predict/rain_mm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          setFormResults({severity: 'success', message: `Forecasting result: ${Math.round(data.rain_prediction_mm * 1000) / 1000} mm of rain tomorrow`});
        })
        .catch(error => console.error('Error submitting form data:', error));
      } else {
        fetch('http://localhost:8000/api/predict/rain_indicator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          setFormResults({severity: 'success', message: `Forecasting result: ${data.rain_prediction_indicator ? "There will be rain tomorrow" : "There will be no rain tomorrow"}`});
        })
        .catch((error) => {
          console.error('Error:', error);
          setFormResults({severity: 'error', message: 'An error occurred while submitting the form.'});
        });
      }
    }
  };

  const handleFormReset = () => {
    setFormData({
      Day: '', Month: '', Year: '', State: '', Temp_Min: '', Temp_Max: '', Rain_mm: '', Evaporation_mm: '', Sun_hours: '',
      Wind_Direction: '', Wind_Speed: '', Time_since_midnight: '', Temp_9am: '', RH_9am: '', Cld_9am: '', Dir_9am: '',
      Spd_9am: '', MSLP_9am: '', Temp_3pm: '', RH_3pm: '', Cld_3pm: '', Dir_3pm: '', Spd_3pm: '', MSLP_3pm: '', Temp_Diff: '', Rain_Indicator: ''
    });
    setFormResults({ severity: '', message: '' });
    setMissingFields([]);
  };

  const handleWeatherTypeChange = (event) => setWeatherType(event.target.value);

  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    if (toDate && newFromDate > toDate) {
      setToDate(newFromDate);
    }
  };

  const handleToDateChange = (event) => {
    const newToDate = event.target.value;
    if (newToDate >= fromDate) {
      setToDate(newToDate);
    }
  };

  useEffect(() => {
    setLoading(true);

    if (fromDate && toDate && weatherType && location) {
      fetch(`http://localhost:8000/api/data/weather?state=${location}&weatherType=${weatherType}&fromDate=${fromDate}&toDate=${toDate}`)
      .then(response => response.json())
      .then(data => {
        setGraphData(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [fromDate, toDate, weatherType, location]);

  return (
    <>
      {/* Forecast Card Stack */}
      <Stack direction='row' spacing={2} sx={{ mb: 5 }} justifyContent='center'>
        {forecastCardData.map((item, index) => (
          <ForecastCard
            key={index}
            date={item.Date ? item.Date.split('T')[0] : item.Date}
            rain={item.Rain_mm}
            isToday={index === forecastCardData.length - 1}
            display={{
              xs: 'none',
              sm: index < forecastCardData.length - 1 ? 'none' : 'block', // Only show last two on small screens
              md: 'block'
            }}
          />
        ))}
        <Box
          sx={{
            mx: 2,
            color: 'teal',
            fontSize: '2rem',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center'
          }}
        >
          &#8594;
        </Box>
        <ForecastCard date={
          new Date(new Date().setDate(new Date(today).getDate() + 1)).toISOString().split('T')[0]
        } rain={forecastCardPrediction} isTomorrow display='block' />
      </Stack>

      {/* Responsive Form for Weather Data Inputs */}
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h5" align="left" gutterBottom>Manual Weather Data Inputs</Typography>
        <form noValidate onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            {Object.entries(mapNameToLabel).map(([name, label]) => (
              <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                <TextField
                  required
                  error={missingFields.includes(name)}
                  label={label}
                  type={name === 'Date' ? 'date' : 'text'}
                  fullWidth
                  name={name}
                  value={formData[name]}
                  onChange={handleFormDataChange}
                  size='small'
                />
              </Grid2>
            ))}
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <FormControl variant="outlined" fullWidth size='small'>
                <InputLabel>Forecasting Type</InputLabel>
                <Select
                name='forecastType'
                value={forecastType}
                onChange={(event) => setForecastType(event.target.value)}
                label="Forecasting Type"
                sx={{ textAlign: 'left' }}
                >
                  <MenuItem value="logistic">Logistic Regression (Rain/No rain)</MenuItem>
                  <MenuItem value="linear">Linear Regression (Amount of rain)</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 6, sm: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type='submit'
                size='large'
                startIcon={<SaveIcon />}
              >
                Submit
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 6, sm: 2 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                type='reset'
                size='large'
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Grid2>
          </Grid2>
        </form>

        {formResult.message ? <Alert severity={formResult.severity}>{formResult.message}</Alert> : null}
      </Box>

      {/* Weather Data Chart */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="left" gutterBottom>Weather Data Chart</Typography>
        <Grid2 container spacing={2} alignItems="center" justifyContent="center">
          {/* Date Range and Type Selector */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Weather Type</InputLabel>
              <Select
                value={weatherType}
                onChange={handleWeatherTypeChange}
                label="Weather Type"
              >
                <MenuItem value="Rain_mm">Rainfall (mm)</MenuItem>
                <MenuItem value="Temp_Min">Minimum Temperature (°C)</MenuItem>
                <MenuItem value="Temp_Max">Maximum Temperature (°C)</MenuItem>
                <MenuItem value="Evaporation_mm">Evaporation (mm)</MenuItem>
                <MenuItem value="Wind_Speed">Wind Speed (km/h)</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: '2023-08-01', max: '2024-09-23' }
            }}
            fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: fromDate, max: '2024-09-23' }
            }}
            fullWidth
            />
          </Grid2>
        </Grid2>

        {/* Weather Chart */}
        <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2 }}>
          {!weatherType || !toDate || !fromDate ? (
            <Alert severity="info">Please select a weather type, from date and to date to display the graph</Alert>
          ) : (loading) ? (
            <Alert severity="info">Loading...</Alert>
          ) : (mapWeatherTypeToGraphType(weatherType) === 'line') ? (
            <LineGraph data={graphData} dataName={weatherType} displayName={mapNameToLabel[weatherType]} />
          ) : (
            <BarGraph data={graphData} dataName={weatherType} displayName={mapNameToLabel[weatherType]} />
          )}
        </Paper>
      </Box>
    </>
  );
}

export default Home;
