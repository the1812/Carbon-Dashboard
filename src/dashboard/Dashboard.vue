<template>
  <div class="dashboard">
    <template v-if="account.isLogin">
      <city-active></city-active>
      <user-props></user-props>
      <user-time></user-time>
    </template>
  </div>
</template>

<script lang="ts">
import { checkLoginMixin } from '../account/account'
import CityActive from './CityActive.vue'
import UserProps from './UserProps.vue'
import UserTime from './UserTime.vue'
export default {
  mixins: [checkLoginMixin],
  components: {
    CityActive,
    UserProps,
    UserTime
  }
}
</script>

<style lang="scss">
.dashboard {
  display: grid;
  height: 80vh;
  grid-template:
    'city-active user-props' 1fr
    'city-lines user-time' 1fr/ 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;

  @each $name in ('city-active', 'user-props', 'city-lines', 'user-time') {
    .#{$name} {
      grid-area: unquote($name);
    }
  }
}
</style>