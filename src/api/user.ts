import { config, ApiError, ResponseCode } from '.'


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
  code: ResponseCode
  userProportion: {
    ageProportions?: ({ age: number } & Proportion)[]
    sexProportions?: ({ sex: string } & Proportion)[]
    professionProportions?: ({ profession: string } & Proportion)[]
    useTimeProportions?: ({ useTime: Date } & Proportion)[]
    trafficProportions?: ({ cid: number; type: number } & Proportion)[]
    animalProportions?: ({ animalID: number } & Proportion)[]
    planetProportions?: ({ planetID: number } & Proportion)[]
  }
}> => {
  if (config.mockFail) {
    throw new ApiError('get user info error')
  }
  return {
    code: ResponseCode.success,
    userProportion: {}
  }
}