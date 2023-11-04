import { type AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import type { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import type { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { type LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string | null> {
      return new Promise(resolve => { resolve('any_token') })
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel | null> {
      return new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new LoadAccountByTokenStub()
}
