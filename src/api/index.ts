import Axios, { AxiosResponse } from 'axios'
import { isPlainObject, cloneDeep, get, set } from 'lodash'
export const config = {
  mock: false,
  mockFail: false,
  host: 'http://119.3.150.77:8001/',
  imageRoot: 'http://119.3.150.77:8080/carbon/image/',
}
export const enum ResponseCode {
  success = 200,
  failed = 201,
}
export const delay = (ms: number) => {
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms))
}
export const mapDate = <T extends {}>(array: T[], prop: string) => {
  return array.map(item => {
    const newItem = cloneDeep(item)
    const dateValue = get(item, prop) as string
    set(newItem, prop, new Date(dateValue))
    return newItem
  })
}
export const convertDate = <T extends {}>(item: T, prop: string) => {
  set(item, prop, new Date(get(item, prop) as string))
}
export const formatDate = <T extends {}>(obj: T | T[]) => {
  const result = cloneDeep(obj)
  const format = (obj: any) => {
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        obj[key] = `${value.getFullYear()}/${value.getMonth() + 1}/${value.getDate()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}:${value.getSeconds().toString().padStart(2, '0')}`
      }
      if (Array.isArray(value) || isPlainObject(value)) {
        obj[key] = format(value)
      }
    }
    return obj
  }
  return format(result)
}
export const mapImage = <T extends {}>(array: T[], prop: string) => {
  return array.map(item => {
    const newItem = cloneDeep(item)
    const imageUrl = get(item, prop) as string
    set(newItem, prop, config.imageRoot + imageUrl)
    return newItem
  })
}
export const convertImage = <T extends {}>(item: T, prop: string) => {
  set(item, prop, config.imageRoot + (get(item, prop) as string))
}
export const objectResponse = (response: AxiosResponse): {
  status: ResponseCode,
  object: any
} => {
  return {
    status: response.data.status,
    object: response.data.object,
  }
}
export interface ApiResponse {
  status: ResponseCode
  msg?: string
}
export class ApiError extends Error {
  name = 'ApiError'
  response: {
    status: ResponseCode.failed
    msg: string
  }
  constructor(message: string) {
    super(message)
    this.response = {
      status: ResponseCode.failed,
      msg: message,
    }
  }
}
export const axios = (() => {
  const instance = Axios.create({
    baseURL: config.host,
    transformRequest: [(data) => {
      if (isPlainObject(data)) {
        return Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')
      }
      return data
    }],
    transformResponse: [(data) => {
      if (data.status !== ResponseCode.success) {
        console.error(data)
        throw new ApiError(data.msg || (data.error + '\n' + data.message))
      }
      return data
    }]
  })
  instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  instance.defaults.responseType = 'json'
  return instance
})()
declare global {
  interface Window {
    apiConfig: typeof config
  }
}
window.apiConfig = config