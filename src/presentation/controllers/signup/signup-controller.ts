import type { AddAccount, Authentication, Controller, HttpRequest, HttpResponse, Validation } from './signup-controller-protocols'
import { badRequest, created, serverError } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({
        name,
        email,
        password
      })
      const accessToken = await this.authentication.auth({ email, password })
      return created({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
