import { Grid, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import BodySection from './BodySection';
import customMuiTheme from './customMuiTheme';
import Header from './Header';

const App = () => (
  <MuiThemeProvider theme={customMuiTheme}>
    <>
      <Grid
        style={{
          background: '#F2F4F5',
        }}
        container
        justify="center"
        alignContent="center"
        spacing={16}
      >
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12} md={9} lg={7}>
          <BodySection />
        </Grid>
      </Grid>
    </>
  </MuiThemeProvider>
);

export default App;
