import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Typography,
  makeStyles,
  TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination,
  Paper,
  lighten,
  Toolbar,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'lightblue',
    height: (props) => props.height
  },

  toolBar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: 'FloralWhite'
  },

  container: {
    display: 'flex',
    backgroundColor: 'Tomato',
    '&.header': {
    },
    '&.body': {
      flex: 1,
      backgroundColor: 'MintCream',
    },
    '&.footer': {
    }
  },

  tableHeaderCell: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 14,
  }
}));

const RTable2 = (props) => {
  const classes = useStyles(props, props.theme);
  const {
    bgVariant,
    bgElevation,
    bgSquare,

    showToolBar,
    toolBarSize,

    dense,
    rowsPerPage,
    rows,
  } = props;

  const [page, setPage] = React.useState(0);

  const tableSize = dense ? 'small' : 'medium';
  const onChangePage = (e) => {
    //todo
  };

  return (
    <Paper elevation={bgElevation} variant={bgVariant} square={bgSquare} className={classes.root}>

      {showToolBar && (<Toolbar className={classes.toolBar} variant={toolBarSize}>
        <Typography color="inherit" variant="subtitle1" component="div">
          Title 2
        </Typography>
      </Toolbar>)}

      <TableContainer className={clsx(classes.container, 'header')}>
        <Table size={tableSize} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={clsx(classes.tableHeaderCell)}>ID</TableCell>
              <TableCell className={clsx(classes.tableHeaderCell)}>Name</TableCell>
              <TableCell className={clsx(classes.tableHeaderCell)}>Bio</TableCell>
              <TableCell className={clsx(classes.tableHeaderCell)}>Actions</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer className={clsx(classes.container, 'body')}>
        <Table size={tableSize}>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIdx) => {
              return (
                <TableRow
                  hover
                  key={rowIdx}
                >
                  <TableCell>{row.Id}</TableCell>
                  <TableCell>{row.Name}</TableCell> 
                  <TableCell>{row.Bio}</TableCell> 
                  <TableCell>
                    <Button
                      size='small'
                      variant='outlined'
                      color='primary'
                    >
                      Action 1
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className={clsx(classes.container, 'footer')}>
        <Table size={tableSize}>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={page}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                // rowsPerPageOptions={[5]}
                onChangePage={onChangePage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

    </Paper>
  );
};

RTable2.defaultProps = {
  bgVariant: 'elevation',
  bgElevation: 4,
  bgSquare: false,

  showToolBar: true,
  toolBarSize: 'dense',

  dense: true,
  rowsPerPage: -1
};

RTable2.propTypes = {
  variant: PropTypes.string,
  elevation: PropTypes.number,
  square: PropTypes.bool,

  showToolBar: PropTypes.bool,
  toolBarSize: PropTypes.string,

  dense: PropTypes.bool,
  rowsPerPage: PropTypes.number,
  rows: PropTypes.array.isRequired,
};

export default RTable2;