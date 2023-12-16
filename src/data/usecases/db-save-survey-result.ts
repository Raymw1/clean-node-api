import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import type { SurveyResultModel } from '@/domain/models'
import type { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId) as SurveyResultModel
    return surveyResult
  }
}
