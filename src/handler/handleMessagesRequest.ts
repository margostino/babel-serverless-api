import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'
import { getMessages } from '../google'
import { logger } from '../logger'
import { getMessagesToJson } from '../transformations/getMessagesToJson'
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
    const transformedMessages = getMessagesToJson(messages)
    jsonResponse = {
      messages: transformedMessages,
    }
  }

  response.status(200).json(jsonResponse)
}
