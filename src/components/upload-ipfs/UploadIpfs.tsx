import {
  Button,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { cryptoQuestApi } from '../../api/api';
import { notify } from '../../utils/notify';
import { LOCAL_STORAGE_TOKEN } from '../../variables/global';
import ModalComponent from '../modal/Modal';

interface IUploadIpfsResult {
  ipfsUrl: string;
}

const UploadIpfs = () => {
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
  const [selectedFileType, setSelectedFileType] = useState('image');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [uploadIpfsResult, setUploadIpfsResult] =
    useState<IUploadIpfsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onChangeTokenAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.currentTarget && e?.currentTarget?.files?.[0]) {
      setSelectedFile(e?.currentTarget?.files?.[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onConfirmHandler = async () => {
    try {
      setIsLoading(true);
      if (selectedFile && inputFileRef.current) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('fileType', selectedFileType);
        formData.append('tokenAddress', tokenAddress);

        const response = await cryptoQuestApi.post(
          '/api/admin/uploadIpfs',
          formData,
          {
            headers: {
              'x-access-token': JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
              ),
              'Content-type': 'multipart/form-data',
            },
          }
        );
        setUploadIpfsResult(response.data);
        notify('success', 'Uploading file to IPFS successfully finished');
        setTokenAddress('');
        setSelectedFile(null);
        inputFileRef.current.value = '';
      }
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
      console.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeFileType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFileType(e.target.value);
  };

  return (
    <div className="upload-ipfs">
      <Typography variant="h4" component="div">
        Upload IPFS
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
      <div>
        <FormLabel id="file-type">Type</FormLabel>
        <RadioGroup
          value={selectedFileType}
          onChange={onChangeFileType}
          row
          aria-labelledby="file-type"
        >
          <FormControlLabel value="image" control={<Radio />} label="Image" />
          <FormControlLabel value="json" control={<Radio />} label="JSON" />
        </RadioGroup>
      </div>
      <FormLabel id="file">File</FormLabel>
      <input
        ref={inputFileRef}
        name="file"
        id="file"
        type="file"
        onChange={onChangeFile}
      />
      <Button
        className="upload-ipfs__button"
        disabled={!selectedFile}
        onClick={toggleModal}
        variant="contained"
        color="success"
      >
        Upload
      </Button>
      <ModalComponent
        onClose={toggleModal}
        isOpen={isModalOpen}
        additionalClose={() => setUploadIpfsResult(null)}
      >
        <div className="upload-ipfs__modal-content">
          {uploadIpfsResult ? (
            <div className="upload-ipfs__modal-result">
              <Typography variant="h4" component="div">
                IPFS Link
              </Typography>
              <div className="upload-ipfs__modal-result-text">
                {uploadIpfsResult.ipfsUrl}
              </div>
              <Button
                className="upload-ipfs__button"
                onClick={() => {
                  navigator.clipboard.writeText(uploadIpfsResult.ipfsUrl);
                  notify('success', 'Link copied');
                }}
                variant="contained"
                color="success"
                disabled={!uploadIpfsResult.ipfsUrl}
              >
                Copy Link
              </Button>
            </div>
          ) : (
            <>
              <div className="upload-ipfs__modal-content-text">{`Are you sure you want to upload this file to IPFS?`}</div>
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
            </>
          )}
        </div>
      </ModalComponent>
    </div>
  );
};

export default UploadIpfs;
