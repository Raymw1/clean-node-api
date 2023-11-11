import { apiKeyAuthSchema } from '../schemas'
import { badRequest, forbidden, notFound, serverError, unauthorized } from '../components'

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized
}
