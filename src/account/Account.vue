<template>
  <b-container class="login h-100">
    <b-form @submit.prevent="submit()">
      <b-form-group
        label="用户名"
        label-for="input-username"
      >
        <b-form-input
          :disabled="submitting"
          id="input-username"
          v-model="form.username"
          type="text"
          required
          placeholder="请输入用户名"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="密码"
        label-for="input-password"
      >
        <b-form-input
          :disabled="submitting"
          id="input-password"
          v-model="form.password"
          type="password"
          required
          placeholder="请输入密码"
        ></b-form-input>
      </b-form-group>
      <b-button v-if="!submitting" type="submit" variant="primary">登录</b-button>
      <b-spinner v-else small variant="primary" label="登录中"></b-spinner>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { mapMutations } from 'vuex'
import { login } from '../api/login'
import { toastError } from '@/toast'
export default {
  data() {
    return {
      submitting: false,
      form: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapMutations(['login']),
    async submit() {
      try {
        this.submitting = true
        const user = await login(this.form.username, this.form.password)
        this.login({
          isLogin: true,
          username: user.username,
          avatar: user.avatar,
          uid: user.uid,
        })
        this.$router.push('dashboard')
      } catch (error) {
        toastError(this.$bvToast, `登录时发生错误: ${error.message}`, '登录失败')
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style>

</style>