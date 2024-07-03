import { VercelRequest, VercelResponse } from '@vercel/node'
import { getRandomMessage } from '../src'

export const Hello = (request: VercelRequest, response: VercelResponse) => {
  const { name = 'World' } = request.query
  const randomMessage = getRandomMessage()
  response.status(200).send(`Hello ${name}!, ${randomMessage}`)
}

export default Hello
