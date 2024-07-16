import { GITHUB_REPO_DATA, GITHUB_REPO_PARKING_PATH } from '../constants'
import { decodeBase64 } from '../utils'
import { getResource } from './getResource'
import { saveResource } from './saveResource'

export const saveMessage = async (message: string) => {
  const resource = await getResource(
    GITHUB_REPO_DATA,
    GITHUB_REPO_PARKING_PATH,
    'application/vnd.github.object+json'
  )
  if (resource.encoding !== 'base64') {
    throw new Error('Unsupported encoding format')
  }
  const content = decodeBase64(resource.content)

  return await saveResource({
    content: `${content}\n${message}`,
    repoName: GITHUB_REPO_DATA,
    filePath: GITHUB_REPO_PARKING_PATH,
    sha: resource.sha,
  })
}
