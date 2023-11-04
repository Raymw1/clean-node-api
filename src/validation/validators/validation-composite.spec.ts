import { MissingParamError } from '@/presentation/errors'
import { type Validation } from '@/presentation/protocols'
import { mockValidation } from '@/validation/test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  validationStubs: Validation[]
  sut: ValidationComposite
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    validationStubs,
    sut
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { validationStubs, sut } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should return the first error if more than one validation fails', () => {
    const { validationStubs, sut } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
