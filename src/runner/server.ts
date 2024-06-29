import dotenv from 'dotenv'
dotenv.config()

import { VercelRequest, VercelResponse } from '@vercel/node'
import express from 'express'
import { HandleGateway } from '../../api/babel'
import { Hello } from '../../api/hello'
import { Ping } from '../../api/ping'

const app = express()

app.use(express.json()) // Add body parsing middleware if needed

const handlerWrapper = (handler: (req: VercelRequest, res: VercelResponse) => void) => {
  return (req: express.Request, res: express.Response) => {
    const vercelReq = req as VercelRequest
    const vercelRes = res as unknown as VercelResponse
    handler(vercelReq, vercelRes)
  }
}

app.get('/hello', handlerWrapper(Hello))
app.get('/ping', handlerWrapper(Ping))
app.get('/babel', handlerWrapper(HandleGateway))

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
