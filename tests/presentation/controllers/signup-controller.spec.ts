import { SignUpController } from '@/presentation/controllers'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

type SutTypes = {
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
  sut: SignUpController
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)
  return {
    addAccountSpy,
    validationSpy,
    authenticationSpy,
    sut
  }
}

describe('SignUp Controller', () => {
  test('should call AddAccount with correct values', async () => {
    const { addAccountSpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { addAccountSpy, sut } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should return 403 if AddAccount returns false', async () => {
    const { addAccountSpy, sut } = makeSut()
    addAccountSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('should return 201 if valid data is provided', async () => {
    const { authenticationSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(created(authenticationSpy.authenticationModel))
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

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('should return 500 if Authentication throws', async () => {
    const { authenticationSpy, sut } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
