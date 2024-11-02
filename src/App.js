import React from 'react';
import './App.css';
import NavBar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

function App() {

  return (
    <div className="App">
      <NavBar />
      <Container fixed>
        <Outlet />
      </Container>
    </div>
  );
}
export default App;

