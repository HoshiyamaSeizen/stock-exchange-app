<script>
import BrokerInfo from './BrokerInfo.vue';

export default {
	data() {
		return {
			searchStr: '',
			open: false,
			current: null,
			brokers: [],
		};
	},
	methods: {
		logout() {
			this.$router.push('auth/');
		},
		search() {
			this.brokers = this.brokers.map((broker) => {
				broker.visible = broker.name.toLowerCase().includes(this.searchStr.toLowerCase());
				return broker;
			});
			console.log(this.brokers);
		},
		openDialog(id) {
			this.$refs.dialog.showModal();
			this.open = true;
			this.current = id;
		},
		components: { BrokerInfo },
	},
	created() {
		this.unsubscribe = this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'add') {
				this.brokers = state.brokers.map((b) => ({
					...b,
					visible: b.name.toLowerCase().includes(this.searchStr.toLowerCase()),
				}));
			}
		});
	},
	beforeUnmount() {
		this.unsubscribe();
	},
	components: { BrokerInfo },
};
</script>

<template>
	<div class="window">
		<div class="top">
			<h2>Brokers</h2>
			<ui-textfield class="search" @change="search" v-model="searchStr">
				Search
				<template #after>
					<ui-textfield-icon>search</ui-textfield-icon>
				</template>
			</ui-textfield>
			<ui-button class="logout" icon="exit_to_app" @click="logout"></ui-button>
		</div>
		<main>
			<div class="header">
				<p>Name</p>
				<p>Money</p>
			</div>
			<ui-list>
				<ui-item
					v-for="broker in brokers.filter((b) => b.visible)"
					:key="broker.id"
					@click="openDialog(broker.id)"
				>
					<ui-item-text-content>{{ broker.name }}</ui-item-text-content>
					<p :class="broker.money >= 0 ? 'plus' : 'minus'">{{ broker.money.toFixed(2) }}$</p>
				</ui-item>
			</ui-list>
		</main>
		<dialog ref="dialog" @close="open = false">
			<BrokerInfo v-if="open" :id="current" /><ui-button
				class="close"
				@click="this.$refs.dialog.close()"
				icon="close"
			></ui-button>
		</dialog>
	</div>
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
	height: 80%;
	overflow-y: auto;
}

li {
	justify-content: space-between !important;
}

.plus {
	color: darkgreen;
	font-weight: bold;
}

.minus {
	color: darkred;
	font-weight: bold;
}

.logout {
	padding: 0;
}

.header {
	display: block;
	width: 100%;
	height: 20px;
}

.header p:nth-child(1) {
	float: left;
	margin-left: 16px;
}

.header p:nth-child(2) {
	float: right;
	margin-right: 16px;
}

dialog {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: fit-content;
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
