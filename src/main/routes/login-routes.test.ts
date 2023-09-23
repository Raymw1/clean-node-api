import { type Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

let accountCollection: Collection

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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Rayan',
        email: 'rayan.wilbert@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'rayan.wilbert@gmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
