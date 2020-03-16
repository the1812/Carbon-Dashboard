<template>
  <div class="dashboard">
    <template v-if="account.isLogin">
      <city-active></city-active>
      <user-props></user-props>
      <user-time></user-time>
      <city-jam></city-jam>
    </template>
  </div>
</template>

<script lang="ts">
import { checkLoginMixin } from '../account/account'
import CityActive from './CityActive.vue'
import UserProps from './UserProps.vue'
import UserTime from './UserTime.vue'
import CityJam from './CityJam.vue'
export default {
  mixins: [checkLoginMixin],
  components: {
    CityActive,
    UserProps,
    UserTime,
    CityJam,
  }
}
</script>

<style lang="scss">
.dashboard {
  display: grid;
  height: 80vh;
  grid-template:
    'city-active city-jam' 1fr
    'user-props user-time' 1fr/ 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;

  @each $name in ('city-active', 'user-props', 'city-jam', 'user-time') {
    .#{$name} {
      grid-area: unquote($name);
    }
  }
  @media screen and (max-width: 1200px) {
    grid-template:
    'city-active' 1fr
    'city-jam' 1fr
    'user-props' 1fr
    'user-time' 1fr / 1fr;
  }
}
</style>