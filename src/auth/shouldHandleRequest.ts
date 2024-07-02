import { VercelRequest } from '@vercel/node'
import { isAdmin } from './isAdmin'
import { isAuthorized } from './isAuthorized'
import { isValidRequest } from './isValidRequest'

export const shouldHandleRequest = (request: VercelRequest) => {
  return isAdmin(request) && isAuthorized(request) && isValidRequest(request)
}
