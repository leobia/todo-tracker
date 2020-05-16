import firebase from '../../api/firebase'

const activitiesCollection = firebase.db.collection('day_activities');

const types = {
    SET_LOADING: 'setLoading',
    LOAD_ACTIVITIES: 'setActivities',
    ADD_ACTIVITY: 'addActivity',
    REMOVE_SUCCESS: 'removeActivity'
}

function readDbActivity(payload) {
    return {
        id: payload.id,
        day: payload.data().day,
        minutes: payload.data().minutes,
        todo_id: payload.data().todo_id
    }
}

function initNewActivity(payload) {
    return {
        minutes: payload.minutes,
        day: payload.update_date,
        todo_id: payload.id
    }
}

const state = () => ({
    dayActivities: [],
    actLoading: false
});

const getters = {
    activitiesWithTitle(state, getters, rootState) {
        let activities = [...state.dayActivities];
        activities.forEach(a => {
            let todo = rootState.todo.todos.find(t => t.id === a.todo_id);
            if (todo) {
                a.todo_title = todo.title
            } else {
                a.todo_title = 'TODO NOT FOUND'
            }
            a.date = new Date(a.day.seconds * 1000)
        })
        return activities;
    },
}

const actions = {
    retrieveActivities({dispatch, commit}) {
        dispatch('todo/retrieveTodos', {}, {root: true}).then(() => {
            commit(types.SET_LOADING, true);
            activitiesCollection.get().then(
                (resultQuery) => {
                    let dbActivities = [];
                    resultQuery.forEach(doc => dbActivities.push(readDbActivity(doc)));
                    commit(types.LOAD_ACTIVITIES, dbActivities)
                    commit(types.SET_LOADING, false);
                }, (error) => {
                    console.error("Error getting documents: ", error);
                    commit(types.SET_LOADING, false);
                }
            )
        })
    },

    addActivity({commit}, payload) {
        commit(types.SET_LOADING, true);
        let activity = initNewActivity(payload)
        activitiesCollection.add(activity).then((doc) => {
            activity.id = doc.id;
            commit(types.ADD_ACTIVITY, activity)
            commit(types.SET_LOADING, false);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            commit(types.SET_LOADING, false);
        })
    },

    deleteActivities({commit}, activities) {
        const ids = activities.map(t => t.id);
        commit(types.SET_LOADING, true);
        let i = 0;
        activitiesCollection.where(firebase.firestore.FieldPath.documentId(), 'in', ids)
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
    setLoading(state, loading) {
        state.actLoading = loading;
    },

    setActivities(state, activities) {
        state.dayActivities = activities;
    },

    addActivity(state, newActivity) {
        state.dayActivities.push(newActivity)
    },

    removeActivity(state, oldActivity) {
        state.dayActivities.splice(state.todos.findIndex(t => t.id === oldActivity.id), 1);
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
