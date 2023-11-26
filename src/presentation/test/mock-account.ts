import { type AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import type { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import type { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { type LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import faker from 'faker'

export class AddAccountSpy implements AddAccount {
  accountModel: AccountModel | null = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = account
    return await Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  accessToken: string | null = faker.random.uuid()
  authenticationParams: AuthenticationParams

  async auth (authentication: AuthenticationParams): Promise<string | null> {
    this.authenticationParams = authentication
    return Promise.resolve(this.accessToken)
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
