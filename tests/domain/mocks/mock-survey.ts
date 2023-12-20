import { type SurveyModel } from '@/domain/models'
import type { AddSurvey } from '@/domain/usecases'
import faker from 'faker'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.random.uuid(),
  question: faker.random.words(),
  answers: [
    { image: faker.image.imageUrl(), answer: faker.random.word() },
    { answer: faker.random.word() }
  ],
  didAnswer: faker.random.boolean(),
  date: faker.date.recent()
})

export const mockSurveyModels = (): SurveyModel[] => ([
  mockSurveyModel(),
  mockSurveyModel()
])

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [
    { answer: faker.random.word() },
    { image: faker.image.imageUrl(), answer: faker.random.word() }
  ],
  date: faker.date.recent()
})
