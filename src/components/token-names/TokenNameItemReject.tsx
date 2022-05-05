import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import ModalComponent from '../modal/Modal';
import { StyledTableCell } from './TokenNamesStyles';

import { useAppDispatch, useAppSelector } from '../../store/store';
import { rejectTokenName, selectTokenNames } from '../../store/tokenNamesSlice';
import { ITokenName } from '../../types/tokenNames';

interface ITokenNameItemReject {
  tokenName: ITokenName;
}

const TokenNameItemReject = ({ tokenName }: ITokenNameItemReject) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isRejecting } = useAppSelector(selectTokenNames);

  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onHandleReject = (tokenNameId: number, nftId: number) => {
    dispatch(rejectTokenName({ tokenNameId, nftId }));
  };

  return (
    <>
      <StyledTableCell align="center">
        <Button onClick={toggleModal} variant="contained" color="error">
          Reject
        </Button>
      </StyledTableCell>
      <ModalComponent
        isClosable={!isRejecting}
        onClose={toggleModal}
        isOpen={isModalOpen}
      >
        <div className="token-names__modal-content">
          <div>{`Are you sure you want to reject token name "${tokenName.token_name}"?`}</div>
          <Button
            onClick={() => onHandleReject(tokenName.id, tokenName.nft_id)}
            variant="contained"
            color="error"
            disabled={isRejecting}
          >
            {isRejecting ? <CircularProgress size={30} /> : 'Confirm'}
          </Button>
        </div>
      </ModalComponent>
    </>
  );
};

export default TokenNameItemReject;
