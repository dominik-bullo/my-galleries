import Client from '../database'

export interface Picture {
    id: number
    gallery_id: number
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

    async createMany(pictures: Omit<Picture, 'id'>[]): Promise<Picture[]> {
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

    async index(): Promise<Picture[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM pictures'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get pictures: ${err}`)
        }
    }
}
