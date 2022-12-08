<script setup>
import { RouterLink } from 'vue-router';
</script>

<script>
export default {
	data() {
		return {
			options: [],
			selected: '',
		};
	},
	methods: {
		onSelected(selected) {
			this.selected = selected.value;
		},
		login() {
			console.log(this.selected);
			localStorage.setItem('uid', this.selected);
			localStorage.setItem('uname', this.options[this.selected].label);
			this.$router.push('/');
		},
	},
	created() {
		fetch('/api/brokers', {
			method: 'GET',
		})
			.then((res) => res.json())
			.then((data) => {
				this.options = data.map((broker) => ({ label: broker.name, value: broker.id }));
			});
	},
};
</script>

<template>
	<div class="window">
		<h1>Authorization</h1>
		<section>
			<ui-select
				id="select"
				v-model="selected"
				:options="options"
				@selected="onSelected($event)"
			>
				Account
			</ui-select>
		</section>
		<ui-button unelevated @click="login">Log in</ui-button>
		<RouterLink to="/admin">Login as an administrator</RouterLink>
	</div>
</template>

<style scoped>
@import '../assets/base.css';

* {
	text-align: center;
}

.window {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 640px;
	height: 50%;
}

h1 {
	margin-top: 40px;
}

section,
#select {
	width: 100%;
}

section {
	margin-top: 40px;
	margin-bottom: 20px;
}

button {
	width: 80%;
}

a {
	margin-top: auto;
}
</style>
