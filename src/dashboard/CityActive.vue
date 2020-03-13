<template>
  <div class="city-active">
    <v-chart ref="chart" theme="westeros" :options="chart" autoresize />
    <b-row class="m-0 params justify-content-center">
      <b-input-group class="mr-2 w-auto" prepend="时间单位">
        <b-form-select v-model="dayType" :options="dayTypeOptions"></b-form-select>
      </b-input-group>
      <b-input-group class="w-auto" prepend="对比数量">
        <b-form-spinbutton v-model="number" min="1" max="4"></b-form-spinbutton>
      </b-input-group>
    </b-row>
  </div>
</template>

<script lang="ts">
import { mapDate } from '../api'
import { groupBy } from 'lodash'
import { DayType } from '../api/city/day-type'
import {
  ActivePeopleQueryInfo,
  getActivePeople
} from '@/api/city/active-people'
import { toastError } from '../toast'
export default {
  data() {
    return {
      cid: 1,
      day: '2020/03/15 14:27:05',
      dayType: DayType.hour,
      dayTypeOptions: [
        { value: DayType.hour, text: '小时' },
        { value: DayType.day, text: '天' },
        { value: DayType.week, text: '周' },
        { value: DayType.year, text: '年' }
      ],
      number: 4,
      chart: {
        title: {
          text: '城市人数活跃度'
        },
        legend: {
          right: 0,
          top: 4
        },
        yAxis: {},
        xAxis: {},
        series: []
      }
    }
  },
  async mounted() {
    await this.loadChart()
  },
  computed: {
    queryParam(): ActivePeopleQueryInfo {
      return {
        cid: this.cid,
        day: this.day,
        dayType: this.dayType,
        number: this.number
      }
    }
  },
  watch: {
    queryParam() {
      this.loadChart()
    }
  },
  methods: {
    async loadChart() {
      try {
        this.$refs.chart.showLoading()
        const { cityList } = await getActivePeople(
          this.queryParam as ActivePeopleQueryInfo
        )
        if (cityList.length > 0) {
          const numbers = [...cityList[0].activeNumberList].reverse()
          const groups = groupBy(numbers, it => {
            const [, month, day] = it.time.match(/(\d+)-(\d+) /)!
            return `${month}-${day}`
          })
          this.chart.xAxis = {
            type: 'category',
            data: [
              ...new Set(
                numbers.map(it => {
                  const [, hour, minute] = it.time.match(/ (\d+):(\d+)/)!
                  return `${hour}:${minute}`
                })
              )
            ]
          }
          this.chart.series = Object.entries(groups).map(([date, items]) => {
            return {
              type: 'line',
              name: date,
              data: items.map(it => {
                const [, hour, minute] = it.time.match(/ (\d+):(\d+)/)!
                return [`${hour}:${minute}`, it.number]
              }),
              smooth: false
            }
          })
          console.log(this.chart.xAxis, this.chart.series)
        }
      } catch (error) {
        toastError(
          this.$bvToast,
          `加载城市活跃人数失败: ${error.message}`,
          '加载失败'
        )
      } finally {
        this.$refs.chart.hideLoading()
      }
    }
  }
}
</script>

<style lang="scss">
.city-active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .echarts {
    flex: 1 0 0;
  }
  .params {
    flex: 0 0 0;
  }
}
</style>