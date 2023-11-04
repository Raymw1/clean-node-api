import { type SurveyModel } from '@/domain/models/survey'
import { type SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyModel, mockSurveyResultModel } from '@/domain/test'
import type { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return new Promise(resolve => { resolve(mockSurveyModel()) })
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => { resolve(mockSurveyResultModel()) })
    }
  }
  return new SaveSurveyResultStub()
}
