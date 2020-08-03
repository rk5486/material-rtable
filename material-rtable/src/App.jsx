import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import logo from './logo.svg';
import './App.css';
import faker from 'faker';

import { makeStyles, Grid } from '@material-ui/core';

import RTable2 from './components/RTable2'
import RVirtualTable from './components/RVirtualTable'

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    background: 'lightgrey',
    flexDirection: 'column',
    padding: theme.spacing(),
    height: '100vh'
  },
  item: {
    padding: theme.spacing(),
    '&.head': {
      background: 'pink',
    },
    '&.body': {
      display: 'flex',
      flex: 1,
      background: 'Azure',
    },
    '&.footer': {
      color: 'lightgrey',
      background: 'black',
    },
  }
}));

const App = () => {
  const classes = styles();
  const [rows, setRows] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setRows(
      [...Array(100).keys()].map(key => {
        return {
          Id: key,
          Name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          Bio: faker.lorem.lines(Math.random() * 2)
        };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Grid container className={classes.root}>
        <Grid item className={clsx(classes.item, 'head')}>
          <h1>App {time.toISOString()}</h1>
        </Grid>

        <Grid item className={clsx(classes.item, 'body')}>
          {/* <RTable3 rows={rows} height={750}/> */}
          <RTable2
            rows={rows}
            rowsPerPage={16}
            // height={750}
          />
        </Grid>

        <Grid item className={clsx(classes.item, 'footer')}>
          <p>Footer</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
