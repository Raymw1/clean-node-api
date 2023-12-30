import { type SurveyResultModel } from '@/domain/models'
import type { LoadSurveyResult, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
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
  surveyResultModel = mockSurveyResultModel()
  saveSurveyResultParams: SaveSurveyResultParams

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = data
    return Promise.resolve(this.surveyResultModel)
  }
}
