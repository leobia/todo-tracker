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
    REMOVE_SUCCESS: 'removeTodo',
    CHANGE_STATUS: 'changeStatusTodo',
    CHANGE_SELECT: 'changeSelectTodo'
}

function initNewTodo(title) {
    return {
        title: title,
        done: false,
        minutes: 0,
        selected: false,
        update_date: new Date()
    }
}

function readDbTodo(payload) {
    return {
        id: payload.id,
        title: payload.data().title,
        done: payload.data().done,
        minutes: payload.data().minutes,
        selected: payload.data().selected,
        update_date: payload.data().update_date
    }
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
        },

        changeStatusTodo(state, todo) {
            state.todos.forEach(t => {
                if (t.id === todo.id) {
                    t.done = todo.done;
                }
            })
        },

        changeSelectTodo(state, todo) {
            state.todos.forEach(t => {
                if (t.id === todo.id) {
                    t.selected = todo.selected;
                    t.update_date = todo.update_date;
                    t.minutes = todo.minutes;
                }
            })
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
                    resultQuery.forEach(doc => todosFromDb.push(readDbTodo(doc)))
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
            let todo = initNewTodo(payload.title);
            todosCollection.add(todo)
                .then((doc) => {
                    todo.id = doc.id
                    commit(types.ADD_SUCCESS, todo)
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
        },

        changeStatusTodo({commit, state}, todo) {
            state.isLoading = true;
            todosCollection.doc(todo.id).set(todo)
                .then(() => {
                    state.isLoading = false;
                    commit(types.CHANGE_STATUS, todo)
                }).catch((error) => {
                state.isLoading = false;
                console.error("Error during change of status", error)
            })
        },

        changeSelectTodo({commit, state}, todo) {
            state.isLoading = true;
            todosCollection.doc(todo.id).set(todo)
                .then(() => {
                    state.isLoading = false;
                    commit(types.CHANGE_SELECT, todo)
                }).catch((error) => {
                state.isLoading = false;
                console.error("Error during change of status", error)
            })
        },

        deleteTodos({commit, state}, todos) {
            const ids = todos.map(t => t.id);
            state.isLoading = true;
            let i = 0;
            todosCollection.where('id', 'in', ids)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete().then(() => {
                            commit(types.REMOVE_SUCCESS, doc.ref)
                            i++
                            if (i === ids.length) {
                                state.isLoading = false;
                            }
                        }).catch((error) => {
                            i++
                            if (i === ids.length) {
                                state.isLoading = false;
                            }
                            console.error("Error during change of status", error)
                        })
                    })
                }).catch((error) => {
                    console.error(error)
                    state.isLoading = false;
                })
        }
    }
});

export default store;
