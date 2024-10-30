import React, { useState } from 'react';

const NavBar = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <nav className="navbar">
      <h1>Weather Forecast</h1>
      <div className="nav-links">
        <a href="#about">About us</a>
        <a href="#map">Map</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="location-selector">
        <select>
          <option>Melbourne</option>
          <option>Sydney</option>
          <option>Brisbane</option>
        </select>
      </div>
    </nav>
  );
};

export default NavBar;