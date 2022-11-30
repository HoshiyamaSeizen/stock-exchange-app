import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	stocks: [],
};

export const managerSlice = createSlice({
	name: 'reducer',
	initialState,
	reducers: {
		add: (state, action) => {
			state.stocks.push(action.payload);
			state.stocks.sort((a, b) => a.id - b.id);
		},
		remove: (state, action) => {
			state.stocks = state.stocks.filter((s) => s.id !== action.payload.id);
		},
		set: (state, action) => {
			state.stocks = action.payload;
		},
	},
});

export const { add, set, remove } = managerSlice.actions;

export default managerSlice.reducer;
