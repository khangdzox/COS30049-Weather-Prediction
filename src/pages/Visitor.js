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
  "Number of arriving visitors": 'Monthly number of arriving visitors',
}

function Home() {
  const [location, setLocation] = useOutletContext();
  const [isLoadingFirst, setIsLoadingFirst] = useState(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState(false);
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

  // Update form data based on the input field
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

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    let _missingFields = [];

    // Check if any required fields are missing
    for (const key in formData) {

      if (formData[key] === '') {

        if ((key === 'Month' || key === 'Year') && !_missingFields.includes('Date')) {
          _missingFields.push('Date');
        } else {
          _missingFields.push(key);
        }
      }
    }

    // If any required fields are missing, display an error message
    if (_missingFields.length > 0) {
      setFormResults({severity: 'error', message: 'Please fill in the required fields.'});
      setMissingFields(_missingFields);

    // Else, submit the form data
    } else {
      setMissingFields([]);
      fetch('/api/predict/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        // Display the predicted number of visitors
        setFormResults({severity: 'success', message: `Predicted number of visitors: ${data['Number of arriving visitors']} visitors.`});
      })
      .catch((error) => {
        console.error('Error:', error);
        setFormResults({severity: 'error', message: 'An error occurred while submitting the form.'});
      });
    }
  }

  // Handle form reset
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

  // Handle data input changes
  const handleFirstColChange = (event) => setfirstCol(event.target.value);
  const handleSecondColChange = (event) => setsecondCol(event.target.value);

  // Handle date input changes
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

  // Fetch the first data based on the selected location, first column, from date and to date
  useEffect(() => {
    setFirstData([]);

    if (location && firstCol && fromDate && toDate) {
      setIsLoadingFirst(true);
      fetch(`/api/data/visitors?state=${location}&columns=${firstCol}&fromDate=${fromDate}&toDate=${toDate}`)
      .then(response => response.json())
      .then(data => {
        setFirstData(data)
        setIsLoadingFirst(false);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [location, firstCol, fromDate, toDate]);

  // Fetch the second data based on the selected location, second column, from date and to date
  useEffect(() => {
    setSecondData([]);

    if (location && secondCol && fromDate && toDate) {
      setIsLoadingSecond(true);

      if (secondCol === 'Date') {setIsLoadingSecond(false); return;}

      fetch(`/api/data/visitors?state=${location}&columns=${secondCol}&fromDate=${fromDate}&toDate=${toDate}`)
      .then(response => response.json())
      .then(data => {
        setSecondData(data);
        setIsLoadingSecond(false);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [location, secondCol, fromDate, toDate]);

  return (
    <>
      {/* Responsive Form for Weather Data Inputs */}
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h5" align="left" gutterBottom>Manual Data Inputs</Typography>

        {/* Form for manual data inputs */}
        <form noValidate onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            {
              Object.entries(mapNameToLabel).map(([name, label]) => {
                if (name === 'Date') {
                  return (
                    // Date input field
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <TextField
                      required
                      error={missingFields.includes('Date')}
                      label={label}
                      type="month"
                      fullWidth
                      name={name}
                      value={
                        (formData.Year && formData.Month) ?
                        `${formData.Year}-${formData.Month}` :
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
                    // State input field
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
                } else if (name !== "Number of arriving visitors") {
                  return (
                    // Other input fields
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

            {/* Submit and Clear Buttons */}
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

        {/* Display form results */}
        {/* If there is a form result, display an alert with the message */}
        {formResult.message && <Alert severity={formResult.severity}>{formResult.message}</Alert>}
      </Box>

      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="left" gutterBottom>Weather to Visitors Data Chart</Typography>

        {/* First Weather Data Input */}
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
                <MenuItem value="Number of arriving visitors">Monthly number of arriving visitors</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          {/* Second Weather Data Input */}
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
                <MenuItem value="Number of arriving visitors">Monthly number of arriving visitors</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          {/* Date Input */}
          <Grid2 size={{ xs: 12, sm: 3}} >
            <TextField
            label="From Month"
            type="month"
            value={fromDate}
            onChange={handleFromDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: '2000-01', max: '2019-12' }
            }}
            fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3}} >
            <TextField
            label="To Month"
            type="month"
            value={toDate}
            onChange={handleToDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: fromDate, max: '2019-12' }
            }}
            fullWidth
            />
          </Grid2>
        </Grid2>

        {/* Weather Chart */}
        {/* Display the weather chart based on the selected weather types and dates */}
        {/* If the required fields are missing or the data is loading, display an info alert */}
        {/* If the second column is Date, display a line graph */}
        {/* Else, display a scatter graph */}
        <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2 }}>
          {(!firstCol || !secondCol || !fromDate || !toDate) ? (
            <Alert severity="info">Please select the weather types and dates to display the chart.</Alert>
          ) : (isLoadingFirst || isLoadingSecond) ? (
            <Alert severity="info">Loading...</Alert>
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
