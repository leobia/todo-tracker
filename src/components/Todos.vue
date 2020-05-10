<template>
    <div>
        <div class="new-todo">
            <el-input placeholder="Insert todo" v-model="title">
                <el-button slot="append" icon="el-icon-plus" @click="add" :disabled="!title"></el-button>
            </el-input>
        </div>

        <el-table :data="todos"
                  v-loading="isLoading"
                  class="todo-list" :row-class-name="tableRowClassName">
            <el-table-column label="Task" prop="title">
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header">
                    <el-popconfirm
                            confirmButtonText='OK'
                            cancelButtonText='No, Thanks'
                            icon="el-icon-info"
                            iconColor="red"
                            title="Are you sure to delete this?"
                            @onConfirm="deleteOldTodos">
                        <el-button slot="reference" type="danger" size="small" icon="el-icon-delete">Delete old done
                        </el-button>
                    </el-popconfirm>
                </template>
                <template slot-scope="scope">
                    <el-button type="success" icon="el-icon-check" circle
                               @click="done( scope.row)"></el-button>
                    <el-button :type="scope.row.selected ? 'primary': ''"
                               :icon="scope.row.selected ? 'el-icon-lock': 'el-icon-unlock'" circle
                               @click="select(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle
                               @click="remove(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from "vuex";

    export default {
        name: "Todos",
        data() {
            return {
                title: ''
            }
        },
        beforeMount() {
            this.$store.dispatch('todo/retrieveTodos')
        },
        computed: {
            ...mapState({
                isLoading: state => state.todo.isLoading
            }),
            ...mapGetters('todo', {
                openTodos: 'openTodos',
                todos: 'sortedTodos'
            })
        },
        methods: {
            select(row) {
                const lastUpdate = row.update_date;
                const now = new Date();
                let selected = row.selected;
                let minutes = row.minutes;
                if (selected) {
                    const diffMins = Math.round((((now - lastUpdate) % 86400000) % 3600000) / 60000);
                    minutes += diffMins;
                }

                selected = !selected;
                this.$store.commit('todo/modifyTodo', {id: row.id, minutes, selected, update_date: now})
                this.$store.dispatch('todo/changeSelectTodo', row);
            },
            done(row) {
                let done = !row.done;
                this.$store.commit('todo/modifyTodo', {id: row.id, done})
                this.$store.dispatch('todo/changeStatusTodo', row);
            },
            remove(row) {
                this.$store.dispatch('todo/removeTodo', row);
            },
            add() {
                let todo = {title: this.title}
                this.$store.dispatch('todo/addTodo', todo);
            },

            tableRowClassName({row}) {
                let output = '';
                if (row.done) {
                    output = 'done-row';
                } else if (row.selected) {
                    output = 'selected-row';
                }
                return output;
            },
            deleteOldTodos() {
                let now = new Date();
                const fiveDaysAgo = now.setDate(now.getDate() - 2);
                const todosToDelete = this.todos.filter(t => t.done && t.update_date <= fiveDaysAgo);
                if (todosToDelete.length) {
                    this.$store.dispatch('todo/deleteTodos', todosToDelete);
                }
            },
            ...mapActions('todo', [
                'retrieveTodos',
                'addTodo',
                'removeTodo',
                'changeStatusTodo',
                'changeSelectTodo',
                'deleteTodos'
            ]),
        },
    }
</script>

<style scoped>
    .new-todo {
        width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .todo-list {
        width: 70%;
        margin-top: 3rem;
        margin-left: auto;
        margin-right: auto;
    }

</style>
