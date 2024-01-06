import { Router, type Express } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)
  await Promise.all(readdirSync(join(__dirname, '..', 'routes')).map(async (file) => {
    if (!file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  }))
}
