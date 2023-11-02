import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResultStub: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const accountId = httpRequest.accountId as string
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const availableAnswers = survey.answers.map(a => a.answer)
        if (!availableAnswers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      await this.saveSurveyResultStub.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return {
        body: null,
        statusCode: 0
      }
    } catch (error) {
      return serverError(error)
    }
  }
}