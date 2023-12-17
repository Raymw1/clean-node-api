import { JwtAdapter } from '@/infra/cryptography'
import jwt from 'jsonwebtoken'
import { throwError } from '../../domain/mocks'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },
  verify (): string {
    return 'any_value'
  }
}))

const mockJsonWebTokenError = (): Error => {
  class JsonWebTokenError extends Error {
    constructor () {
      super()
      this.name = 'JsonWebTokenError'
    }
  }
  return new JsonWebTokenError()
}

const makeSut = (): JwtAdapter => {
  const secret = 'secret'
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_id')
      expect(value).toBe('any_value')
    })

    test('should return null if verify throws JsonWebTokenError', async () => {
      const sut = makeSut()
      const error = mockJsonWebTokenError()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw error })
      const value = await sut.decrypt('any_id')
      expect(value).toBeNull()
    })

    test('should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError)
      const promise = sut.decrypt('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
})
