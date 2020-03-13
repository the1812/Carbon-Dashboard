export interface ActiveNumber {
  /** 注意这里为了方便使用没有转成Date */
  time: string
  number: number
}
export interface City {
  cid: number
  name: string
  number: number
  activeNumberList: ActiveNumber[]
}