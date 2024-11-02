import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherGraph from '../components/WeatherGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Grid2, Stack, Typography, Button, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('');
  const [formResult, setFormResults] = useState({severity: '', message: ''});
  const [formData, setFormData] = useState({
    Day: '',
    Month: '',
    Year: '',
    State: '',
    Temp_Min: '',
    Temp_Max: '',
    Rain_mm: '',
    Evaporation_mm: '',
    Sun_hours: '',
    Wind_Direction: '',
    Wind_Speed: '',
    Time_since_midnight: '',
    Temp_9am: '',
    RH_9am: '',
    Cld_9am: '',
    Dir_9am: '',
    Spd_9am: '',
    MSLP_9am: '',
    Temp_3pm: '',
    RH_3pm: '',
    Cld_3pm: '',
    Dir_3pm: '',
    Spd_3pm: '',
    MSLP_3pm: '',
    Temp_Diff: '',
    Rain_Indicator: ''
  });

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      let updatedFormData;

      if (name === 'Date') {
        const [year, month, day] = value.split('-');
        updatedFormData = { ...prevFormData, Year: year, Month: month, Day: day };
      } else {
        updatedFormData = { ...prevFormData, [name]: value };
      }

      if (name === 'Temp_Min' || name === 'Temp_Max') {
        if (updatedFormData.Temp_Min !== '' && updatedFormData.Temp_Max !== '') {
          updatedFormData.Temp_Diff = parseFloat(updatedFormData.Temp_Max) - parseFloat(updatedFormData.Temp_Min);
        }
      } else if (name === 'Rain_mm') {
        updatedFormData.Rain_Indicator = parseFloat(value) > 0 ? '1' : '0';
      }
      return updatedFormData;
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // if not all fields are filled
    // specify which fields are missing
    // else
    // send data to the backend
    // if successful, show success message
    // else show error message
    let missingFields = [];
    for (const key in formData) {
      if (formData[key] === '') {
        if ((key === 'Day' || key === 'Month' || key === 'Year') && !missingFields.includes('Date')) {
          missingFields.push('Date');
        } else {
          missingFields.push(key);
        }
      }
    }
    if (missingFields.length > 0) {
      setFormResults({severity: 'error', message: `Please fill in the following fields: ${missingFields.join(', ')}`});
    } else {
      setFormResults({severity: 'success', message: 'Weather data submitted successfully!'});
    }
  }

  const handleFormReset = () => {
    setFormData({
      Day: '',
      Month: '',
      Year: '',
      State: '',
      Temp_Min: '',
      Temp_Max: '',
      Rain_mm: '',
      Evaporation_mm: '',
      Sun_hours: '',
      Wind_Direction: '',
      Wind_Speed: '',
      Time_since_midnight: '',
      Temp_9am: '',
      RH_9am: '',
      Cld_9am: '',
      Dir_9am: '',
      Spd_9am: '',
      MSLP_9am: '',
      Temp_3pm: '',
      RH_3pm: '',
      Cld_3pm: '',
      Dir_3pm: '',
      Spd_3pm: '',
      MSLP_3pm: '',
      Temp_Diff: '',
      Rain_Indicator: ''
    });
    setFormResults({severity: '', message: ''});
  }

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
      <Stack direction='row' spacing={2} sx={{mb: 5}} justifyContent='center'>
        <ForecastCard date="22/08" rain="0" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="23/08" rain="3" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="24/08" rain="2" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="25/08" rain="0" isToday display={{ xs: 'none', sm: 'block' }} />
        <Box sx={{ mx: 2, color: 'teal', fontSize: '2rem', display: { xs: 'none', sm: 'flex' }, alignItems: "center" }}>&#8594;</Box>
        <ForecastCard date="26/08" rain="0" isTomorrow />
      </Stack>

      {/* Responsive Form for Weather Data Inputs */}
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h5" align="left" gutterBottom>Manual Weather Data Inputs</Typography>

        <form noValidate onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Date"
              type="date"
              fullWidth
              name="Date"
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

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <FormControl variant="outlined" fullWidth size='small'>
                <InputLabel>State</InputLabel>
                <Select
                required
                name="State"
                value={formData.State}
                onChange={handleFormDataChange}
                label="State"
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

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Min Temperature (°C)"
              type="number"
              fullWidth
              name="Temp_Min"
              value={formData.Temp_Min}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Max Temperature (°C)"
              type="number"
              fullWidth
              name="Temp_Max"
              value={formData.Temp_Max}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Rainfall (mm)"
              type="number"
              fullWidth
              name="Rain_mm"
              value={formData.Rain_mm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Evaporation (mm)"
              type="number"
              fullWidth
              name="Evaporation_mm"
              value={formData.Evaporation_mm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Sun Hours"
              type="number"
              fullWidth
              name="Sun_hours"
              value={formData.Sun_hours}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Wind Direction"
              type="text"
              fullWidth
              name="Wind_Direction"
              value={formData.Wind_Direction}
              onChange={handleFormDataChange}
              size='small' // TODO: change to select
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Wind Speed (km/h)"
              type="number"
              fullWidth
              name="Wind_Speed"
              value={formData.Wind_Speed}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Time Since Midnight"
              type="number"
              fullWidth
              name="Time_since_midnight"
              value={formData.Time_since_midnight}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Temperature at 9am (°C)"
              type="number"
              fullWidth
              name="Temp_9am"
              value={formData.Temp_9am}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="RH at 9am (%)"
              type="number"
              fullWidth
              name="RH_9am"
              value={formData.RH_9am}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Cloud at 9am"
              type="number"
              fullWidth
              name="Cld_9am"
              value={formData.Cld_9am}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Wind Direction at 9am"
              type="text"
              fullWidth
              name="Dir_9am"
              value={formData.Dir_9am}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Wind Speed at 9am (km/h)"
              type="number"
              fullWidth
              name="Spd_9am"
              value={formData.Spd_9am}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="MSLP at 9am"
              type="number"
              fullWidth
              name="MSLP_9am"
              value={formData.MSLP_9am}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Temperature at 3pm (°C)"
              type="number"
              fullWidth
              name="Temp_3pm"
              value={formData.Temp_3pm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="RH at 3pm (%)"
              type="number"
              fullWidth
              name="RH_3pm"
              value={formData.RH_3pm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Cloud at 3pm"
              type="number"
              fullWidth
              name="Cld_3pm"
              value={formData.Cld_3pm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Wind Direction at 3pm"
              type="text"
              fullWidth
              name="Dir_3pm"
              value={formData.Dir_3pm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="Wind Speed at 3pm (km/h)"
              type="number"
              fullWidth
              name="Spd_3pm"
              value={formData.Spd_3pm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
              required
              label="MSLP at 3pm"
              type="number"
              fullWidth
              name="MSLP_3pm"
              value={formData.MSLP_3pm}
              onChange={handleFormDataChange}
              size='small'
              />
            </Grid2>

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

      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="left" gutterBottom>Weather Data Chart</Typography>

        <Grid2 container spacing={2} alignItems="center" justifyContent="center">
          <Grid2 size={{ xs: 12, sm: 4}} >
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Weather Type</InputLabel>
              <Select
              value={weatherType}
              onChange={handleWeatherTypeChange}
              label="Weather Type"
              sx={{ textAlign: 'left' }}
              >
                <MenuItem value="Rain_mm">Rainfall (mm)</MenuItem>
                <MenuItem value="Temp_Min">Minimum Temperature (°C)</MenuItem>
                <MenuItem value="Temp_Max">Maximum Temperature (°C)</MenuItem>
                <MenuItem value="Evaporation_mm">Evaporation (mm)</MenuItem>
                <MenuItem value="Wind_Speed">Maximum Wind Speed (km/h)</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4}} >
            <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: new Date().toISOString().split('T')[0] }
            }}
            fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4}} >
            <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: fromDate, max: new Date().toISOString().split('T')[0]}
            }}
            fullWidth
            />
          </Grid2>
        </Grid2>

        {/* Weather Chart */}
        <WeatherGraph weatherType={weatherType} fromDate={fromDate} toDate={toDate} />
      </Box>

    </>
  );
}

export default Home;
