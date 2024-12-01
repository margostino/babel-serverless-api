import { logger } from '../logger'
import { getMemoriesByKeys } from '../memory'
import { ClassificationResponseCompletion, GetChatCompletion } from '../openai'
import { chatCompletionToFirstChoiceMessageContent } from '../utils'

export const handleChatCompletion = async ({
  query,
  memoryClassificationPrompt,
  memoryAssistantPrompt,
  messages,
  queryClassification,
}: {
  query: string | string[]
  memoryClassificationPrompt: string
  memoryAssistantPrompt: string
  messages: any[] | undefined
  queryClassification: ClassificationResponseCompletion
}) => {

  const keys = queryClassification.keys

  const memoriesAssets = await getMemoriesByKeys(keys)

  logger.info('getting assistant completion')
  const assistantCompletionResponse = await GetChatCompletion({
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
    logger.info('sending response')
    return {
      message: assistantCompletionContent,
    }
  } else {
    logger.info('no assistant completion content')
    return {
      error: 'No message content found',
    }
  }

}
