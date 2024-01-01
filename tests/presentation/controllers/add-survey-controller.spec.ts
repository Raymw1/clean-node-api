import { AddSurveyController } from '@/presentation/controllers'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { AddSurveySpy, ValidationSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.lorem.words(),
  answers: [{ image: faker.image.url(), answer: faker.lorem.word() }]
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
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('should return 400 if Validation fails', async () => {
    const { validationSpy, sut } = makeSut()
    validationSpy.error = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('should call AddSurvey with correct values', async () => {
    const { addSurveySpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addSurveySpy.addSurveyParams).toEqual(Object.assign({}, request, { date: new Date() }))
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
