<template>
    <div id="app">
        <NavMenu></NavMenu>
        <img src="./assets/logo.png" alt="logo" width="300">
        <el-container>
            <el-main>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import NavMenu from "./components/NavMenu";
    import firebase from './api/firebase'

    export default {
        name: 'app',
        components: {
            NavMenu
        },

        mounted() {
            const currentUser = firebase.auth.currentUser;
            if (currentUser) {
                this.$store.commit('users/setLoggedIn', true)
            }
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

    .el-table .selected-row {
        background-color: #ecf5ff;
    }


    .el-popconfirm__main {
        font-family: 'Baloo 2', Helvetica, Arial, sans-serif
    }
</style>
