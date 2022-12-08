<script>
export default {
	data() {
		return {
			user: {
				name: '',
				money: 0,
				net: 0,
				profit: 0,
				stocks: [],
			},
			date: '',
			thead: ['Abbr', 'Name', 'Amount', 'Price', 'Profit'],
			tbody: [
				'abbr',
				'name',
				'amount',
				{
					field: 'price',
					class: (data) => {
						return data.price >= 0 ? 'plus' : 'minus';
					},
					fn: (data) => {
						return data.price.toFixed(2) + '$';
					},
				},
				{
					field: 'profit',
					class: (data) => {
						return data.profit >= 0 ? 'plus' : 'minus';
					},
					fn: (data) => {
						return data.profit.toFixed(2) + '$';
					},
				},
			],
		};
	},
	methods: {
		logout() {
			localStorage.removeItem('uid');
			localStorage.removeItem('uname');
			this.$router.push('auth/');
		},
	},
	created() {
		this.user.name = localStorage.getItem('uname');

		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === 'add') {
				this.user.money = this.$store.state.brokers.find(
					(t) => t.id === +localStorage.getItem('uid')
				).money;

				this.date = this.$store.state.currentDate;

				this.user.net = this.user.money;
				this.user.profit = 0;
				this.user.stocks = this.$store.state.trades
					.filter((t) => t.uid === +localStorage.getItem('uid') && t.amount > 0)
					.map((t) => {
						const stock = this.$store.state.stocksName.find((s) => s.id === t.sid);
						const price = this.$store.state.currentStocks.find((s) => s.id === t.sid).price;
						const revenue = t.amount * price;
						const profit = revenue - t.spent;

						this.user.net += revenue;
						this.user.profit += profit;

						return {
							...t,
							name: stock.name,
							abbr: stock.abbr,
							price,
							profit,
						};
					});
			}
		});
	},
	beforeUnmount() {
		this.unsubscribe();
	},
};
</script>

<template>
	<div class="top">
		<h2>Account</h2>
		<ui-button class="logout" icon="exit_to_app" @click="logout"></ui-button>
	</div>
	<div class="info">
		<p>
			Date: <span class="name">{{ date }}</span>
		</p>
		<p>
			Name: <span class="name">{{ user.name }}</span>
		</p>
		<p>
			Money:
			<span :class="user.money >= 0 ? 'plus' : 'minus'"
				>{{ Math.round(user.money * 1e4) / 1e4 }}$</span
			>
		</p>
		<p>
			Net worth:
			<span :class="user.net >= 0 ? 'plus' : 'minus'"
				>{{ Math.round(user.net * 1e4) / 1e4 }}$</span
			>
		</p>
		<p>
			Profit:
			<span :class="user.profit >= 0 ? 'plus' : 'minus'"
				>{{ Math.round(user.profit * 1e4) / 1e4 }}$</span
			>
		</p>
	</div>
	<div class="top">
		<h2>Stocks</h2>
	</div>
	<ui-table :data="user.stocks" :thead="thead" :tbody="tbody"> </ui-table>
</template>

<style scoped>
.top {
	margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

p {
	color: #777;
}

.name {
	color: #000;
	font-weight: bold;
}

.logout {
	padding: 0;
}
</style>
