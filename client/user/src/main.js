import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import BalmUI from 'balm-ui';
import $theme from 'balm-ui/plugins/theme';

import 'balm-ui-css';
import './assets/main.css';

const app = createApp(App);

app.use(router);
app.use(BalmUI);
app.use(store);

app.use($theme, {
	primary: 'hsl(285, 100%, 25%)',
});

app.mount('#app');
