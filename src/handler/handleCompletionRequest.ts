import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'
import { getMessages } from '../google'
import { logger } from '../logger'
import { getMessagesToJson } from '../transformations/getMessagesToJson'
import { handleChatCompletion } from './handleChatCompletion'
import { handleEcho } from './handleEcho'
import { loadPrompts } from './loadPrompts'

export const handleCompletionRequest = async (request: VercelRequest, response: VercelResponse) => {
  let jsonResponse = null
  if (!shouldHandleRequest(request)) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const { query, isEcho } = request.query

  logger.info(`new request: ${query}`)
  if (isEcho === 'true') {
    jsonResponse = await handleEcho(query)
  } else {
    const messages = await getMessages()
    const transformedMessages = getMessagesToJson(messages)
    const { memoryClassificationPrompt, memoryAssistantPrompt } = await loadPrompts()
    jsonResponse = await handleChatCompletion({
      memoryAssistantPrompt,
      memoryClassificationPrompt,
      query,
      messages: transformedMessages,
    })
  }

  response.status(200).json(jsonResponse)
}
