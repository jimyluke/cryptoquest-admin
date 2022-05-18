import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { debounce } from 'lodash';

import ModalComponent from '../../components/modal/Modal';

import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  editTokenName,
  selectTokenName,
  selectTokenNames,
} from '../../store/tokenNamesSlice';

import ROUTES from '../../routes/routes';
import { notify } from '../../utils/notify';
import { cryptoQuestApi } from '../../api/api';

const TokenName = () => {
  const { tokenNameId } = useParams();
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!tokenNameId) {
    return null;
  }

  const tokenNameData = useAppSelector((state) =>
    selectTokenName(state, +tokenNameId)
  );
  const { isEditing } = useAppSelector(selectTokenNames);

  if (!tokenNameData) {
    return <Navigate to={ROUTES.TOKEN_NAMES_PAGE} />;
  }

  const [tokenName, setTokenName] = useState(tokenNameData?.token_name);
  const [values, setValues] = useState({
    tokenNameExist: false,
    tokenNameRejected: false,
    isLoading: false,
    error: null,
  });

  const handleDebounceChangeTokenName = async (value: string) => {
    try {
      console.log(value);

      const response = await cryptoQuestApi.post('api/checkIsTokenNameUnique', {
        tokenName: value,
      });

      const { isTokenNameExist, isTokenNameRejected } = response.data;
      if (isTokenNameExist && isTokenNameRejected) {
        setValues((prev) => ({
          ...prev,
          isLoading: false,
          tokenNameExist: true,
          tokenNameRejected: true,
        }));
      } else if (isTokenNameExist && !isTokenNameRejected) {
        setValues((prev) => ({
          ...prev,
          isLoading: false,
          tokenNameExist: true,
          tokenNameRejected: false,
        }));
      } else if (
        (!isTokenNameExist && isTokenNameRejected) ||
        value.trim().toLowerCase() === 'name pending'
      ) {
        setValues((prev) => ({
          ...prev,
          isLoading: false,
          tokenNameExist: false,
          tokenNameRejected: true,
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          isLoading: false,
          tokenNameExist: false,
          tokenNameRejected: false,
        }));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setValues((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      console.error(error.message);
      notify('error', error.message);
    }
  };

  const debouncedChangeHandler = useCallback(
    debounce(handleDebounceChangeTokenName, 1000),
    []
  );

  const onChangeTokenNameHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const regex = /^[A-Za-z]+( [A-Za-z]+)*$/;

      const target = e.target;
      let value = target.value;

      const cursor = target.selectionStart;

      value = value.replace(/\s\s+/g, ' ');

      if (value === ' ') {
        value = '';
      } else if (value[0] === ' ' && value.length > 1) {
        value = value.trimStart();
      }

      if (
        regex.test(value) ||
        value.length === 0 ||
        (value[value.length - 1] === ' ' &&
          regex.test(value[value.length - 2]) &&
          value.length > 1 &&
          value.search(/\s\s+/g)) === -1
      ) {
        setValues((prev) => ({
          ...prev,
          error: null,
          isLoading: true,
        }));
        setTokenName(value);
        debouncedChangeHandler(value);
      }

      setTimeout(() => {
        target.setSelectionRange(cursor, cursor);
      }, 10);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setValues((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      console.error(error.message);
      notify('error', error.message);
    }
  };

  const onConfirmHandler = async () => {
    if (tokenName) {
      await dispatch(editTokenName({ tokenName, tokenNameId: +tokenNameId }));
      setIsModalOpen(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (tokenNameData) {
      setTokenName(tokenNameData?.token_name);
    }
  }, [tokenNameData]);

  return (
    <div className="token-name">
      <div className="token-name__content">
        <TextField
          style={{ backgroundColor: 'white' }}
          value={tokenNameData?.id}
          id="id"
          type="text"
          required
          label="ID"
          variant="outlined"
          disabled
        />
        <TextField
          style={{ backgroundColor: 'white' }}
          value={tokenNameData?.mint_name}
          id="mint-name"
          type="text"
          required
          label="Mint Name"
          variant="outlined"
          disabled
        />
        <Alert severity="info">{`Initial name: ${tokenNameData?.token_name}`}</Alert>
        <TextField
          style={{ backgroundColor: 'white' }}
          value={tokenName}
          onChange={onChangeTokenNameHandler}
          id="token-name"
          type="text"
          required
          label="Token Name"
          variant="outlined"
          inputProps={{ maxLength: 32 }}
        />
        {values.tokenNameExist &&
          !values.tokenNameRejected &&
          !values.isLoading &&
          !isEditing &&
          !(tokenNameData?.token_name === tokenName) && (
            <Alert severity="error">{`Token name "${tokenName}" already exist`}</Alert>
          )}
        {values.tokenNameRejected && !values.isLoading && !isEditing && (
          <Alert severity="error">{`Token name "${tokenName}" is not possible to use`}</Alert>
        )}
        <Button
          disabled={
            !tokenName ||
            tokenNameData?.token_name === tokenName ||
            values.tokenNameExist ||
            values.isLoading ||
            isEditing ||
            !!values.error
          }
          onClick={toggleModal}
          variant="contained"
          color="success"
        >
          {values.isLoading || isEditing ? (
            <CircularProgress size={30} />
          ) : (
            'Save changes'
          )}
        </Button>
        <ModalComponent
          isClosable={!isEditing}
          onClose={toggleModal}
          isOpen={isModalOpen}
        >
          <div className="token-names__modal-content">
            <div>{`Are you sure you want to change token name from "${tokenNameData?.token_name}" to "${tokenName}"?`}</div>
            <Button
              onClick={onConfirmHandler}
              variant="contained"
              color="success"
              disabled={isEditing}
            >
              {isEditing ? <CircularProgress size={30} /> : 'Confirm'}
            </Button>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default TokenName;
