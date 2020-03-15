<template>
  <div class="user-time">
    <v-chart ref="chart" theme="westeros" :options="chart" autoresize />
  </div>
</template>

<script lang="ts">
import { toastError } from '@/toast'
import { groupBy, sortBy } from 'lodash'
import { getUserInfo, UserInfoQueryType } from '@/api/user'
export default {
  data() {
    return {
      chart: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        title: {
          text: '用户上线时间'
        },
        series: []
      }
    }
  },
  async mounted() {
    try {
      this.$refs.chart.clear()
      this.$refs.chart.showLoading()
      const { userProportion } = await getUserInfo(UserInfoQueryType.useTime)
      const basePie = {
        type: 'pie',
        radius: ['60%', '80%'],
        hoverOffset: 5,
        label: {
          fontSize: 11,
          bleedMargin: '10%',
          // alignTo: 'edge',
          // margin: 6
        },
        // labelLine: {
        //   length: 4,
        //   length2: 4
        // }
      }
      if (userProportion.useTimeProportions) {
        const groups = groupBy(userProportion.useTimeProportions, ({ useTime }) => {
          const date = new Date(useTime)
          const seconds = Math.trunc(date.getSeconds() / 10) + '0'
          return `${date.getHours()}:${date.getMinutes()}:${seconds}`
        })
        const pie = Object.assign(
          {
            data: sortBy(Object.entries(groups), ([name]) =>
              parseInt(name)
            ).map(([name, items]) => {
              return {
                value: items.reduce((acc, it) => acc + it.number, 0),
                name
              }
            })
          },
          basePie
        )
        this.chart.series = [pie]
      }
    } catch (error) {
      toastError(
        this.$bvToast,
        `加载用户上线时间失败: ${error.message}`,
        '加载失败'
      )
    } finally {
      this.$refs.chart.hideLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../mixins';
.user-time {
  @include chart-container();
}
</style>