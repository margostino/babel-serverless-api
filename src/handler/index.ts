import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../auth'
import { logger } from '../logger'
import { handleChatCompletion } from './handleChatCompletion'
import { handleEcho } from './handleEcho'
import { loadPrompts } from './loadPrompts'

export const handleRequest = async (request: VercelRequest, response: VercelResponse) => {
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
    const { memoryClassificationPrompt, memoryAssistantPrompt } = await loadPrompts()
    jsonResponse = await handleChatCompletion({
      memoryAssistantPrompt,
      memoryClassificationPrompt,
      query,
    })
  }

  response.status(200).json(jsonResponse)
}
