import Vue from 'vue';
import Vuex from 'vuex';
import db from '../api/firebase'

Vue.use(Vuex);

const todosCollection = db.collection("todos");
const types = {
    RETRIEVE_REQUEST: 'clearTodos',
    RETRIEVE_SUCCESS: 'setTodos',
    RETRIEVE_FAILURE: 'restoreTodos',
    ADD_SUCCESS: 'addTodo',
    REMOVE_SUCCESS: 'removeTodo'
}
const store = new Vuex.Store({
    state: {
        todos: [],
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

        clearTodos(state) {
            state.todos = []
        },

        setTodos(state, newTodos) {
            state.todos = newTodos
        },

        restoreTodos(state, oldTodos) {
            state.todos = oldTodos;
            state.retrieveFail = true;
        },

        addTodo(state, newTodo) {
            state.todos.push(newTodo)
        },

        removeTodo(state, oldTodo) {
            state.todos.splice(state.todos.findIndex(t => t.id === oldTodo.id), 1);
        }
    },
    actions: {
        retrieveTodos({commit, state}) {
            state.retrieveFail = false;
            const oldTodos = state.todos;
            commit(types.RETRIEVE_REQUEST);
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
                    commit(types.RETRIEVE_SUCCESS, todosFromDb);
                    state.isLoading = false;
                },
                (error) => {
                    console.error("Error getting documents: ", error);
                    commit(types.RETRIEVE_FAILURE, oldTodos);
                    state.isLoading = false;
                }
            );
        },

        addTodo({commit, state}, payload) {
            state.isLoading = true;
            todosCollection.add({title: payload.title})
                .then((doc) => {
                    payload.id = doc.id
                    commit(types.ADD_SUCCESS, payload)
                    state.isLoading = false;
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    state.isLoading = false;
                })
        },

        removeTodo({commit, state}, payload) {
            state.isLoading = true;
            todosCollection.doc(payload.id).delete()
                .then(() => {
                    state.isLoading = false;
                    commit(types.REMOVE_SUCCESS, payload)
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                    state.isLoading = false;
                })
        }
    }
});

export default store;
