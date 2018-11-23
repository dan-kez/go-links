import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { HeaderText } from './config.json';
import Logo from './logo.png';

const Header: React.FC<{}> = () => (
  <AppBar position="static">
    <Toolbar>
      <img
        src={Logo}
        alt="logo"
        height="32px"
        width="auto"
        style={{ marginRight: 12 }}
      />
      <Typography variant="h5" color="inherit">
        {HeaderText || ''}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
