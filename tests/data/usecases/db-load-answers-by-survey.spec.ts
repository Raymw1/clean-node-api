import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
  sut: DbLoadAnswersBySurvey
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)
  return {
    loadSurveyByIdRepositorySpy,
    sut
  }
}

let surveyId

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid()
  })

  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return survey answers on success', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.result?.answers[0].answer,
      loadSurveyByIdRepositorySpy.result?.answers[1].answer
    ])
  })

  test('should return empty array LoadSurveyByIdRepository if LoadSurveyByIdRepository returns null', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
