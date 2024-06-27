import { ChatCompletion } from 'openai/resources'

export const chatCompletionToFirstChoiceMessageContent = (
  chatCompletion: ChatCompletion
): string | null => {
  return chatCompletion.choices[0].message.content
}
