import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'

type AsyncHandler = (request: VercelRequest, response: VercelResponse) => Promise<void>

export const handleSecureRequest = async (
  request: VercelRequest,
  response: VercelResponse,
  next: AsyncHandler
) => {
  if (!shouldHandleRequest(request)) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }
  await next(request, response)
}
