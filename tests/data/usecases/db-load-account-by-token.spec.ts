import { DbLoadAccountByToken } from '@/data/usecases'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
  sut: DbLoadAccountByToken
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
    sut
  }
}

let accessToken: string
let role: string

describe('LoadAccountByToken Usecase', () => {
  beforeEach(() => {
    accessToken = faker.database.mongodbObjectId()
    role = faker.lorem.word()
  })

  test('should call Decrypter with correct values', async () => {
    const { decrypterSpy, sut } = makeSut()
    await sut.load({ accessToken, role })
    expect(decrypterSpy.ciphertext).toBe(accessToken)
  })

  test('should return null if Decrypter returns null', async () => {
    const { decrypterSpy, sut } = makeSut()
    decrypterSpy.plaintext = null
    const account = await sut.load({ accessToken, role })
    expect(account).toBeNull()
  })

  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { loadAccountByTokenRepositorySpy, sut } = makeSut()
    await sut.load({ accessToken, role })
    expect(loadAccountByTokenRepositorySpy.loadAccountByTokenRepositoryParams).toEqual({
      accessToken,
      role
    })
  })

  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { loadAccountByTokenRepositorySpy, sut } = makeSut()
    loadAccountByTokenRepositorySpy.accountModel = null
    const account = await sut.load({ accessToken, role })
    expect(account).toBeNull()
  })

  test('should return an account on success', async () => {
    const { loadAccountByTokenRepositorySpy, sut } = makeSut()
    const account = await sut.load({ accessToken, role })
    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel)
  })

  test('should throw if Decrypter throws', async () => {
    const { decrypterSpy, sut } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load({ accessToken, role })
    await expect(promise).rejects.toThrow()
  })

  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { loadAccountByTokenRepositorySpy, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load({ accessToken, role })
    await expect(promise).rejects.toThrow()
  })
})
