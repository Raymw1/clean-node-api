import { type AccountModel } from '@/domain/models'
import type { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel, mockAuthenticationModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  accountCreated = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return Promise.resolve(this.accountCreated)
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
  accountModel: AccountModel | null = mockAccountModel()
  accessToken: string
  role?: string

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}
