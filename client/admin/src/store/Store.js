import { configureStore } from '@reduxjs/toolkit';

import StocksReducer from './StocksReducer';

export const StocksStore = configureStore({
	reducer: {
		reducer: StocksReducer,
	},
});
