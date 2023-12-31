import { type CheckSurveyById } from '@/domain/usecases'

export interface CheckSurveyByIdRepository {
  checkById: (id: string) => Promise<CheckSurveyByIdRepository.Result>
}

export namespace CheckSurveyByIdRepository {
  export type Result = CheckSurveyById.Result
}
