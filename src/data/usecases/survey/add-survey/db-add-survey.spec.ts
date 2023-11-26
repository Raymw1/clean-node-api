import { AddSurveyRepositorySpy } from '@/data/test'
import { mockAddSurveyParams, throwError } from '@/domain/test'
import { DbAddSurvey } from './db-add-survey'

type SutTypes = {
  addSurveyRepositorySpy: AddSurveyRepositorySpy
  sut: DbAddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    addSurveyRepositorySpy,
    sut
  }
}

describe('DbAddSurvey Usecase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    const { addSurveyRepositorySpy, sut } = makeSut()
    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { addSurveyRepositorySpy, sut } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
