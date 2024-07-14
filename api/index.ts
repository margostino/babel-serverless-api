import { VercelRequest, VercelResponse } from '@vercel/node'
import { handleRequest } from '../src'

export default async function handle(request: VercelRequest, response: VercelResponse) {
  await handleRequest(request, response)
}
