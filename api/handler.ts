import { VercelRequest, VercelResponse } from '@vercel/node'
import { getRandomMessage } from '../internal/utils/randomMessages'

export const Handler = (request: VercelRequest, response: VercelResponse) => {
  const { name = 'World' } = request.query
  const randomMessage = getRandomMessage()
  response.status(200).send(`Hello ${name}!, ${randomMessage}`)
}
