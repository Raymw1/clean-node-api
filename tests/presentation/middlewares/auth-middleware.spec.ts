import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AuthMiddleware } from '@/presentation/middlewares'
import type { HttpRequest } from '@/presentation/protocols'
import faker from 'faker'
import { throwError } from '../../domain/mocks'
import { LoadAccountByTokenSpy } from '../mocks'

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.random.uuid()
  }
})

type SutTypes = {
  loadAccountByTokenSpy: LoadAccountByTokenSpy
  sut: AuthMiddleware
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    loadAccountByTokenSpy,
    sut
  }
}

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { loadAccountByTokenSpy, sut } = makeSut(role)
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token'])
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { loadAccountByTokenSpy, sut } = makeSut()
    loadAccountByTokenSpy.accountModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { loadAccountByTokenSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: loadAccountByTokenSpy.accountModel?.id }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { loadAccountByTokenSpy, sut } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
