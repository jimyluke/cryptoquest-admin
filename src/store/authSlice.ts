import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  SerializedError,
} from '@reduxjs/toolkit';
import { cryptoQuestApi } from '../api/api';
import { RootState } from './store';

export const loginUserByPassword = createAsyncThunk<
  { userId: number; username: string; jwt: string },
  { username: string; password: string }
>('auth/loginUserByPassword', async (user) => {
  const response = await cryptoQuestApi.post('api/auth/signIn', user);

  localStorage.setItem('token', JSON.stringify(response.data.jwt));

  return response.data;
});

export const loginUserByToken = createAsyncThunk<{
  userId: number;
  username: string;
  jwt: string;
}>('auth/loginUserByToken', async () => {
  const response = await cryptoQuestApi.get('api/auth/login', {
    headers: {
      'x-access-token': JSON.parse(localStorage.getItem('token') || '{}'),
    },
  });

  localStorage.setItem('token', JSON.stringify(response.data.jwt));

  return response.data;
});

interface IAuthState {
  user: { userId: number; username: string } | null;
  isLoading: boolean;
  errors: {
    signInError?: SerializedError;
  };
}

const initialState: IAuthState = {
  user: null,
  isLoading: false,
  errors: {},
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutCurrentUser(state) {
      state.user = null;
      state.isLoading = false;
      state.errors.signInError = undefined;
    },
  },
  extraReducers: (builder) => {
    return builder
      .addMatcher(
        isAnyOf(loginUserByPassword.pending, loginUserByToken.pending),
        (state) => {
          state.isLoading = true;
          state.errors.signInError = undefined;
        }
      )
      .addMatcher(
        isAnyOf(loginUserByPassword.fulfilled, loginUserByToken.fulfilled),
        (state, { payload }) => {
          state.user = {
            userId: payload.userId,
            username: payload.username,
          };
          state.isLoading = false;
          state.errors.signInError = undefined;
        }
      )
      .addMatcher(
        isAnyOf(loginUserByPassword.rejected, loginUserByToken.rejected),
        (state, { error }) => {
          state.isLoading = false;
          state.errors.signInError = error;
        }
      );
  },
});

export const { logoutCurrentUser } = auth.actions;
export default auth.reducer;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectSignInError = (state: RootState) =>
  state.auth.errors.signInError;
