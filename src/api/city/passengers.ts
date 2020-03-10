import { TrafficType } from './traffic'
import { ResponseCode, config, ApiError } from '..'
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
export const enum DetailNumberType {
  up,
  down
}
export interface DetailNumber {
  sid: number
  name: string
  type: DetailNumberType
  number: number
}
export interface PassengerNumber {
  startTime: Date
  endTime: Date
  number: number
  detailNumbers: DetailNumber[]
}
export const getPassengers = async (queryInfo: PassengerQueryInfo): Promise<{
  code: ResponseCode
  tid: number
  name: string
  day: Date,
  dayType: DayType
  passengerNumberList: PassengerNumber[]
}> => {
  if (config.mockFail) {
    throw new ApiError('get passengers error')
  }
  return {
    code: ResponseCode.success,
    tid: 1,
    name: 'name 1',
    day: new Date(),
    dayType: DayType.day,
    passengerNumberList: [],
  }
}