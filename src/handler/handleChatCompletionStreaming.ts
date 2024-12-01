import { VercelResponse } from '@vercel/node'
import { ChatCompletionChunk } from 'openai/resources/chat/completions'
import { logger } from '../logger'
import { getMemoriesByKeys } from '../memory'
import {
  ClassificationResponseCompletion,
  GetChatCompletionStreaming
} from '../openai'

export const handleChatCompletionStreaming = async ({
  query,
  memoryAssistantPrompt,
  queryClassification,
  response,
}: {
  query: string | string[]
  memoryClassificationPrompt: string
  memoryAssistantPrompt: string
  messages: any[] | undefined
  queryClassification: ClassificationResponseCompletion
  response: VercelResponse
}) => {
  const keys = queryClassification.keys
  const memoriesAssets = await getMemoriesByKeys(keys)

  try {
    // Send an initial message to establish the connection
    response.write('data: {"content": ""}\n\n')
    logger.info('getting assistant streamingcompletion')
    const assistantCompletionResponse = await GetChatCompletionStreaming({
      messages: [
        { role: 'system', content: memoryAssistantPrompt },
        { role: 'user', content: `Query: ${query}` },
        { role: 'user', content: `Memories: ${JSON.stringify(memoriesAssets)}` },
      ],
    })

    let assistantCompletionContent = ''

    for await (const chunk of assistantCompletionResponse as AsyncIterable<ChatCompletionChunk>) {
      // Check if connection is still alive
      if (response.writableEnded) {
        logger.warn('Connection closed by client')
        return
      }

      if (chunk === undefined) return
      if (!chunk.choices[0].delta.content) continue

      assistantCompletionContent += chunk.choices[0].delta.content

      const data = `data: ${JSON.stringify({
        content: chunk.choices[0].delta.content
      })}\n\n`

      logger.info(`Sending chunk: ${chunk.choices[0].delta.content}`) // Added logging
      response.write(data)
    }

    // End the stream
    response.write('data: [DONE]\n\n')
    logger.info(`streaming completed: ${assistantCompletionContent}`)

  } catch (error) {
    logger.error('Streaming error:', error)
    // If we haven't sent any data yet, we can send an error response
    if (!response.writableEnded) {
      response.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`)
    }
  } finally {
    if (!response.writableEnded) {
      response.end()
    }
  }

}
