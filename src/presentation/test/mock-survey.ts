import { type SurveyModel } from '@/domain/models/survey'
import { mockSurveyModels } from '@/domain/test'
import type { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { type LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (input: AddSurveyParams): Promise<void> {
      return new Promise(resolve => { resolve() })
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => { resolve(mockSurveyModels()) })
    }
  }
  return new LoadSurveysStub()
}
