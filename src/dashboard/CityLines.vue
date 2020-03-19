<template>
  <div class="city-lines">
    <b-card class="config mr-4" title="线路数据">
      <b-input-group class="w-auto mb-2 mt-4" prepend="选择城市">
        <b-form-select v-model="city" :options="cities"></b-form-select>
      </b-input-group>
      <b-input-group class="w-auto mb-2" prepend="选择线路">
        <b-dropdown :text="trafficName">
          <b-dropdown-group v-for="group of traffics" :key="group.name" :header="group.name">
            <b-dropdown-item-button
              v-for="item of group.items"
              :key="item.tid"
              @click="setTraffic(item)"
            >{{item.name}}</b-dropdown-item-button>
          </b-dropdown-group>
        </b-dropdown>
      </b-input-group>
      <b-input-group class="w-auto mb-4" prepend="选择站点">
        <b-form-select v-model="station" :options="stations"></b-form-select>
      </b-input-group>
      <b-card-text>
        选择城市后, 下方的城市类图表也会一并更新.
      </b-card-text>
    </b-card>
    <v-chart ref="chart" theme="westeros" :options="chart" autoresize />
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations } from 'vuex'
import { Traffic, TrafficType } from '../api/city/traffic'
import { getCities } from '../api/city/city'
import { getCityLines } from '../api/city/lines'
import { groupBy } from 'lodash'
import { DayType } from '@/api/city/day-type'
import { getPassengers, DetailNumber } from '../api/city/passengers'
import { toastError } from '@/toast'
const today = new Date()
const threeDaysLater = new Date(Number(today) + 3 * 24 * 3600 * 1000)
export default {
  data() {
    return {
      details: [],
      city: 1,
      cities: [],
      traffic: 1,
      trafficType: 0,
      trafficName: '',
      traffics: [],
      station: '',
      stations: [],
      number: 1,
      day: `${threeDaysLater.getFullYear()}-${threeDaysLater.getMonth() +
        1}-${threeDaysLater.getDate()}`,
      dayType: DayType.hour,
      chart: {
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {c}'
        },
        legend: {
          right: 0,
          top: 4
        },
        yAxis: {},
        xAxis: {}
      }
    }
  },
  computed: {
    ...mapState(['selectedCid']),
    params() {
      return {
        cid: this.city,
        type: this.trafficType,
        tid: this.traffic,
        sid: 0,
        day: this.day.replace(/-/g, '/') + ' 23:00:00',
        dayType: this.dayType,
        number: this.number
      }
    }
  },
  watch: {
    city() {
      this.updateCid(this.city)
    },
    params() {
      this.loadChart()
    },
    station() {
      this.applyChartOptions()
    }
  },
  methods: {
    ...mapMutations(['updateCid']),
    setTraffic(traffic: Traffic) {
      this.traffic = traffic.tid
      this.trafficType = traffic.type
      this.trafficName = traffic.name
    },
    applyChartOptions() {
      this.$refs.chart.clear()
      const groups = groupBy(this.details, d => d.sid)
      const items = groups[this.station].reverse()
      this.chart.xAxis = {
        type: 'category',
        splitLine: { show: false },
        data: items.map(it => {
          const [, hour, minute] = it.day.match(/ (\d+):(\d+)/)!
          return `${hour}:${minute}`
        })
      }
      const up = {
        type: 'line',
        name: '上车',
        smooth: false,
        data: items.map(it => {
          const [, hour, minute] = it.day.match(/ (\d+):(\d+)/)!
          return [`${hour}:${minute}`, it.on_number]
        })
      }
      const down = {
        type: 'line',
        name: '下车',
        smooth: false,
        data: items.map(it => {
          const [, hour, minute] = it.day.match(/ (\d+):(\d+)/)!
          return [`${hour}:${minute}`, it.off_number]
        })
      }
      this.chart.series = [up, down]
    },
    async loadChart() {
      try {
        this.$refs.chart.clear()
        this.$refs.chart.showLoading()
        const { passengerNumberList } = await getPassengers(this.params)
        this.details = passengerNumberList[0].detailNumberList
        const groups = groupBy(this.details as DetailNumber[], d => d.sid)
        this.stations = Object.entries(groups).map(([sid, items]) => {
          return {
            value: sid,
            text: items[0].name,
          }
        })
        if (!this.stations.includes(this.station)) {
          this.station = this.stations[0].value
        }
        this.applyChartOptions()
      } catch (error) {
        toastError(
          this.$bvToast,
          `加载城市线路信息失败: ${error.message}`,
          '加载失败'
        )
      } finally {
        this.$refs.chart.hideLoading()
      }
    }
  },
  async mounted() {
    const { cityList } = await getCities()
    this.cities = cityList.map(c => {
      return {
        value: c.cid,
        text: c.name || c.cname
      }
    })
    this.city = cityList[0].cid
    const { trafficList } = await getCityLines(this.city)
    this.traffics = Object.entries(
      groupBy(trafficList, t => {
        return t.type === TrafficType.metro ? '地铁' : '公交'
      })
    ).map(([name, items]) => {
      return {
        name,
        items
      }
    })
    this.setTraffic(this.traffics[0].items[0])
    this.loadChart()
  }
}
</script>

<style lang="scss" scoped>
@import '../mixins';
.city-lines {
  @include chart-container();
  flex-direction: row;
  .config {
    flex: 1 0 0;
  }
  .echarts {
    flex-grow: 2;
  }
}
</style>