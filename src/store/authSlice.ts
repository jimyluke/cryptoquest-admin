import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { cryptoQuestApi } from '../api/api';
import { LOCAL_STORAGE_TOKEN } from '../variables/global';
import { RootState } from './store';

export const loginUserByPassword = createAsyncThunk<
  { userId: number; username: string; jwt: string },
  { username: string; password: string },
  { rejectValue: { message: string } }
>('auth/loginUserByPassword', async (user, { rejectWithValue }) => {
  try {
    const response = await cryptoQuestApi.post('api/auth/signIn', user);

    localStorage.setItem(
      LOCAL_STORAGE_TOKEN,
      JSON.stringify(response?.data?.jwt)
    );

    return response?.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || error);
  }
});

export const loginUserByToken = createAsyncThunk<
  {
    userId: number;
    username: string;
    jwt: string;
  },
  undefined,
  { rejectValue: { message: string } }
>('auth/loginUserByToken', async (_, { rejectWithValue }) => {
  try {
    const response = await cryptoQuestApi.get('api/auth/login', {
      headers: {
        'x-access-token': JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
        ),
      },
    });

    localStorage.setItem(
      LOCAL_STORAGE_TOKEN,
      JSON.stringify(response.data.jwt)
    );

    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    return rejectWithValue(error?.response?.data || error);
  }
});

interface IAuthState {
  user: { userId: number; username: string } | null;
  isLoading: boolean;
  errors: {
    signInError?: { message: string };
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
        (state, { payload }) => {
          state.isLoading = false;
          state.errors.signInError = payload;
        }
      );
  },
});

export const { logoutCurrentUser } = auth.actions;
export default auth.reducer;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectSignInError = (state: RootState) =>
  state.auth.errors.signInError;
