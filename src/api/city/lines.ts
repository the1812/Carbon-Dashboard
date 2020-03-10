import { config, ApiError, ResponseCode } from '..'
import { Traffic } from './traffic'

export const getCityLines = async (cid: number): Promise<{
  code: ResponseCode
  trafficList: Traffic[]
}> => {
  if (config.mockFail) {
    throw new ApiError('get city lines error')
  }
  return {
    code: ResponseCode.success,
    trafficList: []
  }
}