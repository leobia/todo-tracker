<template>
    <div style="position: absolute" v-show="isLogged">
        <el-menu default-active="2" class="el-menu-vertical-demo"
                 :collapse="isCollapse">
            <el-menu-item index="0" @click="isCollapse = !isCollapse">
                <i :class="collapseExpandClass"></i>
                <span slot="title">{{collapseExpandString}}</span>
            </el-menu-item>
            <router-link v-for="(route, idx) in routesFiltered" :key="idx" :to="route.path">
                <el-menu-item :index="(idx + 1).toString()">
                    <i :class="route.icon"></i>
                    <span slot="title">{{route.title}}</span>
                </el-menu-item>
            </router-link>
            <el-menu-item index="3" @click="logout">
                <i class="el-icon-switch-button"></i>
                <span slot="title">Logout</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    .el-tooltip__popper{
        font-family: 'Baloo 2', Helvetica, Arial, sans-serif;
    }
</style>

<script>
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                isCollapse: true,
                routes: this.$router.options.routes,
                indexZero: 0
            };
        },
        methods: {
            logout() {
                this.$store.dispatch('users/logout').then(() => {
                    this.$router.push('login')
                })
            }
        },

        computed: {
            collapseExpandString() {
                return this.isCollapse ? 'Expand menu' : 'Collapse menu';
            },
            collapseExpandClass() {
                return this.isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left';
            },
            routesFiltered() {
                let routes = [];
                this.routes.forEach(r => {
                    if (r.path !== '*' && r.path !== '/login') {
                        routes.push(r)
                    }
                })
                return routes
            },
            ...mapState({
                isLogged: state => state.users.loggedIn
            })
        }
    }
</script>
