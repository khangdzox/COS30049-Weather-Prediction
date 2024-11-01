import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherChart from '../components/WeatherChart';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 150, mr: 2 }}>
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

        {/* From and To Date Inputs */}
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
          sx={{ mr: 2 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              min: fromDate,
            },
          }}
        />
      </Box>

      {/* Weather Chart */}
      <WeatherChart fromDate={fromDate} toDate={toDate} weatherType={weatherType} />
    </>
  );
}

export default Home;