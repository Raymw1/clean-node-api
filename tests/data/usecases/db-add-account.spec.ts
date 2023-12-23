import { DbAddAccount } from '@/data/usecases'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/tests/data/mocks'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  sut: DbAddAccount
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.result = null
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
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

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositorySpy, sut } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

  test('should return false if LoadAccountByEmailRepository does not return null', async () => {
    const { loadAccountByEmailRepositorySpy, sut } = makeSut()
    loadAccountByEmailRepositorySpy.result = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password()
    }
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(false)
  })
})
