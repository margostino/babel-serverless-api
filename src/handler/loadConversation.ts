import { getConversation } from '../github'
import { logger } from '../logger'

export const loadConversation = async () => {
  logger.info('getting latest conversation')
  const conversation = await getConversation()
  return conversation
}
