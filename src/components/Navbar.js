import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';

const NavBar = () => {
  // const [fromDate, setFromDate] = useState('');
  // const [toDate, setToDate] = useState('');
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    // <nav className="navbar">
    //   <h1>Weather Forecast</h1>

    //   {/* Navigation links using react-router-dom's Link */}
    //   <div className="nav-links">
    //     <Link to="/about">About us</Link>
    //     <Link to="/map">Map</Link>
    //     <Link to="/faq">FAQ</Link>
    //   </div>

    //   {/* Location Selector */}
    //   <div className="location-selector">
    //     <select>
    //       <option>Melbourne</option>
    //       <option>Sydney</option>
    //       <option>Brisbane</option>
    //     </select>
    //   </div>

    //   {/* Date Inputs
    //   <div className="date-selector">
    //     <label>From:</label>
    //     <input
    //       type="date"
    //       value={fromDate}
    //       onChange={(e) => setFromDate(e.target.value)}
    //     />
    //     <label>To:</label>
    //     <input
    //       type="date"
    //       value={toDate}
    //       onChange={(e) => setToDate(e.target.value)}
    //     />
    //   </div> */}
    // </nav>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu appbar"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography sx={{ textAlign: 'center' }}>
                    About us
                  </Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/map" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography sx={{ textAlign: 'center' }}>
                    Map
                  </Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/faq" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography sx={{ textAlign: 'center' }}>
                    FAQ
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Icon and title for md size */}
          <CloudRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Weather Forecast
          </Typography>

          {/* Icon and title for xs size */}
          <CloudRoundedIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Weather Forecast
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center'}}>
            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About us</Link>
            </Button>
            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              <Link to="/map" style={{ textDecoration: 'none', color: 'inherit' }}>Map</Link>
            </Button>
            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              <Link to="/faq" style={{ textDecoration: 'none', color: 'inherit' }}>FAQ</Link>
            </Button>
          </Box>
          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
