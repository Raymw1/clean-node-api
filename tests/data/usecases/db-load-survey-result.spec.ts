import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
  sut: DbLoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)
  return {
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
    sut
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.database.mongodbObjectId()
    accountId = faker.database.mongodbObjectId()
  })

  test('should call LoadSurveyResultRepository with correct value', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  test('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy, sut } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy, sut } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    const surveyResult = await sut.load(surveyId, accountId)
    const { result } = loadSurveyByIdRepositorySpy
    expect(surveyResult).toEqual({
      surveyId: result?.id,
      question: result?.question,
      date: result?.date,
      answers: result?.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    })
  })

  test('should return surveyResult on success', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
