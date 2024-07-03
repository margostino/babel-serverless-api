import { GITHUB_REPO_DATA } from '../constants'
import { getResource } from './getResource'

export const getData = async (filePath: string) => {
  return await getResource(GITHUB_REPO_DATA, filePath)
}
