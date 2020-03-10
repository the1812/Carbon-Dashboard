<template>
  <div class="city-active" @click="loading = !loading">
    <div class="loading" v-if="loading"></div>
    <v-chart v-else :options="polar" autoresize/>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }

    return {
      loading: false,
      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 600
      }
    }
  },
  async mounted() {}
}
</script>

<style lang="scss">
.city-active {
  width: 100%;
  height: 100%;
}
</style>