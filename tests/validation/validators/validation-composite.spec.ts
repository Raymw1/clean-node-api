import { MissingParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/tests/validation/mocks'
import { ValidationComposite } from '@/validation/validators'
import { faker } from '@faker-js/faker'

type SutTypes = {
  validationSpies: ValidationSpy[]
  sut: ValidationComposite
}

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)
  return {
    validationSpies,
    sut
  }
}

const field = faker.lorem.word()

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { validationSpies, sut } = makeSut()
    validationSpies[1].error = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.lorem.word() })
    expect(error).toEqual(new MissingParamError(field))
  })

  test('should return the first error if more than one validation fails', () => {
    const { validationSpies, sut } = makeSut()
    validationSpies[0].error = new Error()
    validationSpies[1].error = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.lorem.word() })
    expect(error).toEqual(new Error())
  })

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ [field]: faker.lorem.word() })
    expect(error).toBeFalsy()
  })
})
