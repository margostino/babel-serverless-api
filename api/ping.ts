import { VercelRequest, VercelResponse } from '@vercel/node'

export const ping = (request: VercelRequest, response: VercelResponse) => {
  response.status(200).send('pong')
}

export default ping
