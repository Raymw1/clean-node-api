import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { type SaveSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  result: LoadSurveyResultRepository.Result = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResult.Params

  async save (params: SaveSurveyResult.Params): Promise<void> {
    this.params = params
    return Promise.resolve()
  }
}
