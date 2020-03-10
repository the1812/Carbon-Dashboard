export interface ActiveNumber {
  day: Date
  number: number
}
export interface City {
  cid: number
  name: string
  number: number
  activeNumbers: ActiveNumber[]
}