import { type AccountModel } from '@/domain/models/account'
import { type AuthenticationModel } from '@/domain/models/authentication'
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'
import type { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import type { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { type LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

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
