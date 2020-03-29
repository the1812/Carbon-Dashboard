export const enum StarAnimalType {
  animal = 1,
  star = 2,
}
export interface StarAnimal {
  saId: number
  type: StarAnimalType
  name: string
  smallPic: string
  bigPic: string
  story: string
  unlockNum: number
  createMan: string
  likeNumber: number
  createTime: Date
  hitProbability: number
  probability: number
}