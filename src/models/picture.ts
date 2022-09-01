import Client from '../database'

export interface Picture {
    id: number
    gallery_id: number
    path: string
    filename: string
}

export class PictureStore {
    async create(newPicture: Omit<Picture, 'id'>): Promise<Picture> {
        try {
            const conn = await Client.connect()
            const sql =
                'INSERT INTO pictures (gallery_id, filename) VALUES ($1, $2) RETURNING *'
            const result = await conn.query(sql, [
                newPicture.gallery_id,
                newPicture.filename,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create picture: ${err}`)
        }
    }

    async createMany(pictures: Omit<Picture, 'id' | 'path'>[]): Promise<Picture[]> {
        try {
            const conn = await Client.connect()
            const sql = `INSERT INTO pictures (gallery_id, filename) VALUES ${pictures
                .map((picture) => `(${picture.gallery_id}, '${picture.filename}')`)
                .join(', ')} RETURNING *`
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot create pictures: ${err}`)
        }
    }

    async show(id: number): Promise<Picture> {
        try {
            const conn = await Client.connect()
            const sql =
                'SELECT P.id, gallery_id, path, filename FROM pictures P LEFT JOIN galleries G ON P.gallery_id = G.id WHERE P.id = $1'
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get picture: ${err}`)
        }
    }
}
