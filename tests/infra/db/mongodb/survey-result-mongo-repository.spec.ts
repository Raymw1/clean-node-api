import type { AccountModel, SurveyModel } from '@/domain/models'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { ObjectId, type Collection } from 'mongodb'

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return res.ops[0] && MongoHelper.map<SurveyModel>(res.ops[0])
}

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0] && MongoHelper.map<AccountModel>(res.ops[0])
}

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('should insert a new survey result if there is no survey result with surveyId and accountId', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({ surveyId: survey.id, accountId: account.id }).toArray()
      expect(surveyResult[0]).toBeTruthy()
      expect(surveyResult[0].answer).toBe(survey.answers[0].answer)
    })

    test('should update a survey result if survey result it is not new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({ surveyId: survey.id, accountId: account.id }).toArray()
      expect(surveyResult).toHaveLength(1)
      expect(surveyResult[0]).toBeTruthy()
      expect(surveyResult[0].answer).toBe(survey.answers[1].answer)
    })
  })

  describe('loadBySurveyId()', () => {
    test('should load survey result on success', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const account2 = await mockAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(100)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[1].count).toBe(0)
      expect(surveyResult?.answers[1].percent).toBe(0)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers.length).toBe(survey.answers.length)
    })

    test('should load survey result on success 2', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const account2 = await mockAccount()
      const account3 = await mockAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account3.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account2.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(67)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(33)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers.length).toBe(survey.answers.length)
    })

    test('should load survey result on success 3', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const account2 = await mockAccount()
      const account3 = await mockAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account3.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers.length).toBe(survey.answers.length)
    })

    test('should return null if there is no surveyResult ', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)
      expect(surveyResult).toBeNull()
    })
  })
})