import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { cryptoQuestApi } from '../../api/api';
import { notify } from '../../utils/notify';
import { LOCAL_STORAGE_TOKEN } from '../../variables/global';
import ModalComponent from '../modal/Modal';

const UpdateSolanaMetadata = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [metadataIpfsUrl, setMetadataIpfsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeTokenAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };

  const onChangeMetadataIpfsUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadataIpfsUrl(e.target.value);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onConfirmHandler = async () => {
    try {
      setIsLoading(true);
      await cryptoQuestApi.post(
        '/api/admin/updateMetadataUrlSolana',
        {
          tokenAddress,
          metadataIpfsUrl,
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
        `Metadata for nft "${tokenAddress.slice(
          0,
          8
        )}..." successfully updated on Solana`
      );
      setTokenAddress('');
      setMetadataIpfsUrl('');
      toggleModal();
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
      console.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-ipfs">
      <Typography variant="h4" component="div">
        Update Solana Metadata
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
      <TextField
        style={{ backgroundColor: 'white' }}
        value={metadataIpfsUrl}
        onChange={onChangeMetadataIpfsUrl}
        id="metadataUrlIpfs"
        type="text"
        required
        label="Metadata Url IPFS"
        variant="outlined"
      />
      <Button
        className="upload-ipfs__button"
        disabled={!tokenAddress || !metadataIpfsUrl}
        onClick={toggleModal}
        variant="contained"
        color="success"
      >
        Update
      </Button>
      <ModalComponent onClose={toggleModal} isOpen={isModalOpen}>
        <div className="rerender-nft__modal-content">
          <div className="rerender-nft__modal-content-text">{`Are you sure you want to upload this file to IPFS?`}</div>
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

export default UpdateSolanaMetadata;
