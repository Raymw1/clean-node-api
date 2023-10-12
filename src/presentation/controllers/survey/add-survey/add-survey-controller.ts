import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import type { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
