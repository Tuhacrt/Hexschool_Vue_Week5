import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'bootstrap';
import { LoadingPlugin } from 'vue-loading-overlay';
import VueAwesomePaginate from 'vue-awesome-paginate';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-awesome-paginate/dist/style.css';
import 'vue-loading-overlay/dist/css/index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import router from './router';
import App from './App.vue';

const app = createApp(App);

library.add(faSpinner);

app.use(createPinia());
app.use(router);
app.use(LoadingPlugin);
app.use(VueAwesomePaginate);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
