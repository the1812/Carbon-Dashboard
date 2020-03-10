import Vuex from 'vuex'
import { Account } from './account/account'
import { clone } from 'lodash'

const notLoginAccount: Account = {
  isLogin: false,
  username: '未登录',
  avatar: '',
  uid: -1,
}
export const store = new Vuex.Store({
  state: {
    account: clone(notLoginAccount) as Account,
    notLoginModal: false,
  },
  mutations: {
    login(state, payload: Account) {
      state.account = payload
    },
    logout(state) {
      state.account = clone(notLoginAccount)
    },
    showNotLoginModal(state) {
      state.notLoginModal = true
    },
    hideNotLoginModal(state) {
      state.notLoginModal = false
    },
  }
})