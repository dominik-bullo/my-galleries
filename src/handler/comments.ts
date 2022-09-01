import { Router, Response, Request } from 'express'
import auth from '../middleware/auth'
import { Comment, CommentStore } from '../models/comment'

const comments: Router = Router()
const store: CommentStore = new CommentStore()

const create = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const comment: Omit<Comment, 'id' | 'timestamp'> = {
            user_id: req.body.authedUser,
            pic_id: req.params.picId as unknown as number,
            text: req.body.text,
        }
        const newComment = await store.create(comment)
        res.status(201).json(newComment)
    } catch (err) {
        res.sendStatus(400)
    }
}

const showByPicId = async (req: Request, res: Response) => {
    try {
        const comments: Comment[] = await store.showByPicId(
            req.params.picId as unknown as number
        )
        res.json(comments)
    } catch (err) {
        res.sendStatus(400)
    }
}

comments.use(auth).post('/:picId', create).get('/:picId', showByPicId)

export default comments
