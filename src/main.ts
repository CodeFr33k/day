import Vue from 'vue'
import App from './App.vue'
import store from 'caml-js/store';

const searchParams = new URLSearchParams(window.location.search as string);
const uri = searchParams.get('manifest');
if(uri) {
    store.loadManifest(uri);
}

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
