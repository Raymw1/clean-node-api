import type { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSurveyResultModel()
  params: SaveSurveyResult.Params

  async save (params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.params = params
    return Promise.resolve(this.result)
  }
}
