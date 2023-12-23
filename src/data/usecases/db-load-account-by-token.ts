import type { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import type { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load ({ accessToken, role }: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken({ accessToken, role })
      if (account) {
        return account
      }
    }
    return null
  }
}
