import type { Middleware } from '@/presentation/protocols'
import type { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (httpRequest: Request, httpResponse: Response, next: NextFunction) => {
    const request = {
      ...(httpRequest.headers || {})
    }
    const response = await middleware.handle(request)
    if (response.statusCode === 200) {
      Object.assign(httpRequest, response.body)
      next()
    } else {
      httpResponse.status(response.statusCode).json({ error: response.body.message })
    }
  }
}
