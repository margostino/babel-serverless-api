import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'
import { logger } from '../logger'
import { handleEcho } from './handleEcho'
import { loadConversation } from './loadConversation'

export const handleMessagesRequest = async (request: VercelRequest, response: VercelResponse) => {
  let jsonResponse = null
  if (!shouldHandleRequest(request)) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const { isEcho } = request.query

  logger.info('new request to get messages')
  if (isEcho === 'true') {
    jsonResponse = await handleEcho('echo getting messages')
  } else {
    const conversation = await loadConversation()
    jsonResponse = conversation.reverse()
  }

  response.status(200).json(jsonResponse)
}
