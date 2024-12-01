import OpenAI from 'openai'
import { OPENAI_API_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL } from '../constants'

const openAiClient = new OpenAI({
  baseURL: OPENAI_API_BASE_URL,
  apiKey: OPENAI_API_KEY,
  maxRetries: 4,
})

const defaultChatCompletionBody = {
  temperature: 0,
}

export const GetChatCompletion = async (
  body: Omit<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming, 'model'>,
  options?: OpenAI.RequestOptions
) => {
  body.temperature = 0
  const nonStreamingBody = { ...body, model: OPENAI_MODEL }
  const completionResponse = await openAiClient.chat.completions.create(
    { ...defaultChatCompletionBody, ...nonStreamingBody },
    options
  )
  return completionResponse
}
