import { throwError } from '@/domain/test'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest } from '@/presentation/protocols'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import faker from 'faker'
import { LoginController } from './login-controller'

const mockRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
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
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('should return 401 if invalid credential are provided', async () => {
    const { authenticationSpy, sut } = makeSut()
    authenticationSpy.accessToken = null
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
    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.accessToken }))
  })

  test('should call Validation with correct value', async () => {
    const { validationSpy, sut } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { validationSpy, sut } = makeSut()
    validationSpy.error = new MissingParamError('any_field')
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
