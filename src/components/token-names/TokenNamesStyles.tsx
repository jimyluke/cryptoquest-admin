import styled from '@emotion/styled';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'black',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    // width: '100px',
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#eee',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#ccc',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
