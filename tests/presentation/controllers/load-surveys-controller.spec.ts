import { LoadSurveysController } from '@/presentation/controllers'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { LoadSurveysSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: faker.database.mongodbObjectId()
})

type SutTypes = {
  loadSurveysSpy: LoadSurveysSpy
  sut: LoadSurveysController
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    loadSurveysSpy,
    sut
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys with correct value', async () => {
    const { loadSurveysSpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.accountId).toBe(request.accountId)
  })

  test('should return 200 on success', async () => {
    const { loadSurveysSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.result))
  })

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { loadSurveysSpy, sut } = makeSut()
    loadSurveysSpy.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { loadSurveysSpy, sut } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
