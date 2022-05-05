import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import ModalComponent from '../modal/Modal';
import { StyledTableCell } from './TokenNamesStyles';

import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  approveTokenName,
  selectTokenNames,
} from '../../store/tokenNamesSlice';
import { ITokenName } from '../../types/tokenNames';

interface ITokenNameItemApprove {
  tokenName: ITokenName;
}

const TokenNameItemApprove = ({ tokenName }: ITokenNameItemApprove) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isApproving } = useAppSelector(selectTokenNames);

  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onHandleApprove = (tokenNameId: number) => {
    dispatch(approveTokenName(tokenNameId));
  };

  return (
    <>
      <StyledTableCell align="center">
        <Button onClick={toggleModal} variant="contained" color="success">
          Approve
        </Button>
      </StyledTableCell>
      <ModalComponent
        isClosable={!isApproving}
        onClose={toggleModal}
        isOpen={isModalOpen}
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
    </>
  );
};

export default TokenNameItemApprove;
