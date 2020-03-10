import { config, ApiError, ResponseCode, ApiResponse, axios, objectResponse } from '..'

export const getNewShoppingId = async (): Promise<{ shoppingId: number } & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get new shopping id error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      shoppingId: 1,
    }
  }
  const { status, object: shoppingId } = objectResponse(await axios.post('getNewSpid'))
  return {
    status,
    shoppingId,
  }
}
export const uploadImage = async (shoppingId: number, image: Blob): Promise<{
  path: string
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('upload image error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      path: '1.jpg',
    }
  }
  const formData = new FormData()
  formData.append('sp_id', shoppingId.toString())
  formData.append('file', image)
  const { data } = await axios.post('updateImage', formData, {
    headers: {
      contentType: 'multipart/form-FormData'
    }
  })
  return {
    status: data.status,
    path: data.msg,
  }
}
export const uploadShopping = async ({
  spId,
  name,
  totalNumber,
  detail,
  score,
  bigImage,
  smallImage
}: {
  spId :number
  name: string
  totalNumber: number
  detail: string
  score: number
  bigImage: string
  smallImage: string
}): Promise<ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('upload shopping error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success
    }
  }
  const { data } = await axios.post('updateGood', {
    sp_id: spId,
    name,
    totalNumber,
    detail,
    score,
    bigImage,
    smallImage,
  })
  return {
    status: data.status
  }
}