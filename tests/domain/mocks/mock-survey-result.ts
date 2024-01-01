import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResult } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.database.mongodbObjectId(),
  question: faker.lorem.words(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.lorem.word(),
      count: faker.number.int({ min: 0, max: 1000 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean()
    },
    {
      answer: faker.lorem.word(),
      count: faker.number.int({ min: 0, max: 1000 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean()
    }
  ],
  date: faker.date.recent()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: faker.database.mongodbObjectId(),
  surveyId: faker.database.mongodbObjectId(),
  answer: faker.lorem.word(),
  date: faker.date.recent()
})
