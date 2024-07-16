import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'
import { saveMessage } from '../github'
import { logger } from '../logger'
import { handleEcho } from './handleEcho'

export const handleSaveMessageRequest = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  let jsonResponse = null
  if (!shouldHandleRequest(request)) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const { message, isEcho } = request.query

  logger.info(`new message to save: ${message}`)
  if (isEcho === 'true') {
    jsonResponse = await handleEcho(message)
  } else {
    await saveMessage(message as string)
    jsonResponse = {
      message: 'Message saved',
    }
  }

  response.status(200).json(jsonResponse)
}
