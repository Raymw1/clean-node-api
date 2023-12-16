import { SaveSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import type { HttpRequest } from '@/presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { throwError } from '../../domain/mocks'
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '../mocks'

const mockRequest = (answer?: string): HttpRequest => ({
  params: {
    surveyId: faker.random.uuid()
  },
  body: {
    answer
  },
  accountId: faker.random.uuid()
})

interface SutTypes {
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  sut: SaveSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)
  return {
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
    sut
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct values', async () => {
    const { loadSurveyByIdSpy, sut } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyByIdSpy.id).toBe(httpRequest.params.surveyId)
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { loadSurveyByIdSpy, sut } = makeSut()
    loadSurveyByIdSpy.surveyModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { loadSurveyByIdSpy, sut } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: faker.random.uuid()
      },
      body: {
        answer: faker.random.word()
      },
      accountId: faker.random.uuid()
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { loadSurveyByIdSpy, saveSurveyResultSpy, sut } = makeSut()
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    await sut.handle(httpRequest)
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date()
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { loadSurveyByIdSpy, saveSurveyResultSpy, sut } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { loadSurveyByIdSpy, saveSurveyResultSpy, sut } = makeSut()
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})
