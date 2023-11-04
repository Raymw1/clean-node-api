import { mockAccountModel } from '@/domain/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import type { AccountModel, Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string | null> {
      return new Promise(resolve => { resolve('any_value') })
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
      return new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  sut: DbLoadAccountByToken
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    decrypterStub,
    loadAccountByTokenRepositoryStub,
    sut
  }
}

describe('LoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if Decrypter returns null', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('should throw if Decrypter throws', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
