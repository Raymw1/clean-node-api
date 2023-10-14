import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import type { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}