import { VercelRequest, VercelResponse } from '@vercel/node'
import { isAdmin, isAuthorized } from '../src/auth'
import {
  GITHUB_MEMORY_ASSISTANT_PROMPT_PATH,
  GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH,
  OPENAI_MODEL,
} from '../src/constant'
import { getIndex, getPrompt } from '../src/github'
import { getMemoriesByKeys } from '../src/memories'
import { ChatCompletion } from '../src/openai'
import { chatCompletionToFirstChoiceMessageContent } from '../src/utils/chatCompletionToFirstChoiceMessageContent'

let memoryClassificationPrompt: { prompt: string }
let memoryAssistantPrompt: { prompt: string }

export const HandleGateway = async (request: VercelRequest, response: VercelResponse) => {
  if (!(isAdmin(request) && isAuthorized(request))) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const { query } = request.query

  if (!memoryClassificationPrompt) {
    memoryClassificationPrompt = await getPrompt(GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH)
  }

  if (!memoryAssistantPrompt) {
    memoryAssistantPrompt = await getPrompt(GITHUB_MEMORY_ASSISTANT_PROMPT_PATH)
  }

  const metadata = await getIndex()

  const classifierCompletion = await ChatCompletion({
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
    // TODO: validate the response format
    const classification = JSON.parse(classifierCompletionContent)
    const keys = classification['keys']

    const memoriesAssets = await getMemoriesByKeys(keys)

    const assistantCompletionResponse = await ChatCompletion({
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
      const assistantResponse = {
        ...JSON.parse(assistantCompletionContent),
        sources: keys,
      }

      response.status(200).json({
        message: assistantResponse,
      })
    } else {
      response.status(200).json({
        error: 'No message content found',
      })
    }
    return
  }

  response.status(200).json({
    error: 'No message content found',
  })
}

export default HandleGateway
