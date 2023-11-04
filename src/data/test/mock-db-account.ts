import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { type LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { type AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
      return new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => { resolve() })
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
