import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const field = faker.lorem.word()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: faker.lorem.word() })
    expect(error).toEqual(new MissingParamError(field))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: faker.lorem.word() })
    expect(error).toBeFalsy()
  })

  test('should return a MissingParamError if validation fails when field is blank', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: '' })
    expect(error).toEqual(new MissingParamError(field))
  })
})
