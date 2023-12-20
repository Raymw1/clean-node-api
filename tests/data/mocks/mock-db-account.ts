import type { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols'
import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountModel = mockAccountModel()
  addAccountParams: AddAccountRepository.Params

  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data
    return Promise.resolve(this.accountModel)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  accountModel: AccountModel | null = mockAccountModel()
  email: string

  async loadByEmail (email: string): Promise<AccountModel | null> {
    this.email = email
    return Promise.resolve(this.accountModel)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  accountModel: AccountModel | null = mockAccountModel()
  token: string
  role?: string

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    this.token = token
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    return Promise.resolve()
  }
}