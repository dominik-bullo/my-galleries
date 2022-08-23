import Client from '../database'

export interface Gallery {
    id: number
    title: string
    path: string
    date: string | null
}

export class GalleryStore {
    async create(newGallery: Omit<Gallery, 'id'>): Promise<Gallery> {
        try {
            const conn = await Client.connect()
            const sql =
                'INSERT INTO galleries (title, path, date) VALUES ($1, $2, $3) RETURNING *'
            const result = await conn.query(sql, [
                newGallery.title,
                newGallery.path,
                newGallery.date,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create gallery: ${err}`)
        }
    }
    async index(): Promise<Gallery[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM galleries'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get galleries: ${err}`)
        }
    }
}
