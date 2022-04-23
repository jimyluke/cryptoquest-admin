import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { cryptoQuestApi } from '../api/api';
import { RootState } from './store';

export const loginUserByPassword = createAsyncThunk<
  { userId: number; username: string; jwt: string },
  { username: string; password: string },
  {
    rejectValue: string;
  }
>('auth/loginUserByPassword', async (user, { dispatch, rejectWithValue }) => {
  try {
    const response = await cryptoQuestApi.post('api/auth/signIn', user, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // response.data.isAdmin
    //   ? dispatch(fetchUsers())
    //   : dispatch(fetchUser(response.data.userId));

    localStorage.setItem('token', JSON.stringify(response.data.jwt));

    return response.data;
  } catch (error: any) {
    console.error(error.message);
    return rejectWithValue(error.response.data.message);
  }
});

export const loginUserByToken = createAsyncThunk<
  { userId: number; username: string; jwt: string },
  null,
  {
    rejectValue: string;
  }
>('auth/loginUserByToken', async (_, { dispatch, rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem('token')!);
    const response = await cryptoQuestApi.get('api/auth/login', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-access-token': token,
      },
    });

    // response.data.isAdmin
    //   ? dispatch(fetchUsers())
    //   : dispatch(fetchUser(response.data.userId));

    localStorage.setItem('token', JSON.stringify(response.data.jwt));

    return response.data;
  } catch (error: any) {
    console.error(error.message);
    localStorage.removeItem('token');
    return rejectWithValue(error.response.data.message);
  }
});

interface IAuthState {
  user: { userId: number; username: string } | null;
  isLoading: boolean;
  errors: {
    signInError: string | null;
  };
}

const initialState: IAuthState = {
  user: null,
  isLoading: false,
  errors: {
    signInError: null,
  },
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutCurrentUser(state) {
      state.user = null;
      state.isLoading = false;
      state.errors.signInError = null;
    },
  },
  extraReducers: (builder) => {
    return builder
      .addMatcher(
        isAnyOf(loginUserByPassword.pending, loginUserByToken.pending),
        (state) => {
          state.isLoading = true;
          state.errors.signInError = null;
        }
      )
      .addMatcher(
        isAnyOf(loginUserByPassword.fulfilled, loginUserByToken.fulfilled),
        (state, action) => {
          state.user = {
            userId: action.payload.userId,
            username: action.payload.username,
          };
          state.isLoading = false;
          state.errors.signInError = null;
        }
      )
      .addMatcher(
        isAnyOf(loginUserByPassword.rejected, loginUserByToken.rejected),
        (state, action) => {
          state.isLoading = false;
          state.errors.signInError = action.payload!;
        }
      );
    // .addMatcher(
    //   isAnyOf(fetchUsers.fulfilled, fetchUser.fulfilled),
    //   (state) => {
    //     state.usersLoaded = true;
    //     state.isLoading = false;
    //   }
    // );
  },
});

export const { logoutCurrentUser } = auth.actions;
export default auth.reducer;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectSignInError = (state: RootState) =>
  state.auth.errors.signInError;
