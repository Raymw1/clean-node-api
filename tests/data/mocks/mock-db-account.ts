import type { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols'
import faker from 'faker'

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true
  addAccountParams: AddAccountRepository.Params

  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data
    return Promise.resolve(this.result)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result: LoadAccountByEmailRepository.Result = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  }

  email: string

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  accountModel: LoadAccountByTokenRepository.Result = { id: faker.random.uuid() }
  loadAccountByTokenRepositoryParams: LoadAccountByTokenRepository.Params

  async loadByToken (params: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
    this.loadAccountByTokenRepositoryParams = params
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
