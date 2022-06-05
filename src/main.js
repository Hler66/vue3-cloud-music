import { createApp } from 'vue'
import App from './App.vue'
import routes from './routes/index'
import {store} from './store/index'
import VueLazyload from 'vue-lazyload-next'
const app = createApp(App);


app.use(routes).use(store).use(VueLazyload,{
    listenEvents: ['scroll','mousewheel']
}).mount('#app')
