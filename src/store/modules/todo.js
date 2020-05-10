import db from '../../api/firebase'

const todosCollection = db.collection("todos");
const types = {
    RETRIEVE_REQUEST: 'clearTodos',
    RETRIEVE_SUCCESS: 'setTodos',
    RETRIEVE_FAILURE: 'restoreTodos',
    ADD_SUCCESS: 'addTodo',
    REMOVE_SUCCESS: 'removeTodo',
    CHANGE_STATUS: 'changeStatusTodo',
    CHANGE_SELECT: 'changeSelectTodo',
    SET_LOADING: 'setLoading'
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

const state = () => ({
    todos: [],
    isLoading: false,
})

const getters = {
    doneTodos: state => {
        return state.todos.filter(todo => todo.done)
    },
    openTodos: state => {
        return state.todos.filter(todo => !todo.done)
    },
    sortedTodos: state => {
        return [...state.todos].sort((x, y) => x.done === y.done ? 0 : x.done ? 1 : -1)
    }
}

const actions = {
    retrieveTodos({commit, state}) {
        const oldTodos = state.todos;
        commit(types.RETRIEVE_REQUEST);
        commit(types.SET_LOADING, true);
        todosCollection.get().then(
            (resultQuery) => {
                let todosFromDb = []
                resultQuery.forEach(doc => todosFromDb.push(readDbTodo(doc)))
                commit(types.RETRIEVE_SUCCESS, todosFromDb);
                commit(types.SET_LOADING, false);
            },
            (error) => {
                console.error("Error getting documents: ", error);
                commit(types.RETRIEVE_FAILURE, oldTodos);
                commit(types.SET_LOADING, false);
            }
        );
    },

    addTodo({commit}, payload) {
        commit(types.SET_LOADING, true);
        let todo = initNewTodo(payload.title);
        todosCollection.add(todo)
            .then((doc) => {
                todo.id = doc.id
                commit(types.ADD_SUCCESS, todo)
                commit(types.SET_LOADING, false);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                commit(types.SET_LOADING, false);
            })
    },

    removeTodo({commit}, payload) {
        commit(types.SET_LOADING, true);
        todosCollection.doc(payload.id).delete()
            .then(() => {
                commit(types.SET_LOADING, false);
                commit(types.REMOVE_SUCCESS, payload)
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
                commit(types.SET_LOADING, false);
            })
    },

    changeStatusTodo({commit}, todo) {
        commit(types.SET_LOADING, true);
        todosCollection.doc(todo.id).set(todo)
            .then(() => {
                commit(types.SET_LOADING, false);
                commit(types.CHANGE_STATUS, todo)
            }).catch((error) => {
            commit(types.SET_LOADING, false);
            console.error("Error during change of status", error)
        })
    },

    changeSelectTodo({commit}, todo) {
        commit(types.SET_LOADING, true);
        todosCollection.doc(todo.id).set(todo)
            .then(() => {
                commit(types.SET_LOADING, false);
                commit(types.CHANGE_SELECT, todo)
            }).catch((error) => {
            commit(types.SET_LOADING, false);
            console.error("Error during change of status", error)
        })
    },

    deleteTodos({commit}, todos) {
        const ids = todos.map(t => t.id);
        commit(types.SET_LOADING, true);
        let i = 0;
        todosCollection.where('id', 'in', ids)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    doc.ref.delete().then(() => {
                        commit(types.REMOVE_SUCCESS, doc.ref)
                        i++
                        if (i === ids.length) {
                            commit(types.SET_LOADING, false);
                        }
                    }).catch((error) => {
                        i++
                        if (i === ids.length) {
                            commit(types.SET_LOADING, false);
                        }
                        console.error("Error during change of status", error)
                    })
                })
            }).catch((error) => {
            console.error(error)
            commit(types.SET_LOADING, false);
        })
    }
}

const mutations = {

    clearTodos(state) {
        state.todos = []
    },

    setTodos(state, newTodos) {
        state.todos = newTodos
    },

    restoreTodos(state, oldTodos) {
        state.todos = oldTodos;
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
    },

    setLoading(state, loading) {
        state.isLoading = loading
    },

    modifyTodo(state, payload) {
        let todo = state.todos.find(t => t.id === payload.id);
        for (let key in payload) {
            if (key === 'id') {
                continue;
            }
            todo[key] = payload[key];
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
