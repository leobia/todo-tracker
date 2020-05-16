import Vue from 'vue';
import Vuex from 'vuex';
import todo from "./modules/todo";
import day_activities from "./modules/day_activities";
import users from "./modules/users";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        todo,
        day_activities,
        users
    },
    strict: debug
})
