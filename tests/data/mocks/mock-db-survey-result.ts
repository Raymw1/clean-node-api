import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '../../domain/mocks'

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel: SurveyResultModel | null = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.surveyResultModel)
  }
}

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultParams

  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
    return Promise.resolve()
  }
}
