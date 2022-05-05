import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { cryptoQuestApi } from '../api/api';
import { RootState } from './store';
import { TokenNamesFiltersEnum } from '../variables/tokenNames';
import { notify } from '../utils/notify';
import { ITokenName } from '../types/tokenNames';
import { LOCAL_STORAGE_TOKEN } from '../variables/global';

export const fetchTokenNames = createAsyncThunk<
  ITokenName[],
  undefined,
  { rejectValue: { message: string } }
>('tokenNames/fetchTokenNames', async (_, { rejectWithValue }) => {
  try {
    const response = await cryptoQuestApi.get('api/tokenNames', {
      headers: {
        'x-access-token': JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
        ),
      },
    });

    return response?.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || error);
  }
});

export const approveTokenName = createAsyncThunk<
  undefined,
  number,
  { rejectValue: { message: string } }
>(
  'tokenNames/approveTokenName',
  async (tokenNameId, { rejectWithValue, dispatch }) => {
    try {
      const response = await cryptoQuestApi.post(
        'api/tokenNames/approve',
        {
          tokenNameId,
        },
        {
          headers: {
            'x-access-token': JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
            ),
          },
        }
      );
      notify('success', response?.data?.message);
      dispatch(fetchTokenNames());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
      return rejectWithValue(error?.response?.data || error);
    }
  }
);

export const rejectTokenName = createAsyncThunk<
  undefined,
  { tokenNameId: number; nftId: number },
  { rejectValue: { message: string } }
>(
  'tokenNames/rejectTokenName',
  async ({ tokenNameId, nftId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await cryptoQuestApi.post(
        'api/tokenNames/reject',
        {
          tokenNameId,
          nftId,
        },
        {
          headers: {
            'x-access-token': JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
            ),
          },
        }
      );
      notify('success', response?.data?.message);
      dispatch(fetchTokenNames());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
      return rejectWithValue(error?.response?.data || error);
    }
  }
);

export const editTokenName = createAsyncThunk<
  undefined,
  { tokenName: string; tokenNameId: number },
  { rejectValue: { message: string } }
>(
  'tokenNames/editTokenName',
  async (tokenNameData, { rejectWithValue, dispatch }) => {
    try {
      const response = await cryptoQuestApi.post(
        'api/tokenNames/edit',
        tokenNameData,
        {
          headers: {
            'x-access-token': JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
            ),
          },
        }
      );
      notify('success', response?.data?.message);
      dispatch(fetchTokenNames());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
      return rejectWithValue(error?.response?.data || error);
    }
  }
);

export const deleteTokenName = createAsyncThunk<
  undefined,
  { tokenNameId: number; nftId: number },
  { rejectValue: { message: string } }
>(
  'tokenNames/deleteTokenName',
  async ({ tokenNameId, nftId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await cryptoQuestApi.post(
        'api/tokenNames/delete',
        {
          tokenNameId,
          nftId,
        },
        {
          headers: {
            'x-access-token': JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}'
            ),
          },
        }
      );
      notify('success', response?.data?.message);
      dispatch(fetchTokenNames());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notify('error', error?.response?.data?.message || error?.message);
      return rejectWithValue(error?.response?.data || error);
    }
  }
);

interface ITokenNamesState {
  entities: ITokenName[];
  filter: TokenNamesFiltersEnum;
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  error?: { message: string };
}

const initialState: ITokenNamesState = {
  entities: [],
  filter: TokenNamesFiltersEnum.UNDER_CONSIDERATION,
  isLoading: false,
  isApproving: false,
  isRejecting: false,
  isEditing: false,
  isDeleting: false,
};

const tokenNames = createSlice({
  name: 'tokenNames',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<TokenNamesFiltersEnum>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchTokenNames.pending, (state) => {
        state.isLoading = true;
        state.isApproving = false;
        state.error = undefined;
      })
      .addCase(fetchTokenNames.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.entities = [];
      })
      .addCase(fetchTokenNames.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.entities = payload;
      })
      .addCase(approveTokenName.pending, (state) => {
        state.error = undefined;
        state.isApproving = true;
      })
      .addCase(approveTokenName.rejected, (state, { payload }) => {
        state.error = payload;
        state.isApproving = false;
      })
      .addCase(approveTokenName.fulfilled, (state) => {
        state.isApproving = false;
      })
      .addCase(rejectTokenName.pending, (state) => {
        state.error = undefined;
        state.isRejecting = true;
      })
      .addCase(rejectTokenName.rejected, (state, { payload }) => {
        state.error = payload;
        state.isRejecting = false;
      })
      .addCase(rejectTokenName.fulfilled, (state) => {
        state.isRejecting = false;
      })
      .addCase(editTokenName.pending, (state) => {
        state.error = undefined;
        state.isEditing = true;
      })
      .addCase(editTokenName.rejected, (state, { payload }) => {
        state.error = payload;
        state.isEditing = false;
      })
      .addCase(editTokenName.fulfilled, (state) => {
        state.isEditing = false;
      })
      .addCase(deleteTokenName.pending, (state) => {
        state.error = undefined;
        state.isDeleting = true;
      })
      .addCase(deleteTokenName.rejected, (state, { payload }) => {
        state.error = payload;
        state.isDeleting = false;
      })
      .addCase(deleteTokenName.fulfilled, (state) => {
        state.isDeleting = false;
      });
  },
});

export const { setFilter } = tokenNames.actions;
export default tokenNames.reducer;

export const selectTokenNames = (state: RootState): ITokenNamesState =>
  state.tokenNames;
export const selectTokenName = (state: RootState, tokenNameId: number) =>
  state.tokenNames.entities.find((tokenName) => tokenName.id === tokenNameId);
