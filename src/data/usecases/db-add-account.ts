import type { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    let newAccount: AccountModel | null = null
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      newAccount = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    }
    return newAccount != null
  }
}
