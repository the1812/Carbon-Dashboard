import { DayType } from './day-type'
import { config, ApiError, ResponseCode } from '..'

export interface Jam {
  tid: number
  trafficName: string
  startSid: number
  startStationName: string
  endSid: number
  endStationName: string
  day: Date
  jamIndex: number
}
export const getCityJams = async (city: number, day: Date, dayType: DayType): Promise<{
  code: ResponseCode
  day: Date,
  dayType: DayType
  number: number
  jamList: Jam[]
}> => {
  if (config.mockFail) {
    throw new ApiError('get city jams error')
  }
  return {
    code: ResponseCode.success,
    day: new Date(),
    dayType: DayType.day,
    number: 1,
    jamList: [],
  }
}