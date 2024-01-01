import { type AddAccount } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
