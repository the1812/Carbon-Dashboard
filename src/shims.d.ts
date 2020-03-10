declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module 'vue-echarts' {
  import { VueConstructor } from 'vue'
  const VueEChart: VueConstructor
  export default VueEChart
}