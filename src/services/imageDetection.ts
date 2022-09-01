import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { Gallery, GalleryStore } from '../models/gallery'
import { Picture, PictureStore } from '../models/picture'

// image directory
const srcpath = path.resolve('./images')
// child directory for thumbnails
export const thumbpath = '/thumbs'

// get foldernames as async function
const getFoldernamesAsync = async (): Promise<string[]> => {
    try {
        const foldernames = await fs.promises.readdir(srcpath)
        return foldernames.filter((foldername) =>
            fs.statSync(path.join(srcpath, foldername)).isDirectory()
        )
    } catch (err) {
        throw new Error(`Cannot get foldernames: ${err}`)
    }
}

// check if string matches regex for date
const isDate = (str: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(str)

// create gallery objects from foldernames as async function
const getGalleriesAsync = async (): Promise<Omit<Gallery, 'id' | 'images'>[]> => {
    const foldernames = await getFoldernamesAsync()
    const galleries: Omit<Gallery, 'id' | 'images'>[] = []
    foldernames.forEach((foldername) => {
        const date = foldername.split(' ')[0]
        const title = foldername.split(' ').slice(1).join(' ')
        const gallery = {
            title: isDate(date) ? title : foldername,
            path: path.join(srcpath, foldername),
            date: isDate(date) ? date : '0',
        }
        galleries.push(gallery)
    })
    return galleries
}

// get filenames as async function
const getFilenamesAsync = async (dir: string): Promise<string[]> => {
    try {
        const filenames = await fs.promises.readdir(dir, { withFileTypes: true })
        return filenames
            .filter((file) => file.isFile())
            .map((file) => file.name)
            .sort()
    } catch (err) {
        throw new Error(`Cannot get filenames: ${err}`)
    }
}

export default class ImageDetection {
    public static async addGalleriesFromFs(): Promise<Gallery[]> {
        const galleries = await getGalleriesAsync()
        const galleryStore = new GalleryStore()
        const existingGalleries = await galleryStore.index()
        const createdGalleries: Gallery[] = []
        const newGalleries = galleries.filter((gallery) => {
            return !existingGalleries.some((existingGallery) => {
                return (
                    gallery.title === existingGallery.title &&
                    gallery.date === existingGallery.date
                )
            })
        })
        if (newGalleries.length > 0) {
            console.log(`Creating ${newGalleries.length} new galleries...`)
            for (const gallery of newGalleries) {
                const createdGallery = await galleryStore.create(gallery)
                createdGalleries.push(createdGallery)
            }
            for (const gallery of createdGalleries) {
                console.log(`Created gallery ${gallery.title}`)
                const filenames = await getFilenamesAsync(gallery.path)
                if (filenames.length > 0) {
                    console.log(`Adding ${filenames.length} pictures...`)
                    const newPictures: Omit<Picture, 'id' | 'path'>[] = []
                    const pictureStore = new PictureStore()
                    fs.access(path.join(gallery.path, thumbpath), (err) => {
                        if (err) {
                            fs.mkdirSync(path.join(gallery.path, thumbpath))
                        }
                    })
                    for (const filename of filenames) {
                        const picture = {
                            gallery_id: gallery.id,
                            filename: filename,
                        }
                        newPictures.push(picture)
                        try {
                            sharp(path.join(gallery.path, filename))
                                .resize({
                                    fit: sharp.fit.inside,
                                    width: 400,
                                    height: 400,
                                })
                                .toFile(path.join(gallery.path, thumbpath, filename))
                        } catch (err) {
                            console.log(`Cannot create thumbnail for ${filename}: ${err}`)
                        }
                    }
                    await pictureStore.createMany(newPictures)
                }
            }
            console.log('Galleries and Pictures have been imported to database.')
        }
        return createdGalleries
    }
}
