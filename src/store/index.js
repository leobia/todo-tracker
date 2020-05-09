import Vue from 'vue';
import Vuex from 'vuex';
import db from '../api/firebase'

Vue.use(Vuex);

const todosCollection = db.collection("todos");
const store = new Vuex.Store({
    state: {
        todos: [],
        RETRIEVE_REQUEST: 'clearTodos',
        RETRIEVE_SUCCESS: 'setTodos',
        RETRIEVE_FAILURE: 'restoreTodos',
        ADD_SUCCESS: 'addTodo',
        isLoading: false,
        retrieveFail: false
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        },
        openTodos: state => {
            return state.todos.filter(todo => !todo.done)
        },
    },
    mutations: {
        addMinutes(state, payload) {
            let todo = state.todos.find(t => t.id === payload.id);
            if (todo) {
                todo.minutes += payload.minutes;
            }
        },
        clearTodos(state) {
            state.todos = []
        },
        addTodo(state, newTodo) {
            state.todos.push(newTodo)
        },
        setTodos(state, newTodos) {
            state.todos = newTodos
        },
        restoreTodos(state, oldTodos) {
            state.todos = oldTodos;
            state.retrieveFail = true;
        }
    },
    actions: {
        retrieveTodos({commit, state}) {
            state.retrieveFail = false;
            const oldTodos = state.todos;
            commit(state.RETRIEVE_REQUEST);
            state.isLoading = true;
            todosCollection.get().then(
                (resultQuery) => {
                    let todosFromDb = []
                    resultQuery.forEach((doc) => {
                        todosFromDb.push({
                            id: doc.id,
                            title: doc.data().title,
                            description: doc.data().description,
                            minutes: doc.data().minutes
                        })
                    })
                    commit(state.RETRIEVE_SUCCESS, todosFromDb);
                    state.isLoading = false;
                },
                (error) => {
                    console.error("Error getting documents: ", error);
                    commit(state.RETRIEVE_FAILURE, oldTodos);
                    state.isLoading = false;
                }
            );
        },

        addTodo({commit, state}, payload) {
            state.isLoading = true;
            todosCollection.add({title: payload.title})
            .then((doc) => {
                payload.id = doc.id
                commit(state.ADD_SUCCESS, payload)
                state.isLoading = false;
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                state.isLoading = false;
            })
        }
    }
});

export default store;
