import { VercelRequest, VercelResponse } from '@vercel/node'
import { GetChatCompletion, getMemoriesByKeys, logger, shouldHandleRequest } from '../src'
import {
  GITHUB_MEMORY_ASSISTANT_PROMPT_PATH,
  GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH,
  OPENAI_MODEL,
} from '../src/constants'
import { getIndex, getPrompt } from '../src/github'
import { chatCompletionToFirstChoiceMessageContent } from '../src/utils/chatCompletionToFirstChoiceMessageContent'

let memoryClassificationPrompt: { prompt: string }
let memoryAssistantPrompt: { prompt: string }

export const handleRequest = async (request: VercelRequest, response: VercelResponse) => {
  if (!shouldHandleRequest(request)) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const { query, isEcho } = request.query

  logger.info(`new request: ${query}`)

  if (isEcho === 'true') {
    logger.info(`echo request: ${query}`)
    response.status(200).json({
      message: {
        thinking_process: 'this is just an echo',
        response: query,
        sources: [],
      },
    })
    return
  }

  if (!memoryClassificationPrompt) {
    logger.info('getting memory classification prompt')
    memoryClassificationPrompt = await getPrompt(GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH)
    logger.info('got memory classification prompt')
  }

  if (!memoryAssistantPrompt) {
    logger.info('getting memory assistant prompt')
    memoryAssistantPrompt = await getPrompt(GITHUB_MEMORY_ASSISTANT_PROMPT_PATH)
    logger.info('got memory assistant prompt')
  }

  logger.info('getting index')
  const metadata = await getIndex()
  logger.info('got index')

  logger.info('getting classifier completion')
  const classifierCompletion = await GetChatCompletion({
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    temperature: 0,
    messages: [
      { role: 'system', content: memoryClassificationPrompt.prompt },
      { role: 'user', content: `Query: ${query}` },
      { role: 'system', content: `Metadata: ${JSON.stringify(metadata)}` },
    ],
  })

  const classifierCompletionContent =
    chatCompletionToFirstChoiceMessageContent(classifierCompletion)

  if (classifierCompletionContent) {
    logger.info('got classifier completion')
    // TODO: validate the response format
    const classification = JSON.parse(classifierCompletionContent)
    const keys = classification['keys']

    const memoriesAssets = await getMemoriesByKeys(keys)

    logger.info('getting assistant completion')
    const assistantCompletionResponse = await GetChatCompletion({
      model: OPENAI_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        { role: 'system', content: memoryAssistantPrompt.prompt },
        { role: 'user', content: `Query: ${query}` },
        { role: 'user', content: `Memories: ${JSON.stringify(memoriesAssets)}` },
      ],
    })

    const assistantCompletionContent = chatCompletionToFirstChoiceMessageContent(
      assistantCompletionResponse
    )

    if (assistantCompletionContent) {
      logger.info('got assistant completion')
      const assistantResponse = {
        ...JSON.parse(assistantCompletionContent),
        sources: keys,
      }
      logger.info('sending response')
      response.status(200).json({
        message: assistantResponse,
      })
    } else {
      logger.info('no assistant completion content')
      response.status(200).json({
        error: 'No message content found',
      })
    }
    return
  }

  logger.info('no classifier completion content')
  response.status(200).json({
    error: 'No message content found',
  })
}

export default handleRequest
