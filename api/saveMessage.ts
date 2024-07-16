import { VercelRequest, VercelResponse } from '@vercel/node'
import { handleSaveMessageRequest, handleSecureRequest } from '../src'

export default async function handleSaveReply(request: VercelRequest, response: VercelResponse) {
  await handleSecureRequest(request, response, handleSaveMessageRequest)
}
