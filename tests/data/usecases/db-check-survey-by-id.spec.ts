import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
  sut: DbCheckSurveyById
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    checkSurveyByIdRepositorySpy,
    sut
  }
}

let surveyId

describe('DbCheckSurveyById Usecase', () => {
  beforeEach(() => {
    surveyId = faker.database.mongodbObjectId()
  })

  test('should call CheckSurveyByIdRepository with correct value', async () => {
    const { checkSurveyByIdRepositorySpy, sut } = makeSut()
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return true if CheckSurveyByIdRepository returns true', async () => {
    const { checkSurveyByIdRepositorySpy, sut } = makeSut()
    const surveyExists = await sut.checkById(surveyId)
    expect(surveyExists).toEqual(checkSurveyByIdRepositorySpy.result)
  })

  test('should return false if CheckSurveyByIdRepository returns false', async () => {
    const { checkSurveyByIdRepositorySpy, sut } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const surveyExists = await sut.checkById(surveyId)
    expect(surveyExists).toEqual(checkSurveyByIdRepositorySpy.result)
  })

  test('should throw if CheckSurveyByIdRepository throws', async () => {
    const { checkSurveyByIdRepositorySpy, sut } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError)
    const promise = sut.checkById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
