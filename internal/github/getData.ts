import axios from 'axios'
import { GITHUB_REPO_DATA, GITHUB_TOKEN, GITHUB_USERNAME } from '../constant'

export const getData = async (filePath: string) => {
  const repoOwner = GITHUB_USERNAME
  const repoName = GITHUB_REPO_DATA
  const githubToken = GITHUB_TOKEN
  return readRawFromGitHub(repoOwner, repoName, filePath, githubToken)
}

const readRawFromGitHub = async (
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
    throw new Error(`Failed to fetch file from GitHub: ${(error as Error).message} (${apiUrl})`)
  }
}
