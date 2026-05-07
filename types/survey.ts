export type Gender = '남성' | '여성' | '응답하지 않음'
export type AgeGroup = '20대 이하' | '20대' | '30대' | '40대' | '50대' | '60대 이상'
export type TrailExperience = '1년 미만' | '1~2년' | '2~3년' | '3~5년' | '5년 이상'

export interface SurveyData {
  // Step 1
  gender?: Gender
  ageGroup?: AgeGroup
  residence?: string
  trailExperience?: TrailExperience
  // Step 2
  importantFactors?: string[]
  anxietyFactors?: string[]
  // Step 3
  overallSatisfaction?: number
  detailedRatings?: {
    convenience: number
    cleanliness: number
    durability: number
    deliverySpeed: number
  }
  differentiator?: string
  nps?: number
  // Step 4
  additionalServices?: string
  freeOpinion?: string
  contact?: string
}
