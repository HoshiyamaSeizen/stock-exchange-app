<script setup>
import AccountTab from './AccountTab.vue';
import StocksTab from './StocksTab.vue';
</script>

<script>
export default {
	data() {
		return {
			active: 0,
			socket: null,
		};
	},

	created() {
		const id = localStorage.getItem('uid');
		if (id === null) this.$router.push('/auth');
	},
};
</script>

<template>
	<div class="window">
		<header>
			<ui-tab-bar v-model="active">
				<ui-tab> Account </ui-tab>
				<ui-tab> Stocks </ui-tab>
			</ui-tab-bar>
		</header>
		<AccountTab v-if="active === 0" />
		<StocksTab v-else-if="active === 1" />
	</div>
</template>

<style scoped>
header {
	margin-bottom: 20px;
}
</style>
