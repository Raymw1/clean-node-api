import { type SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import type { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { type LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
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
