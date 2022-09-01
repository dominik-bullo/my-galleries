import { Router, Request, Response } from 'express'
import { Picture, PictureStore } from '../models/picture'
import auth from '../middleware/auth'
import path from 'path'
import { thumbpath } from '../services/imageDetection'

const pictures: Router = Router()
const store: PictureStore = new PictureStore()

const show = async (req: Request, res: Response) => {
    try {
        const picture: Picture = await store.show(req.params.id as unknown as number)
        res.sendFile(path.join(picture.path, picture.filename))
    } catch (err) {
        res.sendStatus(400)
    }
}

const showThumb = async (req: Request, res: Response) => {
    try {
        const picture: Picture = await store.show(req.params.id as unknown as number)
        res.sendFile(path.join(picture.path, thumbpath, picture.filename))
    } catch (err) {
        res.sendStatus(400)
    }
}

pictures.use(auth).get('/:id', show).get('/:id/thumb', showThumb)

export default pictures
