import { createApp } from 'vue';
import dialogs from '../src';

import App from './components/App.vue';

const app = createApp(App);

app.use(dialogs);

app.mount('#app');
