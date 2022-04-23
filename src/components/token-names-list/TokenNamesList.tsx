import { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import { cryptoQuestApi } from '../../api/api';
import { ITokenName } from '../../types/tokenNames';
import { notify } from '../../utils/notify';
import styled from '@emotion/styled';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'black',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#eee',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TokenNamesList = () => {
  const [tokenNames, setTokenNames] = useState<ITokenName[]>([]);

  useEffect(() => {
    const loadTokenNames = async () => {
      const response = await cryptoQuestApi.get('api/tokenNames');

      setTokenNames(response.data);
    };
    loadTokenNames();
  }, []);

  const onHandleApprove = async (tokenNameId: number) => {
    try {
      const response = await cryptoQuestApi.post('api/tokenNames/approve', {
        tokenNameId,
      });
      notify('success', response.data.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        notify('error', error.response.data.message);
      } else {
        notify('error', error.message);
      }
    }
  };

  const onHandleReject = async (tokenNameId: number) => {
    try {
      const response = await cryptoQuestApi.post('api/tokenNames/reject', {
        tokenNameId,
      });
      notify('success', response.data.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        notify('error', error.response.data.message);
      } else {
        notify('error', error.message);
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Token Name</StyledTableCell>
            {/* <StyledTableCell align="center">Edit</StyledTableCell> */}
            <StyledTableCell align="center">Approve</StyledTableCell>
            <StyledTableCell align="center">Reject</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokenNames.map((tokenName) => (
            <StyledTableRow
              key={tokenName.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell
                style={{ fontSize: 24, fontWeight: 'bold' }}
                component="th"
                scope="row"
              >
                {tokenName.id}
              </StyledTableCell>
              <StyledTableCell style={{ fontSize: 24, fontWeight: 'bold' }}>
                {tokenName.token_name}
              </StyledTableCell>
              {/* <StyledTableCell align="center">
                <Button variant="contained">Edit</Button>
              </StyledTableCell> */}
              <StyledTableCell align="center">
                <Button
                  onClick={() => onHandleApprove(tokenName.id)}
                  variant="contained"
                  color="success"
                >
                  Approve
                </Button>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button
                  onClick={() => onHandleReject(tokenName.id)}
                  variant="contained"
                  color="error"
                >
                  Reject
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TokenNamesList;
