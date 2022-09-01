import { Router, Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const users: Router = Router()
const store: UserStore = new UserStore()

const create = async (req: Request, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const user: Omit<User, 'id'> = {
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            hash: await bcrypt.hash(req.body.password, salt),
        }
        const newUser = await store.create(user)
        res.status(201).json(newUser)
    } catch (err) {
        res.sendStatus(400)
    }
}

const auth = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const user = await store.showByUsername(username)
        if (user && (await bcrypt.compare(password, user.hash))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)
            res.json({ token })
        } else {
            res.sendStatus(401)
        }
    } catch (err) {
        res.sendStatus(400)
    }
}

users.post('/', create).post('/auth', auth)

export default users
