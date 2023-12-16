import { MongoHelper } from '@/infra/db'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import { type Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Rayan',
    email: 'rayan.wilbert@gmail.com',
    password: '123',
    role
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('should return 200 on save survey result with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyResult = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          { image: 'http://image-name.com', answer: 'Answer 1' },
          { answer: 'Answer 2' }
        ],
        date: new Date()
      })
      const surveyId = surveyResult.ops[0]._id as string
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('should return 200 on load survey result with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyResult = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          { image: 'http://image-name.com', answer: 'Answer 1' },
          { answer: 'Answer 2' }
        ],
        date: new Date()
      })
      const surveyId = surveyResult.ops[0]._id as string
      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
