import type { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'
import { mockAuthenticationModel } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

export class AddAccountSpy implements AddAccount {
  result = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return Promise.resolve(this.result)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationModel: Authentication.Result = mockAuthenticationModel()
  authenticationParams: Authentication.Params

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authentication
    return Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result: LoadAccountByToken.Result = { id: faker.database.mongodbObjectId() }
  loadAccountByTokenParams: LoadAccountByToken.Params

  async load (params: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result> {
    this.loadAccountByTokenParams = params
    return Promise.resolve(this.result)
  }
}
