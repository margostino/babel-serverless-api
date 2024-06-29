import yaml from 'js-yaml'
import { GITHUB_REPO_PROMPTS } from '../constant'
import { getResource } from './getResource'

export const getPrompt = async (filePath: string) => {
  const repoName = GITHUB_REPO_PROMPTS
  const response = await getResource(repoName, filePath)
  return yaml.load(response) as { prompt: string }
}
