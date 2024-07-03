import { getData } from '../github'
import { logger } from '../logger'

export const getMemoriesByKeys = async (keys: string[]) => {
  const memoriesAssets = await Promise.all(
    keys.map(async (key: string) => {
      try {
        const data = await getData(key)
        return {
          path: key,
          content: data,
        }
      } catch (error) {
        logger.error(`Failed to get memory by key: ${key}`)
        return {
          path: key,
          content: null,
        }
      }
    })
  )
  return memoriesAssets
}
