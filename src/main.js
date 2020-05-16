import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import store from "./store";
import VueRouter from "vue-router";
import firebase from "./api/firebase";

import Login from "./components/Login";
import Todos from "./components/Todos";
import Reports from "./components/Reports";

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        redirect: '/todos'
    },
    {
        path: '/login',
        title: 'Login',
        component: Login
    },
    {
        path: '/todos', component: Todos, title: 'Todos', icon: 'el-icon-finished',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/report', component: Reports, title: 'Reports', icon: 'el-icon-document',
        meta: {
            requiresAuth: true
        }
    }
]
const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = firebase.auth.currentUser

    if (requiresAuth && !currentUser) {
        next('/login')
    } else if (requiresAuth && currentUser) {
        next()
    } else {
        next()
    }
})

let app
firebase.auth.onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            render: h => h(App),
            store: store,
            router
        }).$mount('#app')
    }
})

Date.prototype.withoutTime = function () {
    let d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}
