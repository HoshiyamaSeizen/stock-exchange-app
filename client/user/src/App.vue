<script setup>
import { RouterView } from 'vue-router';
import { socketConnect } from './socket';
</script>

<script>
export default {
	data() {
		return {
			socket: null,
		};
	},

	created() {
		if (!this.socket) this.socket = socketConnect();
		this.socket.on('data', (data) => {
			this.$store.commit('add', data);
			console.log(this.$store.state.currentDate);
		});
	},

	beforeUnmount() {
		this.socket.disconnect();
	},
};
</script>

<template>
	<RouterView />
</template>
