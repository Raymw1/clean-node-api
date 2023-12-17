import type { AccountModel } from '@/domain/models'
import type { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository {
  add: (data: AddAccountRepository.Params) => Promise<AccountModel>
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params
  export type Result = AccountModel
}
