import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit';

import { cryptoQuestApi } from '../api/api';
import { RootState } from './store';
import { ITokenName } from '../types/tokenNames';
import { notify } from '../utils/notify';

export const fetchTokenNames = createAsyncThunk<ITokenName[]>(
  'tokenNames/fetchTokenNames',
  async () => {
    const response = await cryptoQuestApi.get('api/tokenNames', {
      headers: {
        'x-access-token': JSON.parse(localStorage.getItem('token') || '{}'),
      },
    });

    return response.data;
  }
);

export const approveTokenName = createAsyncThunk<Promise<void>, number>(
  'tokenNames/approveTokenName',
  async (tokenNameId, { dispatch }) => {
    try {
      const response = await cryptoQuestApi.post(
        'api/tokenNames/approve',
        {
          tokenNameId,
        },
        {
          headers: {
            'x-access-token': JSON.parse(localStorage.getItem('token') || '{}'),
          },
        }
      );
      notify('success', response.data.message);
      dispatch(fetchTokenNames());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
    }
  }
);

export const rejectTokenName = createAsyncThunk<Promise<void>, number>(
  'tokenNames/rejectTokenName',
  async (tokenNameId, { dispatch }) => {
    try {
      const response = await cryptoQuestApi.post(
        'api/tokenNames/reject',
        {
          tokenNameId,
        },
        {
          headers: {
            'x-access-token': JSON.parse(localStorage.getItem('token') || '{}'),
          },
        }
      );
      notify('success', response.data.message);
      dispatch(fetchTokenNames());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
    }
  }
);

export const editTokenName = createAsyncThunk<
  Promise<void>,
  { tokenName: string; tokenNameId: number }
>('tokenNames/editTokenName', async (tokenNameData, { dispatch }) => {
  try {
    const response = await cryptoQuestApi.post(
      'api/tokenNames/edit',
      tokenNameData,
      {
        headers: {
          'x-access-token': JSON.parse(localStorage.getItem('token') || '{}'),
        },
      }
    );
    notify('success', response.data.message);
    dispatch(fetchTokenNames());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notify('error', error?.response?.data?.message || error?.message);
  }
});

interface ITokenNamesState {
  entities: ITokenName[];
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  isEditing: boolean;
  error?: SerializedError;
}

const initialState: ITokenNamesState = {
  entities: [],
  isLoading: false,
  isApproving: false,
  isRejecting: false,
  isEditing: false,
};

const tokenNames = createSlice({
  name: 'tokenNames',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    return builder
      .addCase(fetchTokenNames.pending, (state) => {
        state.isLoading = true;
        state.isApproving = false;
        state.error = undefined;
      })
      .addCase(fetchTokenNames.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error;
        state.entities = [];
      })
      .addCase(fetchTokenNames.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.entities = payload;
      })
      .addCase(approveTokenName.pending, (state) => {
        state.isApproving = true;
      })
      .addCase(approveTokenName.rejected, (state) => {
        state.isApproving = false;
      })
      .addCase(approveTokenName.fulfilled, (state) => {
        state.isApproving = false;
      })
      .addCase(rejectTokenName.pending, (state) => {
        state.isRejecting = true;
      })
      .addCase(rejectTokenName.rejected, (state) => {
        state.isRejecting = false;
      })
      .addCase(rejectTokenName.fulfilled, (state) => {
        state.isRejecting = false;
      })
      .addCase(editTokenName.pending, (state) => {
        state.isEditing = true;
      })
      .addCase(editTokenName.rejected, (state) => {
        state.isEditing = false;
      })
      .addCase(editTokenName.fulfilled, (state) => {
        state.isEditing = false;
      });
  },
});

// export const {} = tokenNames.actions;
export default tokenNames.reducer;

export const selectTokenNames = (state: RootState): ITokenNamesState =>
  state.tokenNames;
export const selectTokenName = (state: RootState, tokenNameId: number) =>
  state.tokenNames.entities.find((tokenName) => tokenName.id === tokenNameId);
