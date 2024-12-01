import { VercelRequest, VercelResponse } from '@vercel/node'
import { getMessages } from '../google'
import { logger } from '../logger'
import { getMessagesToJson } from '../transformations/getMessagesToJson'
import { handleChatCompletion } from './handleChatCompletion'
import { handleChatCompletionStreaming } from './handleChatCompletionStreaming'
import { handleClassificationChatCompletion } from './handleClassificationChatCompletion'
import { handleEcho } from './handleEcho'
import { loadPrompts } from './loadPrompts'

export const handleCompletionRequest = async (request: VercelRequest, response: VercelResponse) => {
  let jsonResponse = null

  const { query, isEcho, streamEnabled } = request.query
  const isStreamEnabled = streamEnabled === 'true'

  logger.info(`new request: ${query}`)
  if (isEcho === 'true') {
    jsonResponse = await handleEcho(query)
  } else {
    const result = await Promise.all([getMessages(), loadPrompts()])
    const transformedMessages = getMessagesToJson(result[0])
    const { memoryClassificationPrompt, memoryAssistantPrompt } = result[1]

    const queryClassification = await handleClassificationChatCompletion({
      memoryClassificationPrompt,
      query,
      messages: transformedMessages,
    })

    if (queryClassification) {
      if (isStreamEnabled) {
        response.setHeader('Content-Type', 'text/event-stream')
        response.setHeader('Cache-Control', 'no-cache')
        response.setHeader('Connection', 'keep-alive')
        response.setHeader('Transfer-Encoding', 'chunked')
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Content-Encoding', 'identity')

        const heartbeatInterval = setInterval(() => {
          if (!response.writableEnded) {
            response.write(':\n\n');
          }
        }, 15000);

        response.on('close', () => {
          logger.warn('Connection closed by client');
          clearInterval(heartbeatInterval);
        })

        // Important: Prevent Vercel from buffering the response
        response.flushHeaders()
        await handleChatCompletionStreaming({
          memoryAssistantPrompt,
          memoryClassificationPrompt,
          query,
          messages: transformedMessages,
          queryClassification,
          response,
        })
      } else{
        jsonResponse = await handleChatCompletion({
          memoryAssistantPrompt,
          memoryClassificationPrompt,
          query,
          messages: transformedMessages,
          queryClassification,
        })
        response.status(200).json(jsonResponse)
      }
    } else{
      logger.info('no assistant completion content')
      jsonResponse = {
        error: 'No message content found',
      }
      response.status(200).json(jsonResponse)
    }
  }
}
