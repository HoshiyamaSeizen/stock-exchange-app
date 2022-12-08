<script>
import StockInfo from './StockInfo.vue';

export default {
	data() {
		return {
			searchStr: '',
			open: false,
			stocks: [],
			current: null,
		};
	},
	methods: {
		search() {
			this.stocks = this.stocks.map((stock) => {
				stock.visible =
					stock.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
					stock.abbr.toLowerCase().includes(this.searchStr.toLowerCase());
				return stock;
			});
		},
		openDialog(id, name) {
			this.$refs.dialog.showModal();
			this.open = true;
			this.current = { id, name };
		},
	},
	created() {
		this.unsubscribe = this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'add') {
				console.log(`Updating to ${state.currentDate} (size: ${state.dates.length})`);
				this.stocks = state.currentStocks.map((s) => ({
					...s,
					visible:
						s.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
						s.abbr.toLowerCase().includes(this.searchStr.toLowerCase()),
				}));
			}
		});
	},
	beforeUnmount() {
		this.unsubscribe();
	},
	components: { StockInfo },
};
</script>

<template>
	<div class="top">
		<h2>Stocks</h2>
		<ui-textfield class="search" @change="search" v-model="searchStr">
			Search
			<template #after>
				<ui-textfield-icon>search</ui-textfield-icon>
			</template>
		</ui-textfield>
	</div>
	<main>
		<ui-list>
			<ui-item
				v-for="stock in stocks.filter((b) => b.visible)"
				:key="stock.id"
				@click="openDialog(stock.id, stock.abbr)"
			>
				<ui-item-text-content class="abbr"> {{ stock.abbr }}</ui-item-text-content>
				<ui-item-text-content class="name"> {{ stock.name }}</ui-item-text-content>
				<p class="price">{{ stock.price }}$</p>
			</ui-item>
		</ui-list>
	</main>
	<dialog ref="dialog" @close="open = false">
		<StockInfo v-if="open" :id="current.id" :name="current.name" /><ui-button
			class="close"
			@click="this.$refs.dialog.close()"
			icon="close"
		></ui-button>
	</dialog>
</template>

<style scoped>
.top {
	margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.search {
	margin: 0 10px;
	width: 100%;
}

main {
	height: 70%;
	overflow-y: auto;
}

li {
	justify-content: flex-start !important;
}

.abbr {
	min-width: 60px;
	border-right: 2px solid #aaa;
}

.name {
	margin-left: 14px;
}

.price {
	margin-left: auto;
	color: darkgreen;
	font-weight: bold;
}

dialog {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	padding: 40px;
	border: 5px solid hsl(285, 100%, 25%);
	border-radius: 10px;
}

.close {
	position: absolute;
	top: 10px;
	right: 10px;
}
</style>
