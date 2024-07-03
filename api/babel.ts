import { VercelRequest, VercelResponse } from '@vercel/node'
import { shouldHandleRequest } from '../src/auth'
import {
  GITHUB_MEMORY_ASSISTANT_PROMPT_PATH,
  GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH,
  OPENAI_MODEL,
} from '../src/constants'
import { getIndex, getPrompt } from '../src/github'
import { getMemoriesByKeys } from '../src/memories'
import { ChatCompletion } from '../src/openai'
import { chatCompletionToFirstChoiceMessageContent } from '../src/utils/chatCompletionToFirstChoiceMessageContent'

let memoryClassificationPrompt: { prompt: string }
let memoryAssistantPrompt: { prompt: string }

export const HandleGateway = async (request: VercelRequest, response: VercelResponse) => {
  if (!shouldHandleRequest(request)) {
    response.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const { query } = request.query

  console.log(`new request: ${query}`)

  if (!memoryClassificationPrompt) {
    console.log('getting memory classification prompt')
    memoryClassificationPrompt = await getPrompt(GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH)
    console.log('got memory classification prompt')
  }

  if (!memoryAssistantPrompt) {
    console.log('getting memory assistant prompt')
    memoryAssistantPrompt = await getPrompt(GITHUB_MEMORY_ASSISTANT_PROMPT_PATH)
    console.log('got memory assistant prompt')
  }

  console.log('getting index')
  const metadata = await getIndex()
  console.log('got index')

  console.log('getting classifier completion')
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
    console.log('got classifier completion')
    // TODO: validate the response format
    const classification = JSON.parse(classifierCompletionContent)
    const keys = classification['keys']

    const memoriesAssets = await getMemoriesByKeys(keys)

    console.log('getting assistant completion')
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
      console.log('got assistant completion')
      const assistantResponse = {
        ...JSON.parse(assistantCompletionContent),
        sources: keys,
      }

      response.status(200).json({
        message: assistantResponse,
      })
    } else {
      console.log('no assistant completion content')
      response.status(200).json({
        error: 'No message content found',
      })
    }
    return
  }

  console.log('no classifier completion content')
  response.status(200).json({
    error: 'No message content found',
  })
}

export default HandleGateway
