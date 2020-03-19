import { TrafficType } from './traffic'
import { ResponseCode, config, ApiError, ApiResponse, axios, convertDate, mapDate } from '..'
import { DayType } from './day-type'

export interface PassengerQueryInfo {
  cid: number
  type: TrafficType
  tid: number
  /** 站点id
   * - `-1`: 只获取公交和地铁的人数情况而不是精确到站点
   * - `0`: 获取全部站点 */
  sid: 0 | -1
  day: Date
  dayType: DayType
  number: number
}
export interface DetailNumber {
  sid: number
  name: string
  day: string
  on_number: number
  off_number: number
}
export interface PassengerNumber {
  startTime: Date
  endTime: Date
  number: number
  detailNumberList: DetailNumber[]
}
export const getPassengers = async (queryInfo: PassengerQueryInfo): Promise<{
  tid: number
  name: string
  day: Date,
  dayType: DayType
  passengerNumberList: PassengerNumber[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get passengers error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      tid: 1,
      name: 'name 1',
      day: new Date(),
      dayType: DayType.day,
      passengerNumberList: [],
    }
  }
  const { data } = await axios.post('passenger', queryInfo)
  return convertDate({
    status: data.status,
    tid: data.tid,
    name: data.name,
    day: data.day,
    dayType: data.dayType,
    passengerNumberList: mapDate(mapDate(data.passengerNumberList, 'startTime'), 'endTime'),
  }, 'day')
}