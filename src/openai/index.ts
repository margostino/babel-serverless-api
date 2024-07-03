import OpenAI from 'openai'
import { OPENAI_API_BASE_URL, OPENAI_API_KEY } from '../constants'

const openAiClient = new OpenAI({
  baseURL: OPENAI_API_BASE_URL,
  apiKey: OPENAI_API_KEY,
  maxRetries: 4,
})

const defaultChatCompletionBody = {
  temperature: 0,
}

export const GetChatCompletion = async (
  body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  options?: OpenAI.RequestOptions<unknown> | undefined
) => {
  const completionResponse = await openAiClient.chat.completions.create(
    { ...defaultChatCompletionBody, ...body },
    options
  )
  return completionResponse
}
