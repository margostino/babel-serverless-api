import { VercelRequest, VercelResponse } from '@vercel/node'

export const Ping = (request: VercelRequest, response: VercelResponse) => {
  response.status(200).send('pong')
}
