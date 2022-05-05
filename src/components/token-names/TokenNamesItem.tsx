import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Check, ErrorOutline, Autorenew } from '@mui/icons-material';

import {
  TokenNamesFiltersEnum,
  TokenNamesStatusesEnum,
} from '../../variables/tokenNames';
import { formatDate } from '../../utils/formatDate';
import { useAppSelector } from '../../store/store';
import { selectTokenNames } from '../../store/tokenNamesSlice';
import ROUTES from '../../routes/routes';

import solanaExplorerImg from '../../assets/images/solana-explorer.png';
import solscanImg from '../../assets/images/solscan.png';
import TokenNameItemDelete from './TokenNameItemDelete';
import TokenNameItemReject from './TokenNameItemReject';
import TokenNameItemApprove from './TokenNameItemApprove';
import { StyledTableCell, StyledTableRow } from './TokenNamesStyles';
import { ITokenName } from '../../types/tokenNames';

interface ITokenNamesItemProps {
  tokenName: ITokenName;
}

const TokenNamesItem = ({ tokenName }: ITokenNamesItemProps) => {
  const { filter } = useAppSelector(selectTokenNames);

  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <StyledTableCell style={{ width: '40px' }} component="th" scope="row">
        {tokenName.id}
      </StyledTableCell>
      <StyledTableCell style={{ width: '200px' }} component="th" scope="row">
        {formatDate(tokenName.updated_at)}
      </StyledTableCell>
      <StyledTableCell style={{ width: '300px' }}>
        {tokenName.mint_name}
      </StyledTableCell>
      <StyledTableCell style={{ fontWeight: 'bold', width: '300px' }}>
        {tokenName.token_name}
      </StyledTableCell>
      <StyledTableCell>
        {tokenName.token_name_status === TokenNamesStatusesEnum.APPROVED ? (
          <div className="token-names__status token-names__status--approve">
            <Check style={{ color: 'white' }} />
          </div>
        ) : tokenName.token_name_status === TokenNamesStatusesEnum.REJECTED ? (
          <div className="token-names__status token-names__status--reject">
            <ErrorOutline style={{ color: 'white' }} />
          </div>
        ) : tokenName.token_name_status ===
          TokenNamesStatusesEnum.UNDER_CONSIDERATION ? (
          <div className="token-names__status token-names__status--under-consideration">
            <Autorenew style={{ color: 'white' }} />
          </div>
        ) : (
          <div></div>
        )}
      </StyledTableCell>

      <StyledTableCell align="center">
        <div className="token-names__explorers-cell">
          <a
            href={`https://explorer.solana.com/address/${tokenName.token_address}?cluster=${process.env.REACT_APP_SOLANA_CLUSTER}`}
            target="_blank"
            rel="noreferrer"
            title="Solana Explorer"
          >
            <img
              className="token-names__explorer-image"
              src={solanaExplorerImg}
              alt="Solana Explorer"
            />
          </a>
          <a
            href={`https://solscan.io/token/${tokenName.token_address}?cluster=${process.env.REACT_APP_SOLANA_CLUSTER}`}
            target="_blank"
            rel="noreferrer"
            title="Solscan"
          >
            <img
              className="token-names__explorer-image"
              src={solscanImg}
              alt="Solscan"
            />
          </a>
        </div>
      </StyledTableCell>

      {(filter === TokenNamesFiltersEnum.APPROVED ||
        filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION ||
        filter === TokenNamesFiltersEnum.ALL) &&
      (tokenName.token_name_status === TokenNamesStatusesEnum.APPROVED ||
        tokenName.token_name_status ===
          TokenNamesStatusesEnum.UNDER_CONSIDERATION) ? (
        <StyledTableCell align="center">
          <Link
            className="token-names__link"
            to={`${ROUTES.TOKEN_NAMES_PAGE}/${tokenName.id}`}
          >
            <Button variant="contained">Edit</Button>
          </Link>
        </StyledTableCell>
      ) : filter === TokenNamesFiltersEnum.ALL ? (
        <StyledTableCell align="center"></StyledTableCell>
      ) : null}

      {(filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION ||
        filter === TokenNamesFiltersEnum.ALL) &&
      tokenName.token_name_status ===
        TokenNamesStatusesEnum.UNDER_CONSIDERATION ? (
        <TokenNameItemApprove tokenName={tokenName} />
      ) : filter === TokenNamesFiltersEnum.ALL ? (
        <StyledTableCell align="center"></StyledTableCell>
      ) : null}

      {(filter === TokenNamesFiltersEnum.APPROVED ||
        filter === TokenNamesFiltersEnum.UNDER_CONSIDERATION ||
        filter === TokenNamesFiltersEnum.ALL) &&
      (tokenName.token_name_status === TokenNamesStatusesEnum.APPROVED ||
        tokenName.token_name_status ===
          TokenNamesStatusesEnum.UNDER_CONSIDERATION) ? (
        <TokenNameItemReject tokenName={tokenName} />
      ) : filter === TokenNamesFiltersEnum.ALL ? (
        <StyledTableCell align="center"></StyledTableCell>
      ) : null}

      {(filter === TokenNamesFiltersEnum.REJECTED ||
        filter === TokenNamesFiltersEnum.ALL) &&
      tokenName.token_name_status === TokenNamesStatusesEnum.REJECTED ? (
        <TokenNameItemDelete tokenName={tokenName} />
      ) : filter === TokenNamesFiltersEnum.ALL ? (
        <StyledTableCell align="center"></StyledTableCell>
      ) : null}
    </StyledTableRow>
  );
};

export default TokenNamesItem;
