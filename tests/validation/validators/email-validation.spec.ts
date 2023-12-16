import { InvalidParamError } from '@/presentation/errors'
import { EmailValidation } from '@/validation/validators'
import faker from 'faker'
import { throwError } from '../../domain/mocks'
import { EmailValidatorSpy } from '../mocks'

const field = faker.random.word()

type SutTypes = {
  emailValidatorSpy: EmailValidatorSpy
  sut: EmailValidation
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(field, emailValidatorSpy)
  return {
    emailValidatorSpy,
    sut
  }
}

describe('Email Validation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { emailValidatorSpy, sut } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const email = faker.internet.email()
    const error = sut.validate({ [field]: email })
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('should call EmailValidator with correct email', () => {
    const { emailValidatorSpy, sut } = makeSut()
    const email = faker.internet.email()
    sut.validate({ [field]: email })
    expect(emailValidatorSpy.email).toBe(email)
  })

  test('should throw if EmailValidator throws', () => {
    const { emailValidatorSpy, sut } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })
})
