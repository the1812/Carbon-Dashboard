<template>
  <div class="user-props">
    <v-chart ref="ageChart" theme="westeros" :options="ageChart" autoresize />
    <v-chart ref="proChart" theme="westeros" :options="proChart" autoresize />
  </div>
</template>

<script lang="ts">
import { toastError } from '@/toast'
import { getUserInfo, UserInfoQueryType } from '../api/user'
import { groupBy, sortBy } from 'lodash'
export default {
  data() {
    return {
      ageChart: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        title: {
          text: '用户年龄分布'
        },
        series: []
      },
      proChart: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        title: {
          text: '用户职业分布'
        },
        series: []
      }
    }
  },
  computed: {
    allChartsRefs() {
      return [this.$refs.ageChart, this.$refs.proChart]
    }
  },
  async mounted() {
    try {
      this.allChartsRefs.forEach((c: any) => {
        c.clear()
        c.showLoading()
      })
      const { userProportion } = await getUserInfo(UserInfoQueryType.all)
      const basePie = {
        type: 'pie',
        radius: ['40%', '60%'],
        hoverOffset: 0,
        label: {
          fontSize: 11,
          // bleedMargin: 0,
          // alignTo: 'edge',
          // margin: 6
        },
        labelLine: {
          length: 4,
          length2: 6
        }
      }
      if (userProportion.ageProportions) {
        const groups = groupBy(userProportion.ageProportions, ({ age }) => {
          let groupName = Math.trunc(age / 10).toString()
          if (groupName === '0') {
            groupName = ''
          }
          return `${groupName}0~${groupName}9`
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
        this.ageChart.series = [pie]
      }
      if (userProportion.professionProportions) {
        const groups = groupBy(
          userProportion.professionProportions,
          it => it.profession
        )
        const pie = Object.assign(
          {
            data: sortBy(Object.entries(groups), ([name]) => name).map(
              ([name, items]) => {
                return {
                  value: items.reduce((acc, it) => acc + it.number, 0),
                  name
                }
              }
            )
          },
          basePie
        )
        this.proChart.series = [pie]
      }
    } catch (error) {
      toastError(
        this.$bvToast,
        `加载用户信息失败: ${error.message}`,
        '加载失败'
      )
    } finally {
      this.allChartsRefs.forEach((c: any) => {
        c.hideLoading()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../mixins';
.user-props {
  @include chart-container();
  flex-direction: row;
}
</style>