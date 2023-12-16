import { makeDbAuthentication, makeLogControllerDecorator } from '@/main/factories'
import { LoginController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
