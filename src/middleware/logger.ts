import { Request, Response, NextFunction } from 'express'

const logger = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    console.log(req.body)
    next()
}

export default logger
