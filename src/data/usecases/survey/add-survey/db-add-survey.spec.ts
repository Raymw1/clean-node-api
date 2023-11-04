import { mockAddSurveyRepository } from '@/data/test'
import { mockAddSurveyParams, throwError } from '@/domain/test'
import { DbAddSurvey } from './db-add-survey'
import type { AddSurveyRepository } from './db-add-survey-protocols'

type SutTypes = {
  addSurveyRepositoryStub: AddSurveyRepository
  sut: DbAddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    addSurveyRepositoryStub,
    sut
  }
}

describe('DbAddSurvey Usecase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
