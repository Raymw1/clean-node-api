import type { AddSurveyRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyRepository.Params

  async add (data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result: CheckSurveyByIdRepository.Result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return Promise.resolve(this.result)
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  result: LoadAnswersBySurveyRepository.Result = [faker.lorem.word(), faker.lorem.word()]
  surveyId: string

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result: LoadSurveyByIdRepository.Result = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  result = mockSurveyModels()
  accountId: string

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
