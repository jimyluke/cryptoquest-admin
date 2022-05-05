import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import ModalComponent from '../modal/Modal';
import { StyledTableCell } from './TokenNamesStyles';

import { useAppDispatch, useAppSelector } from '../../store/store';
import { deleteTokenName, selectTokenNames } from '../../store/tokenNamesSlice';
import { ITokenName } from '../../types/tokenNames';

interface ITokenNameItemDelete {
  tokenName: ITokenName;
}

const TokenNameItemDelete = ({ tokenName }: ITokenNameItemDelete) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDeleting } = useAppSelector(selectTokenNames);

  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onHandleDelete = (tokenNameId: number, nftId: number) => {
    dispatch(deleteTokenName({ tokenNameId, nftId }));
  };

  return (
    <>
      <StyledTableCell align="center">
        <Button onClick={toggleModal} variant="contained" color="error">
          Delete
        </Button>
      </StyledTableCell>
      <ModalComponent
        isClosable={!isDeleting}
        onClose={toggleModal}
        isOpen={isModalOpen}
      >
        <div className="token-names__modal-content">
          <div>{`Are you sure you want to delete token name "${tokenName.token_name}" from rejected list?`}</div>
          <Button
            onClick={() => onHandleDelete(tokenName.id, tokenName.nft_id)}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={30} /> : 'Confirm'}
          </Button>
        </div>
      </ModalComponent>
    </>
  );
};

export default TokenNameItemDelete;
