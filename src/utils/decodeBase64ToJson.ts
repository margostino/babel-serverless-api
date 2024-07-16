export const decodeBase64ToJson = (encodedValue: string) => {
  try {
    const jsonString = Buffer.from(encodedValue, 'base64').toString('utf8')
    const jsonData = JSON.parse(jsonString)
    return jsonData
  } catch (error) {
    throw new Error(`Error decoding Base64 string: ${(error as Error).message}`)
  }
}
