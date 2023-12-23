import { DbAddAccount } from '@/data/usecases'
import { AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy, HasherSpy } from '@/tests/data/mocks'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
  sut: DbAddAccount
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  checkAccountByEmailRepositorySpy.result = false
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)
  return {
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy,
    sut
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { hasherSpy, sut } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  test('should throw if Hasher throws', async () => {
    const { hasherSpy, sut } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { hasherSpy, addAccountRepositorySpy, sut } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositorySpy, sut } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return true on success', async () => {
    const { sut } = makeSut()
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(true)
  })

  test('should return false if AddAccountRepository returns false', async () => {
    const { addAccountRepositorySpy, sut } = makeSut()
    addAccountRepositorySpy.result = false
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(false)
  })

  test('should call CheckAccountByEmailRepository with correct email', async () => {
    const { checkAccountByEmailRepositorySpy, sut } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(checkAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

  test('should return false if CheckAccountByEmailRepository returns true', async () => {
    const { checkAccountByEmailRepositorySpy, sut } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(false)
  })
})
