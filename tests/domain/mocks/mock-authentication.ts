import { type Authentication } from '@/domain/usecases'
import faker from 'faker'

export const mockAuthenticationModel = (): Authentication.Result => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
