import { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

import TokenNamesItem from './TokenNamesItem';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import { StyledTableCell } from './TokenNamesStyles';

import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchTokenNames, selectTokenNames } from '../../store/tokenNamesSlice';
import { ITokenName } from '../../types/tokenNames';

const TokenNamesList = () => {
  const {
    entities: tokenNames,
    isLoading,
    error,
  } = useAppSelector(selectTokenNames);
  const [sortedTokenNames, setSortedTokenNames] =
    useState<ITokenName[]>(tokenNames);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('Asc');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenNames());
  }, []);

  useEffect(() => {
    if (tokenNames) {
      let tokenNamesList;

      if (sortBy === 'id') {
        tokenNamesList = tokenNames
          .slice()
          .sort((a, b) =>
            (sortOrder === 'Asc' ? a.id < b.id : a.id > b.id) ? -1 : 1
          );
      } else if (sortBy === 'mint_name') {
        tokenNamesList = tokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === 'Asc'
                ? a.mint_name < b.mint_name
                : a.mint_name > b.mint_name
            )
              ? -1
              : 1
          );
      } else if (sortBy === 'token_name') {
        tokenNamesList = tokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === 'Asc'
                ? a.token_name < b.token_name
                : a.token_name > b.token_name
            )
              ? -1
              : 1
          );
      } else {
        tokenNamesList = tokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === 'Asc'
                ? a.updated_at < b.updated_at
                : a.updated_at > b.updated_at
            )
              ? -1
              : 1
          );
      }

      setSortedTokenNames(tokenNamesList);
    }
  }, [tokenNames, sortBy, sortOrder]);

  const onSortTokenNamesHandler = (sortByParam: string) => {
    if (sortByParam !== sortBy) {
      setSortBy(sortByParam);
      setSortOrder('Asc');
    } else {
      setSortOrder((prev) => (prev === 'Asc' ? 'Desc' : 'Asc'));
    }
  };

  return (
    <>
      {error && <Error error={error} />}
      {isLoading && !error && <Spinner flex />}
      {!isLoading &&
        !error &&
        sortedTokenNames &&
        sortedTokenNames.length === 0 && (
          <Typography variant="h4" component="h4">
            All names processed
          </Typography>
        )}
      {!isLoading && !error && sortedTokenNames && sortedTokenNames.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  onClick={() => onSortTokenNamesHandler('id')}
                  className="cursor-pointer"
                >
                  ID
                </StyledTableCell>
                <StyledTableCell
                  onClick={() => onSortTokenNamesHandler('date')}
                  className="cursor-pointer"
                >
                  Date
                </StyledTableCell>
                <StyledTableCell
                  onClick={() => onSortTokenNamesHandler('mint_name')}
                  className="cursor-pointer"
                >
                  Mint Name
                </StyledTableCell>
                <StyledTableCell
                  onClick={() => onSortTokenNamesHandler('token_name')}
                  className="cursor-pointer"
                >
                  Token Name
                </StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Approve</StyledTableCell>
                <StyledTableCell align="center">Reject</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTokenNames.map((tokenName) => (
                <TokenNamesItem key={tokenName.id} tokenName={tokenName} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default TokenNamesList;
