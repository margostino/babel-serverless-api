import { ENV } from '../constants'

export const isDev = () => {
  return ENV == 'development'
}
