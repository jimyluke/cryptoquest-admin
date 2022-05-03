import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { editTokenName, selectTokenName } from '../../store/tokenNamesSlice';
import ROUTES from '../../routes/routes';
import { notify } from '../../utils/notify';
import { debounce } from 'lodash';
import { cryptoQuestApi } from '../../api/api';

const TokenName = () => {
  const { tokenNameId } = useParams();

  if (!tokenNameId) {
    return null;
  }

  const tokenNameData = useAppSelector((state) =>
    selectTokenName(state, +tokenNameId)
  );

  if (!tokenNameData) {
    return <Navigate to={ROUTES.TOKEN_NAMES_PAGE} />;
  }

  const [tokenName, setTokenName] = useState(tokenNameData?.token_name);
  const [checkTokenName, setCheckTokenName] = useState({
    tokenNameExist: false,
    isLoading: false,
    error: null,
  });

  const dispatch = useAppDispatch();

  const handleDebounceChangeTokenName = async (value: string) => {
    try {
      console.log(value);

      const response = await cryptoQuestApi.post('api/checkIsTokenNameUnique', {
        tokenName: value,
      });

      console.log(response);

      const { isTokenNameExist } = response.data;
      if (isTokenNameExist) {
        setCheckTokenName({
          isLoading: false,
          tokenNameExist: true,
          error: null,
        });
      } else {
        setCheckTokenName({
          isLoading: false,
          tokenNameExist: false,
          error: null,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setCheckTokenName({
        isLoading: false,
        tokenNameExist: false,
        error: error.message,
      });
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
      setCheckTokenName({
        isLoading: true,
        tokenNameExist: false,
        error: null,
      });
      setTokenName(e.target.value);
      debouncedChangeHandler(e.target.value);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setCheckTokenName({
        isLoading: false,
        tokenNameExist: false,
        error: error.message,
      });
      console.error(error.message);
      notify('error', error.message);
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tokenName) {
      dispatch(editTokenName({ tokenName, tokenNameId: +tokenNameId }));
    }
  };

  useEffect(() => {
    if (tokenNameData) {
      setTokenName(tokenNameData?.token_name);
    }
  }, [tokenNameData]);

  return (
    <div className="token-name">
      <form className="token-name__form" onSubmit={onSubmitHandler}>
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
        />
        {checkTokenName.tokenNameExist &&
          !(tokenNameData?.token_name === tokenName) && (
            <Alert severity="error">{`Token name "${tokenName}" already exist`}</Alert>
          )}
        <Button
          disabled={
            !tokenName ||
            tokenNameData?.token_name === tokenName ||
            checkTokenName.tokenNameExist ||
            checkTokenName.isLoading ||
            !!checkTokenName.error
          }
          type="submit"
          variant="contained"
          color="success"
        >
          {checkTokenName.isLoading ? (
            <CircularProgress size={30} />
          ) : (
            'Save changes'
          )}
        </Button>
      </form>
    </div>
  );
};

export default TokenName;
