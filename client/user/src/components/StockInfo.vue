<script>
import Chart from 'chart.js/auto';
export default {
	props: ['id', 'name'],
	data() {
		this.chart = null;
		return {
			stock: null,
			chartData: [],
			data: { prices: [], dates: [] },
			daysShown: 30,
			user: { money: 0, amount: 0 },
			open: false,
		};
	},
	methods: {
		genChart() {
			if (!this.chart) {
				const ctx = this.$refs.canvas.getContext('2d');
				this.chart = new Chart(ctx, {
					redraw: true,
					type: 'line',
					data: this.chartData,
					options: {
						responsive: true,
						animation: {
							duration: 0,
						},
						scales: {
							y: {
								title: {
									display: true,
									text: 'Price',
								},
								ticks: {
									callback: function (value) {
										return '$' + value;
									},
								},
							},
							x: {
								title: {
									display: true,
									text: 'Date',
								},
							},
						},
					},
				});
			}
			this.chart.update();
		},
		redraw() {
			this.chart.data.labels = this.data.dates.slice(-this.daysShown);
			this.chart.data.datasets[0].data = this.data.prices.slice(-this.daysShown);
			this.chart.update();
		},
		buy() {
			fetch('/api/trade/buy', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: +localStorage.getItem('uid'), stockid: this.$props.id }),
			})
				.then((res) => res.json())
				.then((user) => {
					if (!user) return;
					if (user.amount === this.user.amount) this.open = true;
					this.user = user;
				});
		},
		sell() {
			if (this.user.amount === 0) return;
			fetch('/api/trade/sell', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: +localStorage.getItem('uid'), stockid: this.$props.id }),
			})
				.then((res) => res.json())
				.then((user) => {
					if (!user) return;
					this.user = user;
				});
		},
	},
	created() {
		fetch(`/api/trade/history/${this.$props.name}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ date: this.$store.state.dates[0] }),
		})
			.then((res) => res.json())
			.then(({ data }) => {
				this.data.prices = [...data.prices, ...this.$store.state.stocks[+this.$props.id]];
				this.data.dates = [...data.dates, ...this.$store.state.dates];

				this.chartData = {
					labels: [],
					datasets: [
						{
							label: this.$props.name,
							backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(255, 99, 132)',
							data: [],
							tension: 0.1,
							pointRadius: 1.5,
							borderWidth: 2,
						},
					],
				};

				this.unsubscribe = this.$store.subscribe((mutation, state) => {
					if (mutation.type === 'add') {
						this.user.money = this.$store.state.brokers.find(
							(t) => t.id === +localStorage.getItem('uid')
						).money;
						this.user.amount =
							this.$store.state.trades.find(
								(t) => t.uid === +localStorage.getItem('uid') && t.sid === this.$props.id
							)?.amount || 0;

						this.stock = state.currentStocks.find((s) => +s.id === +this.$props.id);
						this.data.prices.push(this.stock.price);
						this.data.dates.push(this.$store.state.dates.at(-1));

						if (this.chart) this.redraw();
						else this.genChart();
					}
				});
			});
	},
	beforeUnmount() {
		this.unsubscribe();
	},
	computed: {
		daysShownChanged() {
			return this.daysShown;
		},
	},
	watch: {
		daysShownChanged() {
			this.redraw();
		},
	},
};
</script>

<template>
	<h2 class="title">{{ stock?.abbr }} | {{ stock?.name }}</h2>
	<p>
		Date: <span id="date">{{ this.data.dates.at(-1) }}</span>
	</p>
	<p>
		Price:
		<span class="money"
			><span id="price">{{ Math.round(stock?.price * 1e4) / 1e4 }}</span
			>$</span
		>
	</p>
	<p>
		Balance:
		<span class="money"
			><span id="balance">{{ Math.round(user.money * 1e4) / 1e4 }}</span
			>$</span
		>
	</p>
	<div class="amount">
		<p>Your amount:</p>
		<button id="sell-btn" class="quantity minus" @click="sell">-</button>
		<p id="amount">{{ user.amount }}</p>
		<button id="buy-btn" class="quantity plus" @click="buy">+</button>
	</div>
	<div class="graph">
		<canvas ref="canvas" @load="genChart"></canvas>
		<label>Number of days displayed: <input v-model="daysShown" type="number" min="1" /></label>
	</div>
	<ui-snackbar
		v-model="open"
		timeout-ms="2000"
		message="You don't have enough money"
		action-button-text="close"
		:action-type="1"
	></ui-snackbar>
</template>

<style scoped>
* {
	font-size: 1.1rem;
}
.money,
.money span {
	margin-left: auto;
	color: darkgreen;
	font-weight: bold;
}

.amount {
	display: flex;
	align-items: center;
}

.quantity {
	padding: 0 6px;
	width: 24px;
	height: 24px;
	font-size: 1.2rem;
	color: white;
	background-color: hsl(285, 100%, 25%);
	border-radius: 4px;
	border: none;
	transition: 200ms ease-out;
}

.quantity:hover {
	background-color: hsl(285, 100%, 45%);
}

.minus {
	margin-left: 20px;
	margin-right: 4px;
}

.plus {
	margin-left: 6px;
}

canvas {
	width: 85vw;
	/* max-width: 950px; */
	max-height: 440px;
}
</style>
