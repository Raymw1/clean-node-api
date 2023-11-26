import { throwError } from '@/domain/test'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { AddSurveySpy, ValidationSpy } from '@/presentation/test'
import faker from 'faker'
import MockDate from 'mockdate'
import { AddSurveyController } from './add-survey-controller'
import type { HttpRequest } from './add-survey-controller-protocols'

const mockRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [{ image: faker.image.imageUrl(), answer: faker.random.word() }],
    date: new Date()
  }
})

type SutTypes = {
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
  sut: AddSurveyController
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    validationSpy,
    addSurveySpy,
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
    const { validationSpy, sut } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('should return 400 if Validation fails', async () => {
    const { validationSpy, sut } = makeSut()
    validationSpy.error = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('should call AddSurvey with correct values', async () => {
    const { addSurveySpy, sut } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSurveySpy.addSurveyParams).toEqual(httpRequest.body)
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { addSurveySpy, sut } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
