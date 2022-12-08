import { createRouter, createWebHistory } from 'vue-router';
import AuthorizationPage from '../components/AuthorizationPage.vue';
import MainPage from '../components/MainPage.vue';
import AdminPage from '../components/AdminPage.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/auth',
			name: 'authorization',
			component: AuthorizationPage,
		},
		{
			path: '/',
			name: 'main',
			component: MainPage,
		},
		{
			path: '/admin',
			name: 'admin',
			component: AdminPage,
		},
	],
});

export default router;
