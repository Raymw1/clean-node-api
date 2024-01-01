import { SaveSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockRequest = (answer?: string): SaveSurveyResultController.Request => ({
  accountId: faker.database.mongodbObjectId(),
  answer: answer ?? faker.lorem.words(),
  surveyId: faker.database.mongodbObjectId()
})

interface SutTypes {
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  sut: SaveSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultSpy)
  return {
    loadAnswersBySurveySpy,
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

  test('should call LoadAnswersBySurvey with correct values', async () => {
    const { loadAnswersBySurveySpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadAnswersBySurveySpy.id).toBe(request.surveyId)
  })

  test('should return 403 if LoadAnswersBySurvey returns empty array', async () => {
    const { loadAnswersBySurveySpy, sut } = makeSut()
    loadAnswersBySurveySpy.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { loadAnswersBySurveySpy, sut } = makeSut()
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      accountId: faker.database.mongodbObjectId(),
      answer: faker.lorem.word(),
      surveyId: faker.database.mongodbObjectId()
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { loadAnswersBySurveySpy, saveSurveyResultSpy, sut } = makeSut()
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(request)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { loadAnswersBySurveySpy, saveSurveyResultSpy, sut } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { loadAnswersBySurveySpy, saveSurveyResultSpy, sut } = makeSut()
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})
