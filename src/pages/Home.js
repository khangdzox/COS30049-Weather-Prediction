import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherLineGraph from '../components/WeatherLineGraph';
import WeatherBarGraph from '../components/WeatherBarGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Grid2 } from '@mui/material';

function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('Rainfall');

  const handleWeatherTypeChange = (event) => {
    setWeatherType(event.target.value);
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <ForecastCard data={{ date: "22/08", rain: "0mm" }} />
        <ForecastCard data={{ date: "23/08", rain: "3mm" }} />
        <ForecastCard data={{ date: "24/08", rain: "2mm" }} />
        <ForecastCard data={{ date: "25/08", rain: "0mm", isToday: true }} />

        {/* Arrow inserted before the last card */}
        <Box sx={{ mx: 2, fontSize: '2rem' }}>&#8594;</Box>

        <ForecastCard data={{ date: "26/08", rain: "0mm", isTomorrow: true }} />
      </Box>


      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <Box sx={{ flexGrow: 1, m: 2 }}>
        <Grid2 container spacing={2} alignItems="center" justifyContent="center">
          <Grid2 item size={{ xs: 12, sm: 4}} >
            <FormControl variant="outlined" sx={{ minWidth: 150 }} fullWidth>
              <InputLabel>Weather Type</InputLabel>
              <Select
                value={weatherType}
                onChange={handleWeatherTypeChange}
                label="Weather Type"
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