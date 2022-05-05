import { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { List } from '@mui/icons-material';

import TokenNamesItem from './TokenNamesItem';
import Spinner from '../spinner/Spinner';
import { StyledTableCell } from './TokenNamesStyles';

import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchTokenNames,
  selectTokenNames,
  setFilter,
} from '../../store/tokenNamesSlice';
import {
  TokenNamesFiltersEnum,
  TokenNamesSortByEnum,
  TokenNamesSortOrderEnum,
  TokenNamesStatusesEnum,
} from '../../variables/tokenNames';
import { ITokenName } from '../../types/tokenNames';

const TokenNamesList = () => {
  const {
    entities: tokenNames,
    isLoading,
    error,
    filter,
  } = useAppSelector(selectTokenNames);
  const [sortedTokenNames, setSortedTokenNames] =
    useState<ITokenName[]>(tokenNames);
  const [sortBy, setSortBy] = useState(TokenNamesSortByEnum.DATE);
  const [sortOrder, setSortOrder] = useState(TokenNamesSortOrderEnum.ASC);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenNames());
  }, []);

  useEffect(() => {
    if (tokenNames) {
      let tokenNamesList;
      let filteredTokenNames = tokenNames;
      if (filter === TokenNamesFiltersEnum.APPROVED) {
        filteredTokenNames = tokenNames.filter(
          (tokenName) =>
            tokenName.token_name_status === TokenNamesStatusesEnum.APPROVED
        );
      } else if (filter === TokenNamesFiltersEnum.REJECTED) {
        filteredTokenNames = tokenNames.filter(
          (tokenName) =>
            tokenName.token_name_status === TokenNamesStatusesEnum.REJECTED
        );
      } else if (filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION) {
        filteredTokenNames = tokenNames.filter(
          (tokenName) =>
            tokenName.token_name_status ===
            TokenNamesStatusesEnum.UNDER_CONSIDERATION
        );
      }

      if (sortBy === TokenNamesSortByEnum.ID) {
        tokenNamesList = filteredTokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === TokenNamesSortOrderEnum.ASC
                ? a.id < b.id
                : a.id > b.id
            )
              ? -1
              : 1
          );
      } else if (sortBy === TokenNamesSortByEnum.MINT_NAME) {
        tokenNamesList = filteredTokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === TokenNamesSortOrderEnum.ASC
                ? a.mint_name < b.mint_name
                : a.mint_name > b.mint_name
            )
              ? -1
              : 1
          );
      } else if (sortBy === TokenNamesSortByEnum.TOKEN_NAME) {
        tokenNamesList = filteredTokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === TokenNamesSortOrderEnum.ASC
                ? a.token_name < b.token_name
                : a.token_name > b.token_name
            )
              ? -1
              : 1
          );
      } else if (sortBy === TokenNamesSortByEnum.STATUS) {
        tokenNamesList = filteredTokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === TokenNamesSortOrderEnum.ASC
                ? a.token_name_status < b.token_name_status
                : a.token_name_status > b.token_name_status
            )
              ? -1
              : 1
          );
      } else {
        tokenNamesList = filteredTokenNames
          .slice()
          .sort((a, b) =>
            (
              sortOrder === TokenNamesSortOrderEnum.ASC
                ? a.updated_at < b.updated_at
                : a.updated_at > b.updated_at
            )
              ? -1
              : 1
          );
      }

      setSortedTokenNames(tokenNamesList);
    }
  }, [tokenNames, filter, sortBy, sortOrder]);

  const onSortTokenNamesHandler = (sortByParam: TokenNamesSortByEnum) => {
    if (sortByParam !== sortBy) {
      setSortBy(sortByParam);
      setSortOrder(TokenNamesSortOrderEnum.ASC);
    } else {
      setSortOrder((prev) =>
        prev === TokenNamesSortOrderEnum.ASC
          ? TokenNamesSortOrderEnum.DESC
          : TokenNamesSortOrderEnum.ASC
      );
    }
  };

  const handleChangeSelect = (e: SelectChangeEvent<TokenNamesFiltersEnum>) => {
    dispatch(setFilter(e.target.value as TokenNamesFiltersEnum));
  };

  return (
    <>
      <FormControl className="token-names__select-form" fullWidth>
        <InputLabel id="select-token-names">Token names</InputLabel>
        <Select
          labelId="select-token-names"
          id="select-token-names"
          value={filter}
          label="Token Names"
          onChange={handleChangeSelect}
        >
          <MenuItem value={TokenNamesFiltersEnum.UNDER_CONSIDERATION}>
            Under Consideration
          </MenuItem>
          <MenuItem value={TokenNamesFiltersEnum.APPROVED}>Approved</MenuItem>
          <MenuItem value={TokenNamesFiltersEnum.REJECTED}>Rejected</MenuItem>
          <MenuItem value={TokenNamesFiltersEnum.ALL}>All token names</MenuItem>
        </Select>
      </FormControl>

      {error && <Alert severity="error">{error.message}</Alert>}
      {isLoading && !error && <Spinner flex />}

      {!isLoading &&
        !error &&
        sortedTokenNames &&
        sortedTokenNames.length === 0 && (
          <div className="token-names__info">
            <List style={{ fontSize: '100px' }} />
            <Typography
              style={{ textAlign: 'center' }}
              variant="h4"
              component="h4"
            >
              List is empty
            </Typography>
          </div>
        )}

      {!isLoading && !error && sortedTokenNames && sortedTokenNames.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell
                  onClick={() =>
                    onSortTokenNamesHandler(TokenNamesSortByEnum.ID)
                  }
                  className="cursor-pointer"
                >
                  ID
                </StyledTableCell>
                <StyledTableCell
                  onClick={() =>
                    onSortTokenNamesHandler(TokenNamesSortByEnum.DATE)
                  }
                  className="cursor-pointer"
                >
                  Last Update
                </StyledTableCell>
                <StyledTableCell
                  onClick={() =>
                    onSortTokenNamesHandler(TokenNamesSortByEnum.MINT_NAME)
                  }
                  className="cursor-pointer"
                >
                  Mint Name
                </StyledTableCell>
                <StyledTableCell
                  onClick={() =>
                    onSortTokenNamesHandler(TokenNamesSortByEnum.TOKEN_NAME)
                  }
                  className="cursor-pointer"
                >
                  Token Name
                </StyledTableCell>
                <StyledTableCell
                  onClick={() =>
                    onSortTokenNamesHandler(TokenNamesSortByEnum.STATUS)
                  }
                  className="cursor-pointer"
                >
                  Status
                </StyledTableCell>
                <StyledTableCell align="center">Explorers</StyledTableCell>
                {(filter === TokenNamesFiltersEnum.APPROVED ||
                  filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION ||
                  filter === TokenNamesFiltersEnum.ALL) && (
                  <StyledTableCell align="center">Edit</StyledTableCell>
                )}
                {(filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION ||
                  filter === TokenNamesFiltersEnum.ALL) && (
                  <StyledTableCell align="center">Approve</StyledTableCell>
                )}
                {(filter === TokenNamesFiltersEnum.APPROVED ||
                  filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION ||
                  filter === TokenNamesFiltersEnum.ALL) && (
                  <StyledTableCell align="center">Reject</StyledTableCell>
                )}
                {(filter === TokenNamesFiltersEnum.REJECTED ||
                  filter === TokenNamesFiltersEnum.ALL) && (
                  <StyledTableCell align="center">Delete</StyledTableCell>
                )}
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
