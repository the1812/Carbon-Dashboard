import { config, ApiError, ResponseCode, ApiResponse, axios, objectResponse, mapImage } from '..'
import { Shopping } from './shopping'


export const getShoppings = async (): Promise<{
  shoppingList: Shopping[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get shoppings error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      shoppingList: [],
    }
  }
  const { status, object: shoppingList } = objectResponse(await axios.get('shop'))
  return  {
    status,
    shoppingList: mapImage(mapImage(shoppingList, 'bigImage'), 'smallImage')
  }
}