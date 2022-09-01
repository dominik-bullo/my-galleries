import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import ImageDetection from './services/imageDetection'
import galleriesRouter from './handler/galleries'
import usersRouter from './handler/users'
import commentsRouter from './handler/comments'
import picsRouter from './handler/pictures'
import logger from './middleware/logger'

dotenv.config()

const app: Application = express()

app.use(cors())
    .use(bodyParser.json())
    .use(logger)
    .use('/api/galleries', galleriesRouter)
    .use('/api/users', usersRouter)
    .use('/api/comments', commentsRouter)
    .use('/api/pictures', picsRouter)

ImageDetection.addGalleriesFromFs()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

export default app
