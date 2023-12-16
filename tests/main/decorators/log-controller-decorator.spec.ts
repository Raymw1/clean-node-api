import { LogControllerDecorator } from '@/main/decorators'
import { created, serverError } from '@/presentation/helpers'
import type { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import faker from 'faker'
import { LogErrorRepositorySpy } from '../../data/mocks'
import { mockAccountModel } from '../../domain/mocks'

class ControllerSpy implements Controller {
  httpResponse = created(mockAccountModel())
  httpRequest: HttpRequest

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return Promise.resolve(this.httpResponse)
  }
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = faker.random.words()
  return serverError(fakeError)
}

type SutTypes = {
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
  sut: LogControllerDecorator
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    controllerSpy,
    logErrorRepositorySpy,
    sut
  }
}

describe('LogController Decorator', () => {
  test('should call controller handle with correct value', async () => {
    const { controllerSpy, sut } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { controllerSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { controllerSpy, logErrorRepositorySpy, sut } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    await sut.handle(mockRequest())
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
