import { config, ResponseCode, ApiError, axios, delay, ApiResponse } from '.'

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
  const response = await axios.post('ulogin', {
    account,
    password,
  })
  const obj = response.data.object
  return {
    status: response.data.status,
    uid: obj.suId,
    avatar: config.imageRoot + obj.avatar,
    username: obj.name,
  }
}