import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherGraph from '../components/WeatherGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Grid2, Stack} from '@mui/material';

function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('');

  const handleWeatherTypeChange = (event) => setWeatherType(event.target.value);

  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    if (newFromDate > toDate) {
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
      <Stack direction='row' spacing={2} justifyContent='center'>
        <ForecastCard date="22/08" rain="0" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="23/08" rain="3" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="24/08" rain="2" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="25/08" rain="0" isToday display={{ xs: 'none', sm: 'block' }} />
        <Box sx={{ mx: 2, color: 'teal', fontSize: '2rem', display: { xs: 'none', sm: 'flex' }, alignItems: "center" }}>&#8594;</Box>
        <ForecastCard date="26/08" rain="0" isTomorrow />
      </Stack>

      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <Box sx={{ flexGrow: 1, m: 2 }}>
        <Grid2 container spacing={2} alignItems="center" justifyContent="center">
          <Grid2 item size={{ xs: 12, sm: 4}} >
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

          <Grid2 item size={{ xs: 12, sm: 4}} >
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

          <Grid2 item size={{ xs: 12, sm: 4}} >
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
      </Box>

      {/* Weather Chart */}
      <WeatherGraph weatherType={weatherType} fromDate={fromDate} toDate={toDate} />
    </>
  );
}

export default Home;
