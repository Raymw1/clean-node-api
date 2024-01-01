import { type Authentication } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAuthenticationModel = (): Authentication.Result => ({
  accessToken: faker.database.mongodbObjectId(),
  name: faker.person.fullName()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
