import { config, ResponseCode, ApiError, delay, axios, mapDate, ApiResponse, mapImage, formatDate } from '.'

export const enum ReviewType {
  planet,
  animal,
}
export const enum ReviewStatus {
  notReviewed,
  approved,
  rejected,
}
export interface Review {
  rid: number
  type: ReviewType
  name: string
  image: string
  detail: string
  belong: string
  createTime: Date
  usage: ReviewStatus
}
export const getReviewList = async (): Promise<{
  reviewList: Review[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('review list error')
  }
  if (config.mock) {
    await delay(1000)
    return {
      status: ResponseCode.success,
      reviewList: [
        {
          rid: 1,
          type: ReviewType.planet,
          name: 'Review 1',
          image: 'static/1.jpg',
          detail: 'detail 1',
          belong: 'belong 1',
          createTime: new Date(),
          usage: ReviewStatus.notReviewed
        },
        {
          rid: 2,
          type: ReviewType.animal,
          name: 'Review 2',
          image: 'static/1.jpg',
          detail: 'detail 2, '.repeat(1000),
          belong: 'belong 2',
          createTime: new Date(),
          usage: ReviewStatus.approved
        }
      ]
    }
  }
  const response = await axios.get('review')
  return {
    status: response.status,
    reviewList: mapImage(mapDate<Review>(response.data.reviewList, 'createTime'), 'image')
  }
}
export const enum ReviewResult {
  rejected,
  approved,
}
export const postReview = async (uid: number, rid: number, type: ReviewResult): Promise<ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('post review error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success
    }
  }
  const response = await axios.post('examine', {
    uid,
    rid,
    type,
  })
  return {
    status: response.data.status,
  }
}