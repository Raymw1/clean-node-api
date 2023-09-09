import type { HttpRequest, Controller } from '../../presentation/protocols'
import type { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if ([200, 201].includes(httpResponse.statusCode)) {
      response.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      response.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
