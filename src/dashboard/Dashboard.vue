<template>
  <div class="dashboard">
    <city-active></city-active>
  </div>
</template>

<script lang="ts">
import { checkLoginMixin } from '../account/account'
import CityActive from './CityActive.vue'

export default {
  mixins: [checkLoginMixin],
  components: {
    CityActive,
  },
}
</script>

<style lang="scss">
.dashboard {
  display: grid;
  height: 80vh;
  grid-template:
    'city-active n1' 1fr
    'n2 n3' 1fr/ 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;
  .city-acitve {
    grid-area: city-acitve;
  }
}
</style>