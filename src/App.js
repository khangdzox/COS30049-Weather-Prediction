import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/Navbar';
import ForecastCard from './components/ForecastCard';
import WeatherChart from './components/WeatherChart';
import About from './components/About'; // New component
import Map from './components/Map'; // New component
import FAQ from './components/FAQ'; // New component

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
    <Router>
      <div className="App">
        <NavBar />

        {/* Define Routes for different pages */}
        <Routes>
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<Map />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
