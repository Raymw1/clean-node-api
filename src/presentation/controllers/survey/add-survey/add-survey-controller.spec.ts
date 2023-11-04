import { throwError } from '@/domain/test'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAddSurvey, mockValidation } from '@/presentation/test'
import MockDate from 'mockdate'
import { AddSurveyController } from './add-survey-controller'
import type { AddSurvey, HttpRequest, Validation } from './add-survey-controller-protocols'

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date()
  }
})

type SutTypes = {
  validationStub: Validation
  addSurveyStub: AddSurvey
  sut: AddSurveyController
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    validationStub,
    addSurveyStub,
    sut
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct values', async () => {
    const { validationStub, sut } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation fails', async () => {
    const { validationStub, sut } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('should call AddSurvey with correct values', async () => {
    const { addSurveyStub, sut } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { addSurveyStub, sut } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
