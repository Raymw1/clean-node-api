import { type AccountModel } from '@/domain/models/account'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), {
  id: 'any_id',
  password: 'hashed_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
