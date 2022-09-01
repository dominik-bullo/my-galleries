import { Router, Response, Request } from 'express'
import { Gallery, GalleryStore } from '../models/gallery'
import auth from '../middleware/auth'

const galleries: Router = Router()
const store: GalleryStore = new GalleryStore()

const index = async (req: Request, res: Response) => {
    try {
        const galleries: Omit<Gallery, 'path'>[] = await store.index()
        res.json(galleries)
    } catch (err) {
        res.sendStatus(400)
    }
}

galleries.use(auth).get('/', index)

export default galleries
