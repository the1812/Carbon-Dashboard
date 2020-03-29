import { StarAnimal } from './star-animal'
import { ApiResponse, config, ResponseCode, axios, mapDate } from '..'

export const getStarAnimals = async (): Promise<{
  starAnimalList: StarAnimal[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new Error('get star animals error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      starAnimalList: [],
    }
  }
  const { data } = await axios.get('getAll')
  return {
    status: data.status,
    starAnimalList: mapDate(data.starAnimalList, 'createTime')
  }
}