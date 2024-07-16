import axios from 'axios'
import { GITHUB_TOKEN, GITHUB_USERNAME } from '../constants'

export const saveResource = async ({
  content,
  repoName,
  filePath,
  sha,
}: {
  content: string
  repoName: string
  filePath: string
  sha: string | undefined
}): Promise<any> => {
  const repoOwner = GITHUB_USERNAME
  const githubToken = GITHUB_TOKEN
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`

  try {
    const encodedContent = Buffer.from(content).toString('base64')

    const payload = {
      message: 'update bot conversation',
      content: encodedContent,
      branch: 'master',
      sha,
    }

    const response = await axios.put(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    console.log('File saved successfully:', response.data)
  } catch (error) {
    throw new Error(`Error saving file to GitHub: ${(error as Error).message}`)
  }
}
