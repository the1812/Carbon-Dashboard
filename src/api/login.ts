import { config, ResponseCode, ApiError, axios, delay, ApiResponse, objectResponse } from '.'

export const login = async (account: string, password: string): Promise<{
  uid: number
  username: string
  avatar: string
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('login error')
  }
  if (config.mock) {
    await delay(1000)
    return {
      status: ResponseCode.success,
      uid: 1,
      username: '管理员',
      avatar: '',
    }
  }
  const { status, object: obj } = objectResponse(await axios.post('ulogin', {
    account,
    password,
  }))
  return {
    status,
    uid: obj.suId,
    avatar: config.imageRoot + obj.avatar,
    username: obj.name,
  }
}