export const decodeBase64 = (encodedValue: string): string => {
  return Buffer.from(encodedValue, 'base64').toString('utf-8')
}
