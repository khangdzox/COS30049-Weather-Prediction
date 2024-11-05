import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  MenuItem,
  Button,
  FormControl,
  Select,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';

const mapLinkToLabel = {
  '/': 'Home',
  '/visitor': 'Visitor',
  '/map': 'Map',
  '/about': 'About us',
  '/faq': 'FAQ',
}

const NavBar = ({ location, setLocation }) => {
  // const [fromDate, setFromDate] = useState('');
  // const [toDate, setToDate] = useState('');
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky" sx={{mb: 3}}>
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
              {Object.entries(mapLinkToLabel).map(([link, label]) => (
                <MenuItem key={link} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: 'center', color: 'inherit', textDecoration: 'none' }}
                    component={Link}
                    to={link}
                  >
                    {label}
                  </Typography>
                </MenuItem>
              ))}
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
            {Object.entries(mapLinkToLabel).map(([link, label]) => (
              <Button
                key={link}
                sx={{ mx: 2, color: 'white' }}
                component={Link}
                to={link}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* Location Selector */}
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                value={location}
                onChange={handleLocationChange}
                displayEmpty
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select Location
                </MenuItem>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
