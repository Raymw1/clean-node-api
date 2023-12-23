import type { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository {
  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)
    return result.ops[0] !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    }, {
      _id: 1,
      name: 1,
      password: 1
    })
    return account && MongoHelper.map<LoadAccountByEmailRepository.Result>(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, {
      $set: { accessToken: token }
    })
  }

  async loadByToken ({ accessToken, role }: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    }, {
      $projection: {
        _id: 1
      }
    })
    return account && MongoHelper.map(account)
  }
}
