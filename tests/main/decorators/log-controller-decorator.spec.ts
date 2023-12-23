import { LogControllerDecorator } from '@/main/decorators'
import { created, serverError } from '@/presentation/helpers'
import type { Controller, HttpResponse } from '@/presentation/protocols'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import faker from 'faker'

class ControllerSpy implements Controller {
  httpResponse = created(faker.random.uuid())
  request: unknown

  async handle (request: unknown): Promise<HttpResponse> {
    this.request = request
    return Promise.resolve(this.httpResponse)
  }
}

const mockRequest = (): unknown => ({
  mockedParam: faker.lorem.sentence()
})

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
    const request = mockRequest()
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
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
