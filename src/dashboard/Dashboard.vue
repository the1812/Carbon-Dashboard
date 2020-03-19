<template>
  <div class="dashboard">
    <template v-if="account.isLogin">
      <city-lines></city-lines>
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
import CityLines from './CityLines.vue'
export default {
  mixins: [checkLoginMixin],
  components: {
    CityLines,
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
  height: 120vh;
  grid-template:
    'city-lines city-lines' 1fr
    'city-active city-jam' 1fr
    'user-props user-time' 1fr/ 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;

  @each $name in ('city-lines', 'city-active', 'user-props', 'city-jam', 'user-time') {
    .#{$name} {
      grid-area: unquote($name);
    }
  }
  @media screen and (max-width: 1200px) {
    grid-template:
    'city-lines' 1fr
    'city-active' 1fr
    'city-jam' 1fr
    'user-props' 1fr
    'user-time' 1fr / 1fr;
  }
}
</style>