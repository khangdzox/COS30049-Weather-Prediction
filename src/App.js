import React from 'react';
import './App.css';
import NavBar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

function App() {
  const [location, setLocation] = React.useState('VIC');

  return (
    <div className="App">
      <NavBar location={location} setLocation={setLocation}/>
      <Container fixed>
        <Outlet context={[location, setLocation]}/>
      </Container>
    </div>
  );
}
export default App;

