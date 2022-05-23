import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import ModalComponent from '../../components/modal/Modal';
import { cryptoQuestApi } from '../../api/api';
import { notify } from '../../utils/notify';

const UpdateNft = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onChangeTokenAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };

  const onConfirmHandler = async () => {
    notify('success', 'Updating nft in progress');
    await cryptoQuestApi.post('/api/nfts/customizeFromAdminPanel', {
      tokenAddress,
    });
  };

  return (
    <div className="update-nft">
      <div className="update-nft__content">
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
          disabled={!tokenAddress}
          onClick={toggleModal}
          variant="contained"
          color="success"
        >
          Update NFT
        </Button>
        <ModalComponent onClose={toggleModal} isOpen={isModalOpen}>
          <div className="update-nft__modal-content">
            <div className="update-nft__modal-content-text">{`Are you sure you want to update NFT "${tokenAddress.slice(
              0,
              8
            )}..."?`}</div>
            <Button
              onClick={onConfirmHandler}
              variant="contained"
              color="success"
            >
              Confirm
            </Button>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default UpdateNft;
