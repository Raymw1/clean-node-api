import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'
import MockDate from 'mockdate'

type SutTypes = {
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
  sut: DbLoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  return {
    loadSurveyByIdRepositorySpy,
    sut
  }
}

let surveyId

describe('DbLoadSurveyById Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.random.uuid()
  })

  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    await sut.loadById(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return a Survey on success', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    const survey = await sut.loadById(surveyId)
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.result)
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
