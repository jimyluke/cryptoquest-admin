import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { loginUserByPassword, selectSignInError } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { notify } from '../../utils/notify';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();

  const signInError = useAppSelector(selectSignInError);

  useEffect(() => {
    if (signInError && signInError.message) {
      notify('error', signInError.message);
    }
  }, [signInError]);

  const onChangeUsernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onChangePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      loginUserByPassword({
        username,
        password,
      })
    );

    setUsername('');
    setPassword('');
  };

  return (
    <div className="auth__container">
      <h1 className="auth__heading">Sign in</h1>
      <form className="auth__form" onSubmit={onSubmitHandler}>
        <TextField
          style={{ backgroundColor: 'white' }}
          value={username}
          onChange={onChangeUsernameHandler}
          id="username"
          type="text"
          required
          label="Username"
          variant="outlined"
        />
        <TextField
          style={{ backgroundColor: 'white' }}
          value={password}
          onChange={onChangePasswordHandler}
          id="password"
          type="password"
          required
          label="Password"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="success">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
