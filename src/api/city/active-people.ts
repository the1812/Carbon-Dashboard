import { DayType } from './day-type'
import { ResponseCode, config, ApiError, axios, convertDate, ApiResponse, formatDate } from '..'
import { City } from './city'

export interface ActivePeopleQueryInfo {
  /** 填0代表全部城市 */
  cid: number
  day: Date
  dayType: DayType
  number: number
}
export const getActivePeople = async (query: ActivePeopleQueryInfo): Promise<{
  day: Date
  dayType: DayType
  number: number
  cityList: City[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get active people error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      day: new Date(),
      dayType: DayType.day,
      number: 1,
      cityList: [],
    }
  }
  const { data } = await axios.post('active', formatDate(query))
  return convertDate({
    status: data.status,
    day: data.day,
    dayType: data.dayType,
    number: data.number,
    cityList: data.activeCityList,
  }, 'day')
}