import { VercelRequest, VercelResponse } from '@vercel/node'
import { handleMessagesRequest, handleSecureRequest } from '../src'

export default async function handleConversation(request: VercelRequest, response: VercelResponse) {
  await handleSecureRequest(request, response, handleMessagesRequest)
}
