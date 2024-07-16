import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'
import { getMessages } from '../google'
import { logger } from '../logger'
import { handleEcho } from './handleEcho'

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
    const messages = await getMessages()
    const transformedMessages = messages?.map((message) => {
      const jsonMessage = JSON.parse(message[1])
      return {
        timestamp: message[0],
        sender: jsonMessage['sender'],
        content: jsonMessage['content'],
      }
    })
    jsonResponse = {
      messages: transformedMessages,
    }
  }

  response.status(200).json(jsonResponse)
}
