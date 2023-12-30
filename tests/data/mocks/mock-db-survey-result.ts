import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { type SaveSurveyResultParams } from '@/domain/usecases'
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
  saveSurveyResultParams: SaveSurveyResultParams

  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
    return Promise.resolve()
  }
}
