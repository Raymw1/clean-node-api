import type { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols'
import type { SurveyModel, SurveyResultModel } from '@/domain/models'
import type { LoadSurveyResult } from '@/domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId) as SurveyModel
      surveyResult = Object.assign({}, {
        surveyId: survey.id,
        question: survey.question,
        answers: survey.answers.map(answer => Object.assign({}, answer, { count: 0, percent: 0, isCurrentAccountAnswer: false })),
        date: survey.date
      })
    }
    return surveyResult
  }
}