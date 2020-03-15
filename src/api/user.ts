import { config, ApiError, ResponseCode, axios, objectResponse, ApiResponse } from '.'


export const enum UserInfoQueryType {
  all,
  age,
  sex,
  profession,
  useTime,
  traffic,
  animal,
  planet,
}
type Proportion = {
  uid: number
  number: number
  proportion: number
}
export const getUserInfo = async (type: UserInfoQueryType): Promise<{
  userProportion: {
    ageProportions?: ({ age: number } & Proportion)[]
    sexProportions?: ({ sex: string } & Proportion)[]
    professionProportions?: ({ profession: string } & Proportion)[]
    useTimeProportions?: ({ useTime: Date } & Proportion)[]
    trafficProportions?: ({ cid: number; type: number } & Proportion)[]
    animalProportions?: ({ animalID: number } & Proportion)[]
    planetProportions?: ({ planetID: number } & Proportion)[]
  }
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get user info error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      userProportion: {}
    }
  }
  const { status, object: userProportion } = objectResponse(await axios.post('user', { type }))
  return {
    status,
    userProportion
  }
}