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
  const [today, setToday] = useState('2024-09-22');
  const [loading, setLoading] = useState(false);
  const [loadDate, setLoadDate] = useState('');
  const [loadState, setLoadState] = useState('');
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

  // Request forecast data from the API
  // Get today and three days ago to fetch the forecast data for the last four days
  useEffect(() => {
    // setToday(new Date().toISOString().split('T')[0]);
    const threedaysago = new Date(today);
    threedaysago.setDate(threedaysago.getDate() - 3);

    fetch(`/api/data/weather?state=${location}&fromDate=${threedaysago.toISOString().split('T')[0]}&toDate=${today}`)
    .then(response => response.json())
    .then(data => {
      setForecastCardData(data);
    })
    .catch(error => console.error('Error fetching forecast data:', error));
  }, [location, today]);

  // Request forecast prediction from the API
  // Get the last day's data and send it to the API to get the prediction for the next day
  // Edit the data to remove the Date field and add Day, Month, Year and State fields to match the API's expected input
  // Set the forecast prediction to the response from the API
  useEffect(() => {
    if (forecastCardData.length > 0) {
      // get a copy of the last day's data
      const todayData = {...forecastCardData[forecastCardData.length - 1]};
      todayData.Day = new Date(today).getDay();
      todayData.Month = new Date(today).getMonth();
      todayData.Year = new Date(today).getFullYear();
      todayData.State = location;
      delete todayData.Date;

      fetch('/api/predict/rain_mm', {
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

  // Check if the user has selected a date and state to load the data
  // If the user has not selected a date or state, display an error message
  // Else, fetch the data from the API and set the form data to the response
  const handleLoadPreviousData = () => {
    if (loadDate === '') {
      setFormResults({severity: 'error', message: 'Please select a date to load the data'});
      return;
    }

    if (loadState === '') {
      setFormResults({severity: 'error', message: 'Please select a state to load the data'});
      return;
    }

    fetch(`/api/data/weather?state=${loadState}&fromDate=${loadDate}&toDate=${loadDate}`)
    .then(response => response.json())
    .then(data => {
      // Update the data to match the form fields
      data[0].Day = loadDate.split('-')[2];
      data[0].Month = loadDate.split('-')[1];
      data[0].Year = loadDate.split('-')[0];
      data[0].State = loadState;
      delete data[0].Date;
      setFormData(data[0]);
      setFormResults({severity: 'success', message: 'Data loaded successfully'});
    })
    .catch(error => {
      console.error('Error fetching previous data:', error);
      setFormResults({severity: 'error', message: 'An error occurred while loading the data'});
    });
  }

  // Update the form data based on the input field
  const handleFormDataChange = (event) => {
    const { name, value } = event.target;

    // Update form data based on the input field
    setFormData((prevFormData) => {
      let updatedFormData;

      // If name is Date, split the value into Year, Month and Day
      if (name === 'Date') {
        const [year, month, day] = value.split('-');
        updatedFormData = { ...prevFormData, Year: year, Month: month, Day: day };

      // If Wind_Direction or Wind_Speed is set to 0, set both to 0
      // If Wind_Direction or Wind_Speed is set to a value, set both to empty string
      } else if (name === 'Wind_Direction' || name === 'Wind_Speed') {
        if (value === '0') {
          updatedFormData = { ...prevFormData, Wind_Direction: '0', Wind_Speed: '0' };
        } else {
          if (prevFormData.Wind_Direction === '0' || prevFormData.Wind_Speed === '0') {
            updatedFormData = { ...prevFormData, Wind_Direction: '', Wind_Speed: '', [name]: value };
          } else {
            updatedFormData = { ...prevFormData, [name]: value };
          }
        }

      // If Dir_9am or Spd_9am is set to 0, set both to 0
      // If Dir_9am or Spd_9am is set to a value, set both to empty string
      } else if (name === 'Dir_9am' || name === 'Spd_9am') {
        if (value === '0') {
          updatedFormData = { ...prevFormData, Dir_9am: '0', Spd_9am: '0' };
        } else {
          if (prevFormData.Dir_9am === '0' || prevFormData.Spd_9am === '0') {
            updatedFormData = { ...prevFormData, Dir_9am: '', Spd_9am: '', [name]: value };
          } else {
            updatedFormData = { ...prevFormData, Dir_9am: '', Spd_9am: '', [name]: value };
          }
        }

      // If Dir_3pm or Spd_3pm is set to 0, set both to 0
      // If Dir_3pm or Spd_3pm is set to a value, set both to empty string
      } else if (name === 'Dir_3pm' || name === 'Spd_3pm') {
        if (value === '0') {
          updatedFormData = { ...prevFormData, Dir_3pm: '0', Spd_3pm: '0' };
        } else {
          if (prevFormData.Dir_3pm === '0' || prevFormData.Spd_3pm === '0') {
            updatedFormData = { ...prevFormData, Dir_3pm: '', Spd_3pm: '', [name]: value };
          } else {
            updatedFormData = { ...prevFormData, Dir_3pm: '', Spd_3pm: '', [name]: value };
          }
        }

      // Else, update the form data with the new value
      } else {
        updatedFormData = { ...prevFormData, [name]: value };
      }

      // Calculate Temp_Diff based on Temp_Min and Temp_Max
      if (name === 'Temp_Min' || name === 'Temp_Max') {
        if (updatedFormData.Temp_Min !== '' && updatedFormData.Temp_Max !== '') {
          updatedFormData.Temp_Diff = parseFloat(updatedFormData.Temp_Max) - parseFloat(updatedFormData.Temp_Min);
        }

      // Calculate Rain_Indicator based on Rain_mm
      } else if (name === 'Rain_mm') {
        updatedFormData.Rain_Indicator = parseFloat(value) > 0 ? '1' : '0';
      }

      return updatedFormData;
    });
  };

  // Handle form validation and submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    let _missingFields = [];

    // Check if any required fields are missing and display an error message
    for (const key in formData) {

      if (formData[key] === '') {

        if ((key === 'Day' || key === 'Month' || key === 'Year') && !_missingFields.includes('Date')) {
          _missingFields.push('Date');
        } else {
          _missingFields.push(key);
        }
      }
    }

    if (_missingFields.length > 0) {
      setFormResults({severity: 'error', message: 'Please fill in the required fields.'});
      setMissingFields(_missingFields);

    // If all required fields are filled, submit the data to the API
    // If the forecasting type is linear, send the data to the linear regression endpoint
    // If the forecasting type is logistic, send the data to the logistic regression endpoint
    } else {
      setMissingFields([]);
      if (forecastType === 'linear') {
        fetch('/api/predict/rain_mm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          // Display the rounded forecasting result
          setFormResults({severity: 'success', message: `Forecasting result: ${Math.round(data.rain_prediction_mm * 1000) / 1000} mm of rain tomorrow`});
        })
        .catch(error => console.error('Error submitting form data:', error));
      } else {
        fetch('/api/predict/rain_indicator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          // Display the forecasting result
          setFormResults({severity: 'success', message: `Forecasting result: ${data.rain_prediction_indicator ? "There will be rain tomorrow" : "There will be no rain tomorrow"}`});
        })
        .catch((error) => {
          console.error('Error:', error);
          setFormResults({severity: 'error', message: 'An error occurred while submitting the form.'});
        });
      }
    }
  };

  // Reset the form data and results
  const handleFormReset = () => {
    setFormData({
      Day: '', Month: '', Year: '', State: '', Temp_Min: '', Temp_Max: '', Rain_mm: '', Evaporation_mm: '', Sun_hours: '',
      Wind_Direction: '', Wind_Speed: '', Time_since_midnight: '', Temp_9am: '', RH_9am: '', Cld_9am: '', Dir_9am: '',
      Spd_9am: '', MSLP_9am: '', Temp_3pm: '', RH_3pm: '', Cld_3pm: '', Dir_3pm: '', Spd_3pm: '', MSLP_3pm: '', Temp_Diff: '', Rain_Indicator: ''
    });
    setFormResults({ severity: '', message: '' });
    setMissingFields([]);
  };

  // Handle weather type change
  const handleWeatherTypeChange = (event) => setWeatherType(event.target.value);

  // Handle date change
  // If the new from date is greater than the to date, set the to date to the from date
  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    if (toDate && newFromDate > toDate) {
      setToDate(newFromDate);
    }
  };

  // Handle to date change
  // If the new to date is less than the from date, set the from date to the to date
  const handleToDateChange = (event) => {
    const newToDate = event.target.value;
    if (newToDate >= fromDate) {
      setToDate(newToDate);
    }
  };

  // Fetch weather data from the API based on the selected weather type, from date, to date and location
  useEffect(() => {
    setLoading(true);

    if (fromDate && toDate && weatherType && location) {
      fetch(`/api/data/weather?state=${location}&weatherType=${weatherType}&fromDate=${fromDate}&toDate=${toDate}`)
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
            date={item.Date}
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
          new Date(new Date(today).setDate(new Date(today).getDate() + 1)).toISOString().split('T')[0]
        } rain={forecastCardPrediction} isTomorrow display='block' />
      </Stack>

      {/* Responsive Form for Weather Data Inputs */}
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h5" align="left" gutterBottom>Manual Weather Data Inputs</Typography>

        {/* Input fields and button for loading previous data */}
        <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }} >
          <Grid2 size={{ xs: 12, sm: 2 }}>
            <Typography variant="body1" align="left">Load previous data</Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3 }}>
            <TextField
            label="Select Date"
            type="date"
            size='small'
            fullWidth
            value={loadDate}
            onChange={(e) => setLoadDate(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: '2023-08-01', max: '2024-09-23' }
            }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3 }}>
            <FormControl
            variant="outlined"
            size='small'
            fullWidth
            >
              <InputLabel>Select State</InputLabel>
              <Select
              value={loadState}
              onChange={(e) => setLoadState(e.target.value)}
              label="Select State"
              sx={{ textAlign: 'left' }}
              >
                <MenuItem value="VIC">Victoria</MenuItem>
                <MenuItem value="NSW">New South Wales</MenuItem>
                <MenuItem value="QLD">Queensland</MenuItem>
                <MenuItem value="SA">South Australia</MenuItem>
                <MenuItem value="WA">Western Australia</MenuItem>
                <MenuItem value="TAS">Tasmania</MenuItem>
                <MenuItem value="NT">Northern Territory</MenuItem>
                <MenuItem value="ACT">Australian Capital Territory</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 2 }}>
            <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              handleLoadPreviousData();
            }}
            >
              Load Data
            </Button>
          </Grid2>
        </Grid2>

        {/* Form for manual weather data inputs */}
        <form noValidate onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            {
              Object.entries(mapNameToLabel).map(([name, label]) => {
                if (name === 'Date') {
                  return (
                    // Split the date into Year, Month and Day fields
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <TextField
                      required
                      error={missingFields.includes('Date')}
                      label={label}
                      type="date"
                      fullWidth
                      name={name}
                      value={
                        (formData.Year && formData.Month && formData.Day) ?
                        `${formData.Year}-${formData.Month}-${formData.Day}` :
                        ''
                      }
                      onChange={handleFormDataChange}
                      slotProps={{
                        inputLabel: { shrink: true }
                      }}
                      size='small'
                      />
                    </Grid2>
                  )
                } else if (name === 'State') {
                  return (
                    // Select the state from the dropdown menu
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <FormControl
                      variant="outlined"
                      fullWidth size='small'
                      required
                      error={missingFields.includes(name)}
                      >
                        <InputLabel>{label}</InputLabel>
                        <Select
                        name={name}
                        value={formData[name]}
                        onChange={handleFormDataChange}
                        label={label}
                        sx={{ textAlign: 'left' }}
                        >
                          <MenuItem value="VIC">Victoria</MenuItem>
                          <MenuItem value="NSW">New South Wales</MenuItem>
                          <MenuItem value="QLD">Queensland</MenuItem>
                          <MenuItem value="SA">South Australia</MenuItem>
                          <MenuItem value="WA">Western Australia</MenuItem>
                          <MenuItem value="TAS">Tasmania</MenuItem>
                          <MenuItem value="NT">Northern Territory</MenuItem>
                          <MenuItem value="ACT">Australian Capital Territory</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid2>
                  )
                } else if (name === 'Wind_Direction' || name === 'Dir_9am' || name === 'Dir_3pm') {
                  return (
                    // Select the wind direction from the dropdown menu
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                    <FormControl
                    variant="outlined"
                    fullWidth size='small'
                    required
                    error={missingFields.includes(name)}
                    >
                      <InputLabel>{label}</InputLabel>
                      <Select
                      name={name}
                      value={formData[name]}
                      onChange={handleFormDataChange}
                      label={label}
                      sx={{ textAlign: 'left' }}
                      >
                        <MenuItem value="0">No wind</MenuItem>
                        <MenuItem value="1">North</MenuItem>
                        <MenuItem value="2">North North-East</MenuItem>
                        <MenuItem value="3">North-East</MenuItem>
                        <MenuItem value="4">East North-East</MenuItem>
                        <MenuItem value="5">East</MenuItem>
                        <MenuItem value="6">East South-East</MenuItem>
                        <MenuItem value="7">South-East</MenuItem>
                        <MenuItem value="8">South South-East</MenuItem>
                        <MenuItem value="9">South</MenuItem>
                        <MenuItem value="10">South South-West</MenuItem>
                        <MenuItem value="11">South-West</MenuItem>
                        <MenuItem value="12">West South-West</MenuItem>
                        <MenuItem value="13">West</MenuItem>
                        <MenuItem value="14">West North-West</MenuItem>
                        <MenuItem value="15">North-West</MenuItem>
                        <MenuItem value="16">North North-West</MenuItem>
                      </Select>
                    </FormControl>
                    </Grid2>
                  )
                } else {
                  return (
                    // Input field for all other fields
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <TextField
                      required
                      error={missingFields.includes(name)}
                      label={label}
                      type="number"
                      fullWidth
                      name={name}
                      value={formData[name]}
                      onChange={handleFormDataChange}
                      size='small'
                      />
                    </Grid2>
                  )
                }
              })
            }

            {/* Forecasting Type Selector */}
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

            {/* Submit and Clear Buttons */}
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

        {/* Form Result Alert */}
        {/* If the form result has a message, display an alert with the message */}
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
        {/* If the weather type, from date and to date are selected, display the weather chart */}
        {/* If the data is loading, display a loading message */}
        {/* If the weather type is Rainfall, Evaporation or Wind Speed, display a bar graph */}
        {/* If the weather type is Temperature, display a line graph */}
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
