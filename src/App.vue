<template>
  <div class="app">
    <div class="nav sticky-top">
      <b-navbar toggleable="lg" type="dark" variant="primary" class="w-100">
        <b-navbar-brand>
          <router-link class="navbar-brand" to="dashboard">
            <b-icon icon="columns" font-scale="1.5" class="mr-2"></b-icon>碳积分
          </router-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <router-link class="nav-link" to="dashboard">
              <b-icon icon="house-fill"></b-icon>主页
            </router-link>
            <router-link class="nav-link" to="review">
              <b-icon icon="eye-fill"></b-icon>审核
            </router-link>
            <router-link class="nav-link" to="shop">
              <b-icon icon="bucket-fill"></b-icon>商城
            </router-link>
            <router-link class="nav-link" to="star">
              <b-icon icon="gear-fill"></b-icon>参数配置
            </router-link>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-button variant="primary" v-if="!account.isLogin" @click="login()">
              <b-icon icon="person-fill" font-scale="1.3"></b-icon>
              {{account.username}}
            </b-button>
            <b-nav-item-dropdown v-else right>
              <template v-slot:button-content>
                <b-img
                  v-if="account.avatar"
                  class="mr-2 avatar"
                  rounded="circle"
                  :src="account.avatar"
                ></b-img>
                <b-icon v-else icon="person-fill" font-scale="1.3"></b-icon>
                {{account.username}}
              </template>
              <b-dropdown-item href="#" @click="logout()">
                <b-icon icon="box-arrow-right" font-scale="1.3" class="mr-1"></b-icon>退出登录
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div class="main container mt-5">
      <transition name="router-slide">
        <router-view class="main-content"></router-view>
      </transition>
    </div>
    <not-login></not-login>
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations } from 'vuex'
import { Account } from './account/account'
import NotLogin from './account/NotLoginModal.vue'
export default {
  components: {
    NotLogin
  },
  mounted() {
    console.log('App mounted')
  },
  computed: {
    ...mapState(['account'])
  },
  methods: {
    ...mapMutations({
      logoutAccount: 'logout'
    }),
    login() {
      const account = this.account as Account
      if (!account.isLogin) {
        this.$router.push('account')
      }
    },
    logout() {
      const account = this.account as Account
      if (account.isLogin) {
        this.$router.push('account')
        this.logoutAccount()
      }
    }
  }
}
</script>

<style lang="scss">
@import '~bootstrap';
@import '~bootstrap-vue';
@import '~@/mixins';
html,
html * {
  scrollbar-width: none !important;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
}
.app {
  &,
  & *,
  & *::before,
  & *::after {
    -webkit-tap-highlight-color: transparent;
    transition: 0.2s ease-out;
  }
  .main {
    padding-bottom: 64px;
  }
  .navbar-dark .navbar-nav .nav-link {
    display: flex;
    align-items: center;
    .b-icon {
      margin-right: 0.25em;
    }
    &.router-link-active {
      color: rgba(255, 255, 255, 0.75);
      font-weight: bold;
    }
  }
  .navbar-brand {
    display: inline-flex;
    align-items: center;
  }
  .router-slide {
    &-enter,
    &-leave-to {
      position: absolute;
      transform: translateY(-12px);
      opacity: 0;
    }
  }
  .avatar {
    width: 28px;
    height: 28px;
  }
  .main-content {
    transition-duration: 0.6s;
    transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>