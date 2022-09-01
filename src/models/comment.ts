import Client from '../database'

export interface Comment {
    id: number
    user_id: number
    pic_id: number
    timestamp: string
    text: string
}

export class CommentStore {
    async create(newComment: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> {
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

    async showByPicId(pic_id: number): Promise<Comment[]> {
        try {
            const conn = await Client.connect()
            const sql =
                'SELECT id, user_id, pic_id, timestamp, text FROM comments WHERE pic_id = $1'
            const result = await conn.query(sql, [pic_id])
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get comments: ${err}`)
        }
    }
}
