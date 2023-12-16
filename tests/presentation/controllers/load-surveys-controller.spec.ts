import { LoadSurveysController } from '@/presentation/controllers'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { type HttpRequest } from '@/presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { throwError } from '../../domain/mocks'
import { LoadSurveysSpy } from '../mocks'

const mockRequest = (): HttpRequest => ({
  accountId: faker.random.uuid()
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
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId)
  })

  test('should return 200 on success', async () => {
    const { loadSurveysSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels))
  })

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { loadSurveysSpy, sut } = makeSut()
    loadSurveysSpy.surveyModels = []
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
