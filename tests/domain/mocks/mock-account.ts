import { type AccountModel } from '@/domain/models'
import { type AddAccount } from '@/domain/usecases'
import faker from 'faker'

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), {
  id: faker.random.uuid(),
  password: faker.internet.password()
})

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
