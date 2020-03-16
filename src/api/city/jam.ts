import { DayType } from './day-type'
import { config, ApiError, ResponseCode, ApiResponse, axios, mapDate } from '..'
import { TrafficType } from './traffic'

export interface Jam {
  tid: number
  trafficName: string
  startSid: number
  startStationName: string
  endSid: number
  endStationName: string
  day: string
  jamIndex: number
}
export interface CityJamQueryInfo {
  cid: number
  day: string
  dayType: DayType
  number: number
  type: TrafficType
}
export const getCityJams = async (queryInfo: CityJamQueryInfo): Promise<{
  jamList: Jam[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get city jams error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      jamList: [],
    }
  }
  const { data } = await axios.post('jam', queryInfo)
  return {
    status: data.status,
    jamList: data.jamList,
  }
}