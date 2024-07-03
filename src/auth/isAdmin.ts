import { VercelRequest } from '@vercel/node'

export const isAdmin = (request: VercelRequest) => {
  // return request.headers[HEADERS.X_BABEL_ADMIN_TOKEN] === BABEL_ADMIN_TOKEN
  // TODO
  return true
}
