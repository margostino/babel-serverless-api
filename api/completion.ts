import { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCompletionRequest, handleSecureRequest } from '../src'

export default async function getCompletion(request: VercelRequest, response: VercelResponse) {
  await handleSecureRequest(request, response, handleCompletionRequest)
}
