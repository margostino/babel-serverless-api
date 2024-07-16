import { GITHUB_REPO_CONVERSATION_PATH, GITHUB_REPO_DATA } from '../constants'
import { getResource } from './getResource'

export const getConversation = async () => {
  return await getResource(GITHUB_REPO_DATA, GITHUB_REPO_CONVERSATION_PATH)
}
