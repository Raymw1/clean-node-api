import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rayan',
          email: 'rayan.wilbert@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(201)
    })
  })
})
