<template>
    <div id="app">
        <el-container>
            <el-main>
                <Todos />
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Todos from "./components/Todos";

    export default {
        name: 'app',
        components: {
            Todos
        }
    }
</script>

<style>
    #app {
        font-family: 'Baloo 2', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .el-table .done-row {
        background-color: #f0f9eb;
        text-decoration: line-through;
    }

    .el-popconfirm__main {
        font-family: 'Baloo 2', Helvetica, Arial, sans-serif
    }
</style>
