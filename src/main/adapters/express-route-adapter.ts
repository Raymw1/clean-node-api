import type { Controller } from '@/presentation/protocols'
import type { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (httpRequest: Request, httpResponse: Response) => {
    const request = {
      ...(httpRequest.body || {}),
      ...(httpRequest.params || {}),
      accountId: httpRequest.accountId
    }
    const response = await controller.handle(request)
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      httpResponse.status(response.statusCode).json(response.body)
    } else {
      httpResponse.status(response.statusCode).json({ error: response.body.message })
    }
  }
}
