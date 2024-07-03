import yaml from 'js-yaml'
import { GITHUB_REPO_PROMPTS } from '../constants'
import { getResource } from './getResource'

export const getPrompt = async (filePath: string) => {
  const response = await getResource(GITHUB_REPO_PROMPTS, filePath)
  return yaml.load(response) as { prompt: string }
}
