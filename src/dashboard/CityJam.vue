<template>
  <div class="city-jam">
    <v-chart ref="chart" theme="westeros" :options="chart" autoresize />
    <b-row class="m-0 params justify-content-center">
      <b-input-group class="mr-2 mb-2 w-auto" prepend="日期">
        <b-form-datepicker locale="zh-CN" v-model="day"></b-form-datepicker>
      </b-input-group>
      <b-input-group class="mb-2 w-auto" prepend="对比数量">
        <b-form-spinbutton v-model="number" min="1" max="4"></b-form-spinbutton>
      </b-input-group>
    </b-row>
    <b-row class="m-0 params justify-content-center">
      <b-input-group class="mr-2 w-auto" prepend="类型">
        <b-form-select v-model="trafficType" :options="trafficTypeOptions"></b-form-select>
      </b-input-group>
      <b-input-group class="mr-2 w-auto" prepend="线路">
        <b-form-select v-model="selectedTraffic" :options="trafficOptions"></b-form-select>
      </b-input-group>
      <b-input-group class="w-auto" prepend="站点">
        <b-form-select v-model="selectedStation" :options="stationOptions"></b-form-select>
      </b-input-group>
    </b-row>
  </div>
</template>

<script lang="ts">
import { DayType } from '../api/city/day-type'
import { TrafficType } from '../api/city/traffic'
import { getCityJams, Jam } from '../api/city/jam'
import { groupBy, sortBy, uniqBy } from 'lodash'
import { toastError } from '@/toast'
type DropdownOption<T = number> = {
  value: T
  text: string
}
export default {
  data() {
    return {
      cid: 1,
      day: '2020-03-17',
      dayType: DayType.hour,
      dayTypeOptions: [
        { value: DayType.hour, text: '小时' },
        { value: DayType.day, text: '天' },
        { value: DayType.week, text: '周' },
        { value: DayType.year, text: '年' }
      ],
      number: 2,
      trafficType: TrafficType.metro,
      trafficTypeOptions: [
        { value: TrafficType.metro, text: '地铁' },
        { value: TrafficType.bus, text: '公交' }
      ],
      selectedTraffic: '',
      selectedStation: '',
      jamList: [],
      chart: {
        title: {
          text: '城市拥堵时段'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{c}'
        },
        legend: {
          // right: 0,
          // top: 4,
          type: 'scroll'
        },
        yAxis: {},
        xAxis: {},
        series: []
      }
    }
  },
  computed: {
    queryParam() {
      return {
        cid: this.cid,
        day: this.day.replace(/-/g, '/') + ' 23:00:00',
        dayType: this.dayType,
        number: this.number,
        type: this.trafficType
      }
    },
    trafficOptions() {
      return uniqBy(
        (this.jamList as Jam[]).map(it => {
          return {
            value: it.tid,
            text: it.trafficName
          }
        }),
        it => it.value
      )
    },
    stationOptions() {
      return uniqBy(
        (this.jamList as Jam[])
          .filter(it => {
            return it.tid === this.selectedTraffic
          })
          .map(it => {
            return {
              value: it.startSid,
              text: it.startStationName
            }
          }),
        it => it.value
      )
    }
  },
  watch: {
    queryParam() {
      this.loadChart()
    },
    selectedStation() {
      this.applyChartOptions()
    },
    selectedTraffic() {
      this.applyChartOptions()
    },
    trafficOptions(options: DropdownOption[]) {
      if (!options.some(it => it.value === this.selectedTraffic)) {
        this.selectedTraffic = options[0].value
      }
    },
    stationOptions(options: DropdownOption[]) {
      if (!options.some(it => it.value === this.selectedStation)) {
        this.selectedStation = options[0].value
      }
    }
  },
  methods: {
    applyChartOptions() {
      this.$refs.chart.clear()
      const jamList = (this.jamList as Jam[]).filter(
        it => it.tid === this.selectedTraffic
      )
      if (jamList.length > 0) {
        this.chart.xAxis = {
          type: 'category',
          data: [
            ...new Set(
              sortBy(
                jamList.map(it => {
                  const [, hour, minute] = it.day.match(
                    / (\d+):(\d+)/
                  )!
                  return `${hour}:${minute}`
                })
              )
            )
          ]
        }
        const groups = groupBy(
          jamList.filter(it => {
            return (
              it.tid === this.selectedTraffic &&
              it.startSid === this.selectedStation
            )
          }),
          it => {
            const [, month, day] = it.day.match(/(\d+)-(\d+) /)!
            return `${month}-${day}`
          }
        )
        console.log(groups)
        this.chart.series = Object.entries(groups).map(([date, items]) => {
          return {
            type: 'bar',
            name: date,
            data: items.map(it => {
              const [, hour, minute] = it.day.match(/ (\d+):(\d+)/)!
              return [`${hour}:${minute}`, it.jamIndex]
            })
          }
        })
      }
    },
    async loadChart() {
      try {
        this.$refs.chart.clear()
        this.$refs.chart.showLoading()
        let { jamList } = await getCityJams(this.queryParam)
        this.jamList = jamList
        await this.$nextTick()
        this.applyChartOptions()
      } catch (error) {
        toastError(
          this.$bvToast,
          `加载城市拥堵情况失败: ${error.message}`,
          '加载失败'
        )
      } finally {
        this.$refs.chart.hideLoading()
      }
    }
  },
  async mounted() {
    await this.loadChart()
  }
}
</script>

<style lang="scss" scoped>
@import '../mixins';
.city-jam {
  @include chart-container();
}
</style>