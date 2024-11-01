import React, { useState } from 'react';
import './App.css';
import NavBar from './components/Navbar';
import ForecastCard from './components/ForecastCard';
import WeatherChart from './components/WeatherChart';

function App() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const forecastData = [
    { date: "22/08", rain: "0mm" },
    { date: "23/08", rain: "3mm" },
    { date: "24/08", rain: "2mm" },
    { date: "25/08", rain: "0mm", isToday: true },
    { date: "26/08", rain: "0mm", isTomorrow: true }
  ];

  return (
    <div className="App">
      <NavBar />

      <div className="forecast-container">
        {forecastData.map((data, index) => (
          <ForecastCard key={index} data={data} />
        ))}
        <div className="arrow">&#8594;</div>
      </div>

      {/* Weather selector and date inputs */}
      <div className="weather-selector">
        <select>
          <option>Rainfall</option>
          <option>Temperature</option>
          <option>Wind speed</option>
        </select>

        <div className="date-inputs">
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <WeatherChart />
    </div>
  );
}

export default App;
