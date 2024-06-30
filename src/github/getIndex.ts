import axios from 'axios'
import {
  GITHUB_REPO_DATA,
  GITHUB_REPO_METADATA_INDEX_PATH,
  GITHUB_TOKEN,
  GITHUB_USERNAME,
} from '../constants'

export const getIndex = async () => {
  const repoOwner = GITHUB_USERNAME
  const repoName = GITHUB_REPO_DATA
  const filePath = GITHUB_REPO_METADATA_INDEX_PATH
  const githubToken = GITHUB_TOKEN
  return readJSONFromGitHub(repoOwner, repoName, filePath, githubToken)
}

const readJSONFromGitHub = async (
  repoOwner: string,
  repoName: string,
  filePath: string,
  githubToken: string
): Promise<any> => {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3.raw',
      },
    })

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error(`Error: Received status code ${response.status}`)
    }
  } catch (error) {
    throw new Error(`Failed to fetch file from GitHub: ${(error as Error).message}`)
  }
}
