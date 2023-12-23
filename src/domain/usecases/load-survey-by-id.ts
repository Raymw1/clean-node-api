import { type SurveyModel } from '@/domain/models'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<LoadSurveyById.Result>
}

export namespace LoadSurveyById {
  export type Result = SurveyModel | null
}
