<template>
    <el-card class="box-card" v-loading="isLoading">
        <el-form ref="form" :model="form" @keyup.enter="requestLogin">
            <el-form-item label="Email">
                <el-input v-model="form.email"></el-input>
            </el-form-item>

            <el-form-item label="Password">
                <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-alert v-show="loginFailed"
                      style="margin-bottom: 10px"
                      title="Incorrect credentials"
                      type="error">
            </el-alert>
            <el-form-item>
                <el-button type="success" @click="requestLogin" round>Login</el-button>
            </el-form-item>
        </el-form>
    </el-card>

</template>

<script>
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                }
            }
        },
        computed: {
            ...mapState({
                isLoading: state => state.users.loginLoading,
                loginFailed: state => state.users.loginFailed
            })
        },
        methods: {
            requestLogin() {
                this.$store.dispatch('users/login', this.form).then(() => {
                    this.form.email = '';
                    this.form.password = '';
                    this.$router.push('todos')
                })
            },
            ...mapActions('users', [
                'login'
            ])
        }
    }
</script>

<style>
    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 0;
    }

    .box-card {
        width: 480px;
        margin: auto;
    }
</style>
