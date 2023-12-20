import { type SurveyModel } from '@/domain/models'
import type { AddSurvey, LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel: SurveyModel | null = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel | null> {
    this.id = id
    return Promise.resolve(this.surveyModel)
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels()
  accountId: string

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return Promise.resolve(this.surveyModels)
  }
}
