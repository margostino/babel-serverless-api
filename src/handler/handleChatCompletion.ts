import { OPENAI_MODEL } from '../constants'
import { getIndex } from '../github'
import { logger } from '../logger'
import { getMemoriesByKeys } from '../memory'
import { GetChatCompletion } from '../openai'
import { chatCompletionToFirstChoiceMessageContent } from '../utils'

export const handleChatCompletion = async ({
  query,
  memoryClassificationPrompt,
  memoryAssistantPrompt,
}: {
  query: string | string[]
  memoryClassificationPrompt: string
  memoryAssistantPrompt: string
}) => {
  logger.info('getting index')
  const metadata = await getIndex()
  logger.info('got index')

  logger.info('getting classifier completion')
  const classifierCompletion = await GetChatCompletion({
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    temperature: 0,
    messages: [
      { role: 'system', content: memoryClassificationPrompt },
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
        { role: 'system', content: memoryAssistantPrompt },
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
      return {
        message: assistantResponse,
      }
    } else {
      logger.info('no assistant completion content')
      return {
        error: 'No message content found',
      }
    }
  }

  logger.info('no classifier completion content')
  return {
    error: 'No completion content found',
  }
}
