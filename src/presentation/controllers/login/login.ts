import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import type { Controller, EmailValidator, HttpRequest, HttpResponse } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      }
      if (!password) {
        return badRequest(new MissingParamError('password'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return { statusCode: 0, body: {} }
    } catch (error) {
      return serverError(error)
    }
  }
}
