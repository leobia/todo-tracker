import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import store from "./store";
import VueRouter from "vue-router";
import Todos from "./components/Todos";
import Reports from "./components/Reports";

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    {path: '/', component: Todos, title: 'Todos', icon: 'el-icon-finished'},
    {path: '/report', component: Reports, title: 'Reports', icon: 'el-icon-document'}
]
const router = new VueRouter({
    routes
})

new Vue({
    render: h => h(App),
    store: store,
    router
}).$mount('#app')
