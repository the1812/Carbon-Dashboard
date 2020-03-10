<template>
  <div class="not-login">
    <b-modal id="not-login" title="未登录" v-model="notLoginModal">
      请先登录!
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            class="float-right"
            @click="notLoginModal = false; redirect()"
          >确定</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    notLoginModal: {
      get () {
        return this.$store.state.notLoginModal
      },
      set(value) {
        this.$store.commit(value ? 'showNotLoginModal' : 'hideNotLoginModal')
      }
    }
  },
  methods: {
    redirect() {
      this.$router.push('account')
    }
  },
}
</script>
