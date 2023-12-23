import { type LoadAccountByToken } from '@/domain/usecases'

export interface LoadAccountByTokenRepository {
  loadByToken: (params: LoadAccountByTokenRepository.Params) => Promise<LoadAccountByTokenRepository.Result>
}

export namespace LoadAccountByTokenRepository {
  export type Params = LoadAccountByToken.Params
  export type Result = LoadAccountByToken.Result
}
