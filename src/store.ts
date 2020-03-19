import Vuex from 'vuex'
import { Account } from './account/account'
import { clone } from 'lodash'

const notLoginAccount: Account = {
  isLogin: false,
  username: '未登录',
  avatar: '',
  uid: -1,
}
const getSavedAccount = () => {
  const saved = localStorage.getItem('account')
  if (saved !== null) {
    return JSON.parse(saved) as Account
  }
  return clone(notLoginAccount)
}
export const store = new Vuex.Store({
  state: {
    account: getSavedAccount(),
    notLoginModal: false,
    selectedCid: 1,
  },
  mutations: {
    updateCid(state, payload: number) {
      state.selectedCid = payload
    },
    login(state, payload: Account) {
      state.account = payload
      localStorage.setItem('account', JSON.stringify(state.account))
    },
    logout(state) {
      state.account = clone(notLoginAccount)
      localStorage.removeItem('account')
    },
    showNotLoginModal(state) {
      state.notLoginModal = true
    },
    hideNotLoginModal(state) {
      state.notLoginModal = false
    },
  }
})