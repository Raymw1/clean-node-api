import { AccountMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { type Collection } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  describe('add()', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const isValid = await sut.add(addAccountParams)
      expect(isValid).toBe(true)
    })
  })

  describe('checkByEmail()', () => {
    test('should return true on checkByEmail success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const accountExists = await sut.checkByEmail(addAccountParams.email)
      expect(accountExists).toBe(true)
    })

    test('should return null if checkByEmail fails', async () => {
      const sut = makeSut()
      const accountExists = await sut.checkByEmail(faker.internet.email())
      expect(accountExists).toBe(false)
    })
  })

  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(addAccountParams.name)
      expect(account?.password).toBe(addAccountParams.password)
    })

    test('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken()', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      const accessToken = faker.database.mongodbObjectId()
      await sut.updateAccessToken(fakeAccount._id, accessToken)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(accessToken)
    })
  })

  describe('loadByToken()', () => {
    let accessToken: string

    beforeEach(() => {
      accessToken = faker.database.mongodbObjectId()
    })

    test('should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, { accessToken }))
      const account = await sut.loadByToken({ accessToken })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    test('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, { accessToken, role: 'admin' }))
      const account = await sut.loadByToken({ accessToken, role: 'admin' })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    test('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), { accessToken }))
      const account = await sut.loadByToken({ accessToken, role: 'admin' })
      expect(account).toBeNull()
    })

    test('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, { accessToken, role: 'admin' }))
      const account = await sut.loadByToken({ accessToken })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(accessToken)
      expect(account).toBeNull()
    })
  })
})
