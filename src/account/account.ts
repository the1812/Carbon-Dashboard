import Vue, { ComponentOptions } from 'vue'
import { mapState, mapMutations } from 'vuex'

export interface Account {
  username: string
  isLogin: boolean
  avatar: string
  uid: number
}
export const checkLoginMixin: ComponentOptions<Vue> = {
  computed: {
    ...mapState(['account'])
  },
  methods: {
    ...mapMutations(['showNotLoginModal'])
  },
  mounted() {
    if (!this.account.isLogin) {
      console.log('not login')
      this.showNotLoginModal()
    }
  }
}