import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultParams } from '@/domain/usecases'
import faker from 'faker'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.random.uuid(),
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
      count: faker.random.number({ min: 0, max: 1000 }),
      percent: faker.random.number({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.random.boolean()
    },
    {
      answer: faker.random.word(),
      count: faker.random.number({ min: 0, max: 1000 }),
      percent: faker.random.number({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.random.boolean()
    }
  ],
  date: faker.date.recent()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.random.uuid(),
  surveyId: faker.random.uuid(),
  answer: faker.random.word(),
  date: faker.date.recent()
})