import axios from 'axios'
import { GITHUB_TOKEN, GITHUB_USERNAME } from '../constants'

export const getResource = async (repoName: string, filePath: string): Promise<any> => {
  const repoOwner = GITHUB_USERNAME
  const githubToken = GITHUB_TOKEN
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
      throw new Error(`Error: Received status code ${response.status} for ${filePath}`)
    }
  } catch (error) {
    throw new Error(`Failed to fetch file from GitHub (${filePath}): ${(error as Error).message}`)
  }
}
