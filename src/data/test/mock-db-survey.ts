import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { type LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { type SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { type AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel: SurveyModel | null = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel | null> {
    this.id = id
    return Promise.resolve(this.surveyModel)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels()
  accountId: string

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return Promise.resolve(this.surveyModels)
  }
}
