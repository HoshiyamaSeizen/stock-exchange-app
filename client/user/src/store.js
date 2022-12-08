import { createStore } from 'vuex';

export default createStore({
	state() {
		return {
			dates: [],
			stocks: {},
			currentDate: '',
			currentStocks: [],
			brokers: [],
			trades: [],
			stocksName: [],
		};
	},
	mutations: {
		add(state, data) {
			state.dates.push(data.date);
			data.stocks.forEach((stock) => {
				if (!state.stocks[stock.id]) state.stocks[stock.id] = [];
				state.stocks[stock.id].push(stock.price);
			});
			state.currentDate = data.date;
			state.currentStocks = data.stocks;
			state.brokers = data.brokers;
			state.trades = data.trades;
			state.stocksName = data.stocks.map((s) => ({ id: s.id, abbr: s.abbr, name: s.name }));
		},
	},
});
