import { VercelRequest } from '@vercel/node'
import { BABEL_API_TOKEN, HEADERS } from '../constants'

export const isAuthorized = (request: VercelRequest) => {
  return request.headers[HEADERS.AUTHORIZATION] === `Bearer ${BABEL_API_TOKEN}`
}
