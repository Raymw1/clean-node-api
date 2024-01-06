import express from 'express'
import setupSwagger from './config-swagger'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupStaticFiles from './static-files'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app).catch((error) => {
  console.error('CleanNodeApi - Error registering routes', error)
  process.exit()
})
export default app
