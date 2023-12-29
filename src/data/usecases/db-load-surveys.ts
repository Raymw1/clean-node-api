import type { LoadSurveysRepository } from '@/data/protocols'
import type { SurveyModel } from '@/domain/models'
import type { LoadSurveys } from '@/domain/usecases'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) { }

  async load (accountId: string): Promise<SurveyModel[]> {
    return this.loadSurveysRepository.loadAll(accountId)
  }
}
