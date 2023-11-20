import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'
import type { HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  sut: LoadSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    loadSurveyByIdStub,
    sut
  }
}

describe('LoadSurveyResult Controller', () => {
  test('should call LoadSurveyById with correct value', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
