import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return {
        body: null,
        statusCode: 0
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
