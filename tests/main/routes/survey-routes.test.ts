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
  const id = res.insertedId
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
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            { image: 'http://image-name.com', answer: 'Answer 1' },
            { answer: 'Answer 2' }
          ]
        })
        .expect(403)
    })

    test('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            { image: 'http://image-name.com', answer: 'Answer 1' },
            { answer: 'Answer 2' }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            { image: 'any_image', answer: 'any_answer' },
            { answer: 'any_answer' }
          ],
          date: new Date()
        }
      ])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
