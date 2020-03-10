import { DayType } from './day-type'
import { ResponseCode, config, ApiError } from '..'
import { City } from './city'

export interface ActivePeopleQueryInfo {
  /** 填0代表全部城市 */
  cid: number
  day: Date
  dayType: DayType
  number: number
}
export const getActivePeople = async (query: ActivePeopleQueryInfo): Promise<{
  code: ResponseCode
  day: Date
  dayType: DayType
  number: number
  cityList: City[]
}> => {
  if (config.mockFail) {
    throw new ApiError('get active people error')
  }
  return {
    code: ResponseCode.success,
    day: new Date(),
    dayType: DayType.day,
    number: 1,
    cityList: [],
  }
}