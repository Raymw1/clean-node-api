import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { type LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { type SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel } from '@/domain/test'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => { resolve() })
    }
  }
  return new LogErrorRepositoryStub()
}

export const mockLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return new Promise(resolve => { resolve(mockSurveyModel()) })
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}
