import { VercelRequest } from '@vercel/node'
import { isAdmin } from './isAdmin'
import { isAuthorized } from './isAuthorized'
import { isDev } from './isDev'
import { isValidRequest } from './isValidRequest'

export const shouldHandleRequest = (request: VercelRequest) => {
  return isDev() || (isAdmin(request) && isAuthorized(request) && isValidRequest(request))
}
