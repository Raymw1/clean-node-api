import { type SurveyModel } from '@/domain/models'
import type { AddSurvey } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.database.mongodbObjectId(),
  question: faker.lorem.words(),
  answers: [
    { image: faker.image.url(), answer: faker.lorem.word() },
    { answer: faker.lorem.word() }
  ],
  didAnswer: faker.datatype.boolean(),
  date: faker.date.recent()
})

export const mockSurveyModels = (): SurveyModel[] => ([
  mockSurveyModel(),
  mockSurveyModel()
])

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.lorem.words(),
  answers: [
    { answer: faker.lorem.word() },
    { image: faker.image.url(), answer: faker.lorem.word() }
  ],
  date: faker.date.recent()
})
