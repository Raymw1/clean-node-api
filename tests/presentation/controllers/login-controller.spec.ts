import { LoginController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    authenticationSpy,
    validationSpy,
    sut
  }
}

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { authenticationSpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('should return 401 if invalid credential are provided', async () => {
    const { authenticationSpy, sut } = makeSut()
    authenticationSpy.authenticationModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { authenticationSpy, sut } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credential are provided', async () => {
    const { authenticationSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('should call Validation with correct value', async () => {
    const { validationSpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { validationSpy, sut } = makeSut()
    validationSpy.error = new MissingParamError('any_field')
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
