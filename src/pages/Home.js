import React, { useEffect, useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherGraph from '../components/WeatherGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Stack, Typography, Button, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import Grid2 from '@mui/material/Grid';

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
  Temp_Diff: 'Temperature Difference (°C)',
  Rain_Indicator: 'Rain Indicator'
};

function Home() {
  const [fromDate, setFromDate] = useState('2023-06-01');
  const [toDate, setToDate] = useState('2023-06-15');
  const [weatherType, setWeatherType] = useState('Rain_mm');
  const [state] = useState('VIC'); // State is fixed; remove `setState` to avoid warnings
  const [forecastData, setForecastData] = useState([]); // Store forecast data from API
  const [formResult, setFormResults] = useState({ severity: '', message: '' });
  const [missingFields, setMissingFields] = useState([]);
  const [formData, setFormData] = useState({
    Day: '', Month: '', Year: '', State: '', Temp_Min: '', Temp_Max: '', Rain_mm: '', Evaporation_mm: '', Sun_hours: '',
    Wind_Direction: '', Wind_Speed: '', Time_since_midnight: '', Temp_9am: '', RH_9am: '', Cld_9am: '', Dir_9am: '',
    Spd_9am: '', MSLP_9am: '', Temp_3pm: '', RH_3pm: '', Cld_3pm: '', Dir_3pm: '', Spd_3pm: '', MSLP_3pm: '', Temp_Diff: '', Rain_Indicator: ''
  });

  
  useEffect(() => {
    // Fetch forecast data from the API
    const fetchForecastData = async () => {
      try {
        const response = await fetch(`https://api/data/weather?state=${state}&weatherType=${weatherType}&fromDate=${fromDate}&toDate=${toDate}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        setForecastData(data); 
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    fetchForecastData();
  }, [state, weatherType, fromDate, toDate]);

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
      setFormResults({ severity: 'error', message: 'Please fill in all required fields.' });
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

  return (
    <>
      {/* Forecast Card Stack */}
      <Stack direction='row' spacing={2} sx={{ mb: 5 }} justifyContent='center'>
        {forecastData.map((item, index) => (
          <ForecastCard
            key={index}
            date={item.date}
            rain={item.rain}
            display={{
              xs: 'none',
              sm: index < forecastData.length - 2 ? 'none' : 'block', // Only show last two on small screens
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
            <Grid2 size={{ xs: 12, sm: 4 }}>
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
        {formResult.message && <Alert severity={formResult.severity}>{formResult.message}</Alert>}
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
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>
        </Grid2>

        {/* Weather Graph */}
        <WeatherGraph weatherType={weatherType} fromDate={fromDate} toDate={toDate} />
      </Box>
    </>
  );
}

export default Home;
