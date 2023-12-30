import { DbSaveSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/tests/data/mocks'
import { mockSaveSurveyResultParams, throwError } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  sut: DbSaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
    sut
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { saveSurveyResultRepositorySpy, sut } = makeSut()
    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)
    expect(saveSurveyResultRepositorySpy.params).toEqual(surveyResultData)
  })

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositorySpy, sut } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyResultData.surveyId)
  })

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return a SurveyResult on success', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
