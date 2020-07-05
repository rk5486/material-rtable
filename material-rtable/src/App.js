import React from 'react';
import logo from './logo.svg';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';

import RTable, { Column } from './components/RTable'

const styles = makeStyles(theme => ({
  root: {
    marginTop: '1em',
    padding: '1em',
  }
}));

const App = () => {
  const classes = styles;

  const columns = [
    Column({ index: 0, fieldName: 'Id', caption: 'Id', numeric: true }),
    Column({ index: 1, fieldName: 'Name', caption: 'Name', numeric: false }),
    Column({ index: 2, fieldName: 'Comments', caption: 'Comments', numeric: false }),
  ];

  const actions = [
    (e) => alert(e.target.innerText),
    (e) => alert(e.target.innerText)
  ];

  const getRows = () => {
    let rows = [];
    for (let i = 0; i < 75; i++) {
      rows.push({ Id: i + 1, Name: `test ${i + 1}`, Date: new Date().toDateString(), Comments: 'Nothing' })
    }
    return rows;
  };

  return (
    <div className="App">
      <Grid container spacing={4}>
        <Grid item lx={12} md={8}>
          <Paper className={classes.root}>
            <RTable
              rows={getRows()}
              tableTitle='Sample Table 1'
              canSelectMultiple
              showActionColumn
              customActions={actions}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
