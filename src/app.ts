import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import ImageDetection from './services/imageDetection'

dotenv.config()

const app: Application = express()

app.use(cors()).use(bodyParser.json())

ImageDetection.addGalleriesFromFs()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

export default app
