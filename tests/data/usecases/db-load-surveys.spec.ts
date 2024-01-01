import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveysRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
  sut: DbLoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    loadSurveysRepositorySpy,
    sut
  }
}

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepository', async () => {
    const { loadSurveysRepositorySpy, sut } = makeSut()
    const accountId = faker.database.mongodbObjectId()
    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('should return a list of surveys on success', async () => {
    const { loadSurveysRepositorySpy, sut } = makeSut()
    const surveys = await sut.load(faker.database.mongodbObjectId())
    expect(surveys).toEqual(loadSurveysRepositorySpy.result)
  })

  test('should throw if LoadSurveysRepository throws', async () => {
    const { loadSurveysRepositorySpy, sut } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load(faker.database.mongodbObjectId())
    await expect(promise).rejects.toThrow()
  })
})
