import { type AccountModel, type AuthenticationModel } from '@/domain/models'
import type { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel, mockAuthenticationModel } from '../../domain/mocks'

export class AddAccountSpy implements AddAccount {
  accountModel: AccountModel | null = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = account
    return await Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationModel: AuthenticationModel | null = mockAuthenticationModel()
  authenticationParams: AuthenticationParams

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel | null> {
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
