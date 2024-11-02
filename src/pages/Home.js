import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherLineGraph from '../components/WeatherLineGraph';
import WeatherBarGraph from '../components/WeatherBarGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Grid2, Stack } from '@mui/material';

function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('Rainfall');

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
      {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>

        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }} }>
          <ForecastCard date="22/08" rain="0" />
          <ForecastCard date="23/08" rain="3" />
          <ForecastCard date="24/08" rain="2" />
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ForecastCard date="25/08" rain="0" isToday="true" />
        </Box>
        <Box sx={{ mx: 2, fontSize: '2rem', display: { xs: 'none', sm: 'block' } }}>&#8594;</Box>
        <ForecastCard date="26/08" rain="0" isTomorrow="true" />

      </Box> */}

      <Stack direction='row' spacing={2} justifyContent='center'>
        <ForecastCard date="22/08" rain="0" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="23/08" rain="3" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="24/08" rain="2" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="25/08" rain="0" isToday display={{ xs: 'none', sm: 'block' }} />
        <Box sx={{ mx: 2, fontSize: '2rem', display: { xs: 'none', sm: 'flex' }, alignItems: "center" }}>&#8594;</Box>
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
                <MenuItem value="Rainfall">Rainfall</MenuItem>
                <MenuItem value="Temperature">Temperature</MenuItem>
                <MenuItem value="Wind speed">Wind speed</MenuItem>
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
                inputLabel: { shrink: true }
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
                htmlInput: { min: fromDate }
              }}
              fullWidth
            />
          </Grid2>
        </Grid2>
      </Box>

      {/* Weather Chart */}
      <WeatherLineGraph fromDate={fromDate} toDate={toDate} dataType={weatherType} />
      <WeatherBarGraph fromDate={fromDate} toDate={toDate} dataType={weatherType} />
    </>
  );
}

export default Home;
