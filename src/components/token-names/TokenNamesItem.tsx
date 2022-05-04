import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import ModalComponent from '../modal/Modal';
import { StyledTableCell, StyledTableRow } from './TokenNamesStyles';

import { ITokenName } from '../../types/tokenNames';
import { formatDate } from '../../utils/formatDate';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  approveTokenName,
  rejectTokenName,
  selectTokenNames,
} from '../../store/tokenNamesSlice';
import ROUTES from '../../routes/routes';

interface ITokenNamesItemProps {
  tokenName: ITokenName;
}

const TokenNamesItem = ({ tokenName }: ITokenNamesItemProps) => {
  const { isApproving, isRejecting } = useAppSelector(selectTokenNames);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const onHandleApprove = (tokenNameId: number) => {
    dispatch(approveTokenName(tokenNameId));
  };

  const onHandleReject = (tokenNameId: number) => {
    dispatch(rejectTokenName(tokenNameId));
  };

  const toggleApproveModal = () => {
    setIsApproveModalOpen((prev) => !prev);
  };

  const toggleRejectModal = () => {
    setIsRejectModalOpen((prev) => !prev);
  };

  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <StyledTableCell style={{ width: '40px' }} component="th" scope="row">
        {tokenName.id}
      </StyledTableCell>
      <StyledTableCell style={{ width: '180px' }} component="th" scope="row">
        {formatDate(tokenName.updated_at)}
      </StyledTableCell>
      <StyledTableCell style={{ width: '300px' }}>
        {tokenName.mint_name}
      </StyledTableCell>
      <StyledTableCell style={{ fontWeight: 'bold', width: '300px' }}>
        {tokenName.token_name}
      </StyledTableCell>
      <StyledTableCell align="center">
        <Link
          className="token-names__link"
          to={`${ROUTES.TOKEN_NAMES_PAGE}/${tokenName.id}`}
        >
          <Button variant="contained">Edit</Button>
        </Link>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Button
          onClick={toggleApproveModal}
          variant="contained"
          color="success"
        >
          Approve
        </Button>
      </StyledTableCell>
      <ModalComponent
        isClosable={!isApproving}
        onClose={toggleApproveModal}
        isOpen={isApproveModalOpen}
      >
        <div className="token-names__modal-content">
          <div>{`Are you sure you want to approve token name "${tokenName.token_name}"?`}</div>
          <Button
            onClick={() => onHandleApprove(tokenName.id)}
            variant="contained"
            color="success"
            disabled={isApproving}
          >
            {isApproving ? <CircularProgress size={30} /> : 'Confirm'}
          </Button>
        </div>
      </ModalComponent>
      <StyledTableCell align="center">
        <Button onClick={toggleRejectModal} variant="contained" color="error">
          Reject
        </Button>
      </StyledTableCell>
      <ModalComponent
        isClosable={!isRejecting}
        onClose={toggleRejectModal}
        isOpen={isRejectModalOpen}
      >
        <div className="token-names__modal-content">
          <div>{`Are you sure you want to reject token name "${tokenName.token_name}"?`}</div>
          <Button
            onClick={() => onHandleReject(tokenName.id)}
            variant="contained"
            color="error"
            disabled={isRejecting}
          >
            {isRejecting ? <CircularProgress size={30} /> : 'Confirm'}
          </Button>
        </div>
      </ModalComponent>
    </StyledTableRow>
  );
};

export default TokenNamesItem;
