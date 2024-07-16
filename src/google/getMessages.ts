import { GOOGLE_SHEET_ID, GOOGLE_SHEET_RANGE } from '../constants'
import { authorize } from './auth'

export const getMessages = async () => {
  const sheet = await authorize()
  try {
    const messages = await sheet.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: GOOGLE_SHEET_RANGE,
    })
    return messages.data.values
  } catch (error) {
    console.error('Error appending message:', error)
  }
}
