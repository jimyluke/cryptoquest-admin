import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface ITokenNamesState {
  entities: any[];
}

const initialState: ITokenNamesState = {
  entities: [],
};

const tokenNames = createSlice({
  name: 'tokenNames',
  initialState,
  reducers: {},
});

// export const {} = tokenNames.actions;
export default tokenNames.reducer;

export const selectIsHeaderOpen = (state: RootState) =>
  state.tokenNames.entities;
