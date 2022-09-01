import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const auth = (req: Request, res: Response, next: NextFunction): void => {
    let token = req.header('Authorization')
    if (!token || !token.startsWith('Bearer ')) {
        res.sendStatus(401)
    } else {
        try {
            token = token.split(' ')[1]
            const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
                id: number
            }
            req.body.authedUser = id
            console.log('authed user:', id)
            next()
        } catch (err) {
            res.sendStatus(401)
        }
    }
}

export default auth
