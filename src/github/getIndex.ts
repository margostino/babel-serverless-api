import { GITHUB_REPO_DATA, GITHUB_REPO_METADATA_INDEX_PATH } from '../constants'
import { getResource } from './getResource'

export const getIndex = async () => {
  return await getResource(GITHUB_REPO_DATA, GITHUB_REPO_METADATA_INDEX_PATH)
}
