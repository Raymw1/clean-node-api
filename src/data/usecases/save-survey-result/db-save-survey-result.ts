import type { SaveSurveyResult, SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) { }

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return {
      id: '',
      accountId: '',
      surveyId: '',
      answer: '',
      date: new Date()
    }
  }
}
