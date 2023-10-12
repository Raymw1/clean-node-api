import { EmailInUseError } from '../../../errors'
import { badRequest, created, forbidden, serverError } from '../../../helpers/http/http-helper'
import type { AddAccount, Authentication, Controller, HttpRequest, HttpResponse, Validation } from './signup-controller-protocols'

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
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const accessToken = await this.authentication.auth({ email, password })
      return created({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
