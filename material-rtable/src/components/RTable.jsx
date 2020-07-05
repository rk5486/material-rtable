import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  TableContainer,
  Table,
  TableSortLabel,
  TableHead,
  TableFooter,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  makeStyles,
  lighten,
  Toolbar,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Button,
  Tooltip,
  IconButton
} from '@material-ui/core';

// import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
import { useState } from 'react';

const GetDisplayName = name =>
  (name.charAt(0).toUpperCase() + name.slice(1)).match(/[A-Z][a-z]+|[0-9]+/g).join(' ');

const Column = (props) => {
  const {
    fieldName,
    label,
    isNumeric,
    index,
    disablePadding
  } = props;

  return ({ fieldName, label, isNumeric, index });
}
Column.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  isNumeric: PropTypes.bool,
  index: PropTypes.number,
  disablePadding: PropTypes.bool,
};

const EnhancedTableHead = props => {
  const {
    classes,
    columns,
    order,
    orderBy,
    onRequestSort,

    canSelectMultiple,
    selectedCount,
    rowCount,
    onSelectAllClick,

    showActionColumn,
  } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {canSelectMultiple ? <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={selectedCount > 0 && selectedCount < rowCount}
            checked={rowCount > 0 && selectedCount === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell> : null}

        {columns.map(col => (
          <TableCell
            key={col.fieldName}
            align={col.numeric ? 'right' : 'left'}
            padding={col.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === col.fieldName ? order : false}
          >
            <TableSortLabel
              active={orderBy === col.fieldName}
              direction={orderBy === col.fieldName ? order : 'asc'}
              onClick={createSortHandler(col.fieldName)}
            >
              {col.label ?? col.fieldName}
              {orderBy === col.fieldName ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}

        {showActionColumn ? <TableCell>
          Actions
        </TableCell> : null}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,

  orderBy: (props, propName, componentName) => {
    if (props[propName] && !props['columns'].find(x => x.fieldName === props[propName]))
      throw new Error(`Invalid orderBy: column [${props[propName]}] not exits`);
  },
  
  order: PropTypes.oneOf(['asc', 'desc']),
  onRequestSort: PropTypes.func,

  canSelectMultiple: PropTypes.bool,

  rowCount: (props, propName, componentName) => {
    if (isNaN(props[propName]))
      throw new Error(`[${propName}] is not a number`);
    if (props['canSelectMultiple'] && props[propName] < 0)
      throw new Error(`[${propName}] is required`);
  },
  selectedCount: (props, propName, componentName) => {
    if (isNaN(props[propName]))
      throw new Error(`[${propName}] is not a number`);
    if (props['canSelectMultiple'] && props[propName])
      throw new Error(`[${propName}] is required`);
  },
  onSelectAllClick: PropTypes.func,

  showActionColumn: PropTypes.bool
};

EnhancedTableHead.defaultProps = {
  canSelectMultiple: false,
  showActionColumn: false,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight: theme.palette.type === 'light'
    ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    }
    : {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.dark,
    },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const {
    title,
    selectedCount,
    dense,
    handleChangeDense
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, { [classes.highlight]: selectedCount > 0 })}
    >
      {selectedCount > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {selectedCount} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        )
      }

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense"
      />

      {/* {selectedCount > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton aria-label='filter list'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

const useTableStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const RTable = props => {
  const {
    rows,
    columns,
    canSelectMultiple,
    tableTitle,
    customActions
  } = props;

  const autoColumns = rows.length > 0 ?
    Object.entries(rows[0])
      .map((x, idx) =>
        Column({ fieldName: x[0], label: GetDisplayName(x[0]), numeric: !isNaN(x[1]), index: idx })) : [];

  const classes = useTableStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(props.dense);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(x => x);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRowSelectedChanged = (event, row) => {
    if (event.target.checked)
      setSelected(selected.concat(row));
    else
      setSelected(selected.filter(x => x !== row));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const descendingComparator = (a, b, orderBy) => (
    b[orderBy] < a[orderBy] ? -1
      : b[orderBy] > a[orderBy] ? 1
        : 0
  );

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const isSelected = (dataRow) => selected.indexOf(dataRow) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.roort}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          selectedCount={selected.length}
          title={tableTitle}
          dense={dense}
          handleChangeDense={() => setDense(!dense)}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            aria-label='enhanced table'
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              columns={columns ?? autoColumns}
              selectedCount={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              canSelectMultiple={canSelectMultiple}
              showActionColumn={customActions.length > 0}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIdx) => {
                  const isRowSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${rowIdx}`;

                  return (
                    <TableRow
                      hover
                      aria-checked={isRowSelected}
                      tabIndex={-1}
                      key={rowIdx}
                      selected={isRowSelected}
                    >
                      {canSelectMultiple ? <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isRowSelected}
                          onChange={(e) => handleRowSelectedChanged(e, row)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell> : null}

                      {(columns ?? autoColumns).map(column => {
                        return (
                          <TableCell
                            key={column.fieldName}
                            align={column.numeric ? 'right' : 'left'}
                          >
                            {row[column.fieldName]}
                          </TableCell>
                        );
                      })}

                      {customActions.length > 0 ? <TableCell key='actionCell'>
                        {customActions.map((action, actionIdx) => {
                          const actionName =
                            (action.name & action.name.trim() !== '')
                              ? GetDisplayName(action.name) : `Action ${actionIdx}`;
                          return (
                            <Button
                              color='primary'
                              onClick={(e) => action(e, row)}
                            >
                              {actionName}
                            </Button>
                          );
                        })}
                      </TableCell> : null}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={(columns ?? autoColumns).length + 2} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={(columns ?? autoColumns).length + 2}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
RTable.defaultProps = {
  dense: false,
  canSelectMultiple: false,
  customActions: []
};
RTable.propTypes = {
  rows: PropTypes.array.isRequired,
  tableTitle: PropTypes.string.isRequired,
  customActions: PropTypes.arrayOf(PropTypes.func)
};

export default RTable;
export { EnhancedTableHead, EnhancedTableToolbar, Column };