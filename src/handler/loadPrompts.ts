import {
    GITHUB_MEMORY_ASSISTANT_PROMPT_PATH,
    GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH,
} from '../constants'
import { getPrompt } from '../github'
import { logger } from '../logger'

export const loadPrompts = async () => {
  logger.info('getting memory classification and memory assistant prompts')
  const memoryClassificationPrompt = await getPrompt(GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH)
  const memoryAssistantPrompt = await getPrompt(GITHUB_MEMORY_ASSISTANT_PROMPT_PATH)
  return {
    memoryClassificationPrompt: memoryClassificationPrompt.prompt,
    memoryAssistantPrompt: memoryAssistantPrompt.prompt,
  }
}
