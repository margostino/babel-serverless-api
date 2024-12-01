import { zodResponseFormat } from 'openai/helpers/zod'
import { getIndex } from '../github'
import { logger } from '../logger'
import { ClassificationResponseCompletion, ClassificationResponseCompletionSchema, GetChatCompletion } from '../openai'
import { chatCompletionToFirstChoiceMessageContent, zodParse } from '../utils'

export const handleClassificationChatCompletion = async ({
  query,
  memoryClassificationPrompt,
  messages,
}: {
  query: string | string[]
  memoryClassificationPrompt: string
  messages: any[] | undefined
}): Promise<ClassificationResponseCompletion | null> => {
  logger.info('getting index')
  const metadata = await getIndex()
  logger.info('got index')

  logger.info('getting classifier completion')
  const classifierCompletion = await GetChatCompletion({
    response_format: zodResponseFormat(
      ClassificationResponseCompletionSchema,
      'classificationResponse'
    ),
    messages: [
      { role: 'system', content: memoryClassificationPrompt },
      { role: 'user', content: `Query: ${query}` },
      { role: 'user', content: `Chat History: ${JSON.stringify(messages)}` },
      { role: 'system', content: `Metadata: ${JSON.stringify(metadata)}` },
    ],
  })

  const classification = classifierCompletion ? zodParse(
    ClassificationResponseCompletionSchema,
    JSON.parse(chatCompletionToFirstChoiceMessageContent(classifierCompletion) || '')
  ) : null

  return classification
}
