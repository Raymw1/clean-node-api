import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import type { SurveyResultModel } from '@/domain/models'
import type { SaveSurveyResult } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async save (params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(params)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(params.surveyId, params.accountId) as SurveyResultModel
    return surveyResult
  }
}
