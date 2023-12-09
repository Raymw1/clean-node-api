import { type AuthenticationModel } from '@/domain/models/authentication'
import { type AuthenticationParams } from '@/domain/usecases/account/authentication'
import faker from 'faker'

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
