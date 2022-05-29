import { useState } from 'react';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import ModalComponent from '../../components/modal/Modal';
import { cryptoQuestApi } from '../../api/api';
import { notify } from '../../utils/notify';
import { LOCAL_STORAGE_TOKEN } from '../../variables/global';

const RerenderNft = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onChangeTokenAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };

  const onConfirmHandler = async () => {
    try {
      setIsLoading(true);
      await cryptoQuestApi.post(
        '/api/admin/rerenderToken',
        {
          tokenAddress,
        },
        {
          headers: {
            'x-access-token': JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
            ),
          },
        }
      );
      notify(
        'success',
        `Rerendering and updating metadata for nft "${tokenAddress.slice(
          0,
          8
        )}..." in progress`
      );
      setTokenAddress('');
      toggleModal();
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rerender-nft">
      <Typography variant="h4" component="div">
        Rerender token
      </Typography>
      <TextField
        style={{ backgroundColor: 'white' }}
        value={tokenAddress}
        onChange={onChangeTokenAddress}
        id="tokenAddress"
        type="text"
        required
        label="Token Address"
        variant="outlined"
      />
      <Button
        className="rerender-nft__button"
        disabled={!tokenAddress}
        onClick={toggleModal}
        variant="contained"
        color="success"
      >
        Rerender
      </Button>
      <ModalComponent onClose={toggleModal} isOpen={isModalOpen}>
        <div className="rerender-nft__modal-content">
          <div className="rerender-nft__modal-content-text">{`Are you sure you want to rerender NFT "${tokenAddress.slice(
            0,
            8
          )}..."?`}</div>
          <Button
            onClick={onConfirmHandler}
            variant="contained"
            color="success"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={30} style={{ color: 'white' }} />
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default RerenderNft;
