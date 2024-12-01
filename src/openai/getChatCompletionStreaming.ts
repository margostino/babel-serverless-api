import OpenAI from 'openai'
import { OPENAI_API_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL } from '../constants'

const openAiClient = new OpenAI({
  baseURL: OPENAI_API_BASE_URL,
  apiKey: OPENAI_API_KEY,
  maxRetries: 4,
})

export const GetChatCompletionStreaming = async (
  body: Omit<OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming, 'stream' | 'model'>,
  options?: OpenAI.RequestOptions
) => {
  const streamingBody = { ...body, stream: true, temperature: 0, model: OPENAI_MODEL }
  const completionResponse = await openAiClient.chat.completions.create(streamingBody, options)
  return completionResponse
}
