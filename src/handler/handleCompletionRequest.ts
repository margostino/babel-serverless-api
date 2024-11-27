import { VercelRequest, VercelResponse } from '@vercel/node'
import { getMessages } from '../google'
import { logger } from '../logger'
import { getMessagesToJson } from '../transformations/getMessagesToJson'
import { handleChatCompletion } from './handleChatCompletion'
import { handleEcho } from './handleEcho'
import { loadPrompts } from './loadPrompts'

export const handleCompletionRequest = async (request: VercelRequest, response: VercelResponse) => {
  let jsonResponse = null

  const { query, isEcho } = request.query

  logger.info(`new request: ${query}`)
  if (isEcho === 'true') {
    jsonResponse = await handleEcho(query)
  } else {
    const result = await Promise.all([getMessages(), loadPrompts()])
    const transformedMessages = getMessagesToJson(result[0])
    const { memoryClassificationPrompt, memoryAssistantPrompt } = result[1]
    jsonResponse = await handleChatCompletion({
      memoryAssistantPrompt,
      memoryClassificationPrompt,
      query,
      messages: transformedMessages,
    })
  }

  response.status(200).json(jsonResponse)
}
