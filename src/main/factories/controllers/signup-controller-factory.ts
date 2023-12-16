import { makeDbAddAccount, makeDbAuthentication, makeLogControllerDecorator } from '@/main/factories'
import { SignUpController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
