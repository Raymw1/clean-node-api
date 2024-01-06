import { MongoHelper, SurveyMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { ObjectId, type Collection } from 'mongodb'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
}

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut()
      const addSurveyParams = mockAddSurveyParams()
      await sut.add(addSurveyParams)
      const survey = await surveyCollection.findOne({ question: addSurveyParams.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey?._id),
        accountId: new ObjectId(accountId),
        answer: survey?.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('should load an empty list if there are no surveys', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('checkById()', () => {
    test('should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const surveyExists = await sut.checkById(res.insertedId.toHexString())
      expect(surveyExists).toBe(true)
    })

    test('should return false if survey does not exists', async () => {
      const sut = makeSut()
      const surveyExists = await sut.checkById(new ObjectId().toHexString())
      expect(surveyExists).toBe(false)
    })
  })

  describe('loadAnswers()', () => {
    test('should load answers on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const survey = (await surveyCollection.findOne({ _id: res.insertedId }))!
      const sut = makeSut()
      const answers = await sut.loadAnswers(survey._id.toHexString())
      expect(answers).toEqual([survey.answers[0].answer, survey.answers[1].answer])
    })

    test('should return an empty array if survey does not exist', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(new ObjectId().toHexString())
      expect(answers).toEqual([])
    })
  })

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.insertedId.toHexString())
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
    })

    test('should return null if loadById fails', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(new ObjectId().toHexString())
      expect(survey).toBeNull()
    })
  })
})
