import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
  sut: DbLoadAnswersBySurvey
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)
  return {
    loadAnswersBySurveyRepositorySpy,
    sut
  }
}

let surveyId

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid()
  })

  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepositorySpy.surveyId).toBe(surveyId)
  })

  test('should return survey answers on success', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result)
  })

  test('should return empty array LoadSurveyByIdRepository if LoadSurveyByIdRepository returns null', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
