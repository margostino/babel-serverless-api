import { VercelRequest } from '@vercel/node'
import { BABEL_ADMIN_TOKEN, HEADERS } from '../constants'

export const isAdmin = (request: VercelRequest) => {
  return request.headers[HEADERS.X_BABEL_ADMIN_TOKEN] === BABEL_ADMIN_TOKEN
}
