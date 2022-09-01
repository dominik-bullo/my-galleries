import Client from '../database'

export interface Gallery {
    id: number
    title: string
    path: string
    date: string
    images: number[]
}

export class GalleryStore {
    async create(newGallery: Omit<Gallery, 'id' | 'images'>): Promise<Gallery> {
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

    async index(): Promise<Omit<Gallery, 'path'>[]> {
        try {
            const conn = await Client.connect()
            const sql =
                'SELECT G.id, title, date, ARRAY_AGG(P.id) AS images FROM galleries G LEFT JOIN pictures P ON G.id = P.gallery_id GROUP BY G.id ORDER BY date DESC'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get galleries: ${err}`)
        }
    }

    async show(id: number): Promise<Gallery> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT id, title, path, date FROM galleries WHERE id = $1'
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get gallery: ${err}`)
        }
    }
}
