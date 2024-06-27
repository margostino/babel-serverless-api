import { getData } from '../github'

export const getMemoriesByKeys = async (keys: string[]) => {
  const memoriesAssets = await Promise.all(
    keys.map(async (key: string) => {
      const data = await getData(key)
      return {
        path: key,
        content: data,
      }
    })
  )
  return memoriesAssets
}
