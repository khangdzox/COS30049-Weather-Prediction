import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ScatterGraph from '../components/ScatterGraph';
import LineGraph from '../components/LineGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Grid2, Typography, Button, Alert, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

const mapNameToLabel = {
  Date: 'Date',
  State: 'State',
  "Monthly rainfall": 'Monthly rainfall (mm)',
  "Monthly mean daily global solar exposure": 'Monthly mean daily global solar exposure (MJ/m^2/day)',
  "Monthly mean minimum temperature": 'Monthly mean minimum temperature (°C)',
  "Monthly mean maximum temperature": 'Monthly mean maximum temperature (°C)',
  "Monthly number of arriving visitors": 'Monthly number of arriving visitors',
}

function Home() {
  const [location, setLocation] = useOutletContext();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [firstCol, setfirstCol] = useState('');
  const [secondCol, setsecondCol] = useState('');
  const [firstData, setFirstData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const [formResult, setFormResults] = useState({severity: '', message: ''});
  const [missingFields, setMissingFields] = useState([]);
  const [formData, setFormData] = useState({
    Year: '',
    Month: '',
    State: '',
    "Monthly rainfall": '',
    "Monthly mean daily global solar exposure": '',
    "Monthly mean minimum temperature": '',
    "Monthly mean maximum temperature": '',
  });

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;

    // Update form data based on the input field
    setFormData((prevFormData) => {
      let updatedFormData;

      // If name is Date, split the value into Year, Month and Day
      if (name === 'Date') {
        const [year, month] = value.split('-');
        updatedFormData = { ...prevFormData, Year: year, Month: month };

      // Else, update the form data with the new value
      } else {
        updatedFormData = { ...prevFormData, [name]: value };
      }

      return updatedFormData;
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    let _missingFields = [];

    for (const key in formData) {

      if (formData[key] === '') {

        if ((key === 'Month' || key === 'Year') && !_missingFields.includes('Date')) {
          _missingFields.push('Date');
        } else {
          _missingFields.push(key);
        }
      }
    }

    if (_missingFields.length > 0) {
      setFormResults({severity: 'error', message: 'Please fill in the required fields.'});
      setMissingFields(_missingFields);
    } else {
      setFormResults({severity: 'success', message: 'Weather data submitted successfully!'});
      setMissingFields([]);
    }
  }

  const handleFormReset = () => {
    setFormData({
      Year: '',
      Month: '',
      State: '',
      "Monthly rainfall": '',
      "Monthly mean daily global solar exposure": '',
      "Monthly mean minimum temperature": '',
      "Monthly mean maximum temperature": '',
    });
    setFormResults({severity: '', message: ''});
    setMissingFields([]);
  }

  const handleFirstColChange = (event) => setfirstCol(event.target.value);
  const handleSecondColChange = (event) => setsecondCol(event.target.value);

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
    // fetch(`http://localhost:3000/data/visitor?column=${firstData}&from=${fromDate}&to=${toDate}`)
    // .then(response => response.json())
    // .then(data => setFirstData(data))
    // .catch(error => console.error('Error fetching data:', error));

    setFirstData([
      {"Date": '2020-01', "Monthly rainfall": 41.2},
      {"Date": '2020-02', "Monthly rainfall": 34.6},
      {"Date": '2020-03', "Monthly rainfall": 24.6},
      {"Date": '2020-04', "Monthly rainfall": 39.6},
      {"Date": '2020-05', "Monthly rainfall": 78.4},
      {"Date": '2020-06', "Monthly rainfall": 27.6},
      {"Date": '2020-07', "Monthly rainfall": 35},
      {"Date": '2020-08', "Monthly rainfall": 31},
      {"Date": '2020-09', "Monthly rainfall": 65.2},
      {"Date": '2020-10', "Monthly rainfall": 124.4},
      {"Date": '2020-11', "Monthly rainfall": 38.2},
      {"Date": '2020-12', "Monthly rainfall": 18.4},
    ]);

  }, [firstCol, fromDate, toDate]);

  useEffect(() => {
    if (secondCol === 'Date') {
      setSecondData([]);
      return;
    }

    // fetch(`http://localhost:3000/data/visitor?column=${secondData}&from=${fromDate}&to=${toDate}`)
    // .then(response => response.json())
    // .then(data => setSecondData(data))
    // .catch(error => console.error('Error fetching data:', error));

    setSecondData([
      {"Date": '2020-01', "Monthly number of arriving visitors": 60170},
      {"Date": '2020-02', "Monthly number of arriving visitors": 70240},
      {"Date": '2020-03', "Monthly number of arriving visitors": 70440},
      {"Date": '2020-04', "Monthly number of arriving visitors": 57450},
      {"Date": '2020-05', "Monthly number of arriving visitors": 44090},
      {"Date": '2020-06', "Monthly number of arriving visitors": 44130},
      {"Date": '2020-07', "Monthly number of arriving visitors": 60560},
      {"Date": '2020-08', "Monthly number of arriving visitors": 54180},
      {"Date": '2020-09', "Monthly number of arriving visitors": 47200},
      {"Date": '2020-10', "Monthly number of arriving visitors": 69020},
      {"Date": '2020-11', "Monthly number of arriving visitors": 78130},
      {"Date": '2020-12', "Monthly number of arriving visitors": 89380},
    ]);

  }, [secondCol, fromDate, toDate]);

  return (
    <>
      {/* Responsive Form for Weather Data Inputs */}
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h5" align="left" gutterBottom>Manual Montly Weather Data Inputs</Typography>

        <form noValidate onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            {
              Object.entries(mapNameToLabel).map(([name, label]) => {
                if (name === 'Date') {
                  return (
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
                } else if (name !== "Monthly number of arriving visitors") {
                  return (
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
                } else {
                  return null;
                }
              })
            }

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
        <Typography variant="h5" align="left" gutterBottom>Weather to Visitors Data Chart</Typography>

        <Grid2 container spacing={2} alignItems="center" justifyContent="center">
          <Grid2 size={{ xs: 12, sm: 3}} >
            <FormControl variant="outlined" fullWidth>
              <InputLabel>First Data Type</InputLabel>
              <Select
              value={firstCol}
              onChange={handleFirstColChange}
              label="First Data Type"
              sx={{ textAlign: 'left' }}
              >
                <MenuItem value="Monthly rainfall">Monthly rainfall (mm)</MenuItem>
                <MenuItem value="Monthly mean daily global solar exposure">Monthly mean daily global solar exposure (MJ/m^2/day)</MenuItem>
                <MenuItem value="Monthly mean minimum temperature">Monthly mean minimum temperature (°C)</MenuItem>
                <MenuItem value="Monthly mean maximum temperature">Monthly mean maximum temperature (°C)</MenuItem>
                <MenuItem value="Monthly number of arriving visitors">Monthly number of arriving visitors</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3}} >
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Second Data Type</InputLabel>
              <Select
              value={secondCol}
              onChange={handleSecondColChange}
              label="Second Data Type"
              sx={{ textAlign: 'left' }}
              >
                <MenuItem value="Date">Date</MenuItem>
                <MenuItem value="Monthly rainfall">Monthly rainfall (mm)</MenuItem>
                <MenuItem value="Monthly mean daily global solar exposure">Monthly mean daily global solar exposure (MJ/m^2/day)</MenuItem>
                <MenuItem value="Monthly mean minimum temperature">Monthly mean minimum temperature (°C)</MenuItem>
                <MenuItem value="Monthly mean maximum temperature">Monthly mean maximum temperature (°C)</MenuItem>
                <MenuItem value="Monthly number of arriving visitors">Monthly number of arriving visitors</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3}} >
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

          <Grid2 size={{ xs: 12, sm: 3}} >
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
        <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2 }}>
          {(!firstCol || !secondCol || !fromDate || !toDate) ? (
            <Alert severity="info">Please select the weather types and dates to display the chart.</Alert>
          ) : (secondCol === "Date") ? (
            <LineGraph data={firstData} dataName={firstCol} displayName={mapNameToLabel[firstCol]}/>
          ) : (
            <ScatterGraph
            firstData={firstData}
            firstDataName={firstCol}
            firstDisplayName={mapNameToLabel[firstCol]}
            secondData={secondData}
            secondDataName={secondCol}
            secondDisplayName={mapNameToLabel[secondCol]}
            />
          )}
        </Paper>
      </Box>

    </>
  );
}

export default Home;
