export const enum TrafficType {
  metro,
  bus,
}
export interface Station {
  sid: number
  name: string
}
export interface Traffic {
  city: string
  tid: number
  type: TrafficType
  name: string
  stationList: Station[]
}