import Client from '../database'

export interface Comment {
    id: number
    user_id: number
    pic_id: number
    timestamp: string
    text: string
}

export class CommentStore {
    async create(newComment: Omit<Comment, 'id'>): Promise<Comment> {
        try {
            const conn = await Client.connect()
            const sql =
                'INSERT INTO comments (pic_id, user_id, text) VALUES ($1, $2, $3) RETURNING *'
            const result = await conn.query(sql, [
                newComment.pic_id,
                newComment.user_id,
                newComment.text,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create comment: ${err}`)
        }
    }

    async index(): Promise<Comment[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM comments'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get comments: ${err}`)
        }
    }
}
