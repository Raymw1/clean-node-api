import type { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols'
import type { SurveyModel } from '@/domain/models'
import type { LoadSurveyResult } from '@/domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId) as SurveyModel
      surveyResult = this.makeEmptyResult(survey)
    }
    return surveyResult
  }

  private makeEmptyResult (survey: SurveyModel): LoadSurveyResult.Result {
    return {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    }
  }
}
