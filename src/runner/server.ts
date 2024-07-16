import dotenv from 'dotenv'
dotenv.config()

import { VercelRequest, VercelResponse } from '@vercel/node'
import express from 'express'
import { handleRequest } from '../../api/completion'
import { hello } from '../../api/hello'
import { ping } from '../../api/ping'
import { PORT_DEV_SERVER } from '../constants'

const app = express()

app.use(express.json()) // Add body parsing middleware if needed

const handlerWrapper = (handler: (req: VercelRequest, res: VercelResponse) => void) => {
  return (req: express.Request, res: express.Response) => {
    const vercelReq = req as VercelRequest
    const vercelRes = res as unknown as VercelResponse
    handler(vercelReq, vercelRes)
  }
}

app.get('/hello', handlerWrapper(hello))
app.get('/ping', handlerWrapper(ping))
app.get('/index', handlerWrapper(handleRequest))

app.listen(PORT_DEV_SERVER, () => {
  console.log(`Server is running on http://localhost:${PORT_DEV_SERVER}`)
})
