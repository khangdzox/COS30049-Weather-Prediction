import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <nav className="navbar">
      <h1>Weather Forecast</h1>
      
      {/* Navigation links using react-router-dom's Link */}
      <div className="nav-links">
        <Link to="/about">About us</Link>
        <Link to="/map">Map</Link>
        <Link to="/faq">FAQ</Link>
      </div>

      {/* Location Selector */}
      <div className="location-selector">
        <select>
          <option>Melbourne</option>
          <option>Sydney</option>
          <option>Brisbane</option>
        </select>
      </div>

      {/* Date Inputs
      <div className="date-selector">
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
      </div> */}
    </nav>
  );
};

export default NavBar;
