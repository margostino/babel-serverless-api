import { VercelRequest } from '@vercel/node'
import { IncomingHttpHeaders } from 'http'
import { MINIMAL_HEADERS, REQUIRED_HEADERS } from '../constants'

const validateHeaders = (headers: IncomingHttpHeaders) => {
  const requiredHeadersMap: Record<string, string> = {}

  REQUIRED_HEADERS.forEach((header) => {
    const [key, value] = header.split(':').map((h) => h.trim())
    requiredHeadersMap[key] = value
  })

  const minimalHeadersValid = MINIMAL_HEADERS.every((header) => headers.hasOwnProperty(header))

  const requiredHeadersValid = Object.entries(requiredHeadersMap).every(
    ([key, value]) => headers[key] === value
  )

  return minimalHeadersValid && requiredHeadersValid
}

export const isValidRequest = (req: VercelRequest) => {
  return validateHeaders(req.headers)
}
