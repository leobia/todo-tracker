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
                <template slot-scope="scope">
                    <el-button type="success" icon="el-icon-check" circle
                               @click="done(scope.$index, scope.row)"></el-button>
                    <el-button :type="scope.row.selected ? 'primary': ''"
                               :icon="scope.row.selected ? 'el-icon-lock': 'el-icon-unlock'" circle
                               @click="select(scope.$index, scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle
                               @click="remove(scope.$index, scope.row)"></el-button>
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
            this.retrieveTodos()
        },
        computed: {
            ...mapState({
                todos: state => state.todos,
                isLoading: state => state.isLoading
            }),
            ...mapGetters([
                'openTodos'
            ])
        },
        methods: {
            select(index, row) {
                this.todos.forEach(todo => {
                    todo.selected = false
                })
                row.selected = !row.selected
                this.$set(this.todos, index, row);

            },
            done(index, row) {
                row.done = !row.done;
                this.$set(this.todos, index, row);
            },
            remove(index, row) {
                console.log(index)
                console.log(row)
            },
            add(){
                let todo = {
                    title: this.title,
                    minutes: 0,
                    done: false,
                    selected: false
                }
                this.addTodo(todo)
            },

            tableRowClassName({row}) {
                let output = '';
                if (row.done) {
                    output = 'done-row';
                }
                return output;
            },
            ...mapActions([
                'retrieveTodos',
                'addTodo'
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
