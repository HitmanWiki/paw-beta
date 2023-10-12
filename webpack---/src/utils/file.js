import Deferred from 'promise-deferred'
import Image from '@/models/Image'
import {
    openSnackbar
} from '@/utils-ts/snackbars'
import {
    SnackTypes
} from '@/constants-ts/SnackTypes'

const TRUST_IMAGE_EXT = ['gif', 'jpg', 'jpeg', 'png']

const getMimetype = (signature) => {
    switch (signature) {
        case '89504E47':
            return 'image/png'
        case '47494638':
            return 'image/gif'
        case '25504446':
            return 'application/pdf'
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1':
            return 'image/jpeg'
        case '504B0304':
            return 'application/zip'
    }
}

/**
 * Reading a user uploaded file
 * @param {Blob} file
 * @returns {{ base64: String, mimeType: String }}
 */
export async function readFile(file) {
    const reader = new FileReader()
    const readerHex = new FileReader()
    const deferred = new Deferred()
    const deferredHex = new Deferred()
    reader.onload = function() {
        deferred.resolve(reader.result)
    }
    reader.onerror = function(error) {
        deferred.reject(error)
    }

    readerHex.onload = function() {
        let bytes = []
        const uint = new Uint8Array(readerHex.result)
        uint.forEach((byte) => {
            bytes.push(byte.toString(16))
        })
        const hex = bytes.join('').toUpperCase()
        deferredHex.resolve(getMimetype(hex))
    }

    reader.readAsDataURL(file)
    readerHex.readAsArrayBuffer(file.slice(0, 4))
    const [base64, mimeType] = await Promise.all([deferred.promise, deferredHex.promise])
    return {
        base64,
        mimeType
    }
}

export const getUrl = (file) => {
    const UPLOAD_URL = process.env.VUE_APP_UPLOAD_URL
    const isDev = process.env.VUE_APP_MODE === 'dev'
    const path = isDev ? file.path : file.path.replace('/uploads', '')
    return (UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL) + path + file.filename
}

// ToDo: it will be removed in next release
export function replaceUploadUrl(url) {
    // const isDev = process.env.VUE_APP_MODE === 'dev'
    // if (isDev) {
    //   return url
    // }
    const trimUrl = url => url.endsWith('/') ? url.slice(0, -1) : url
    const OLD_URL = trimUrl(process.env.VUE_APP_BACKEND_CLIENT_URL) + '/uploads'
    const NEW_URL = trimUrl(process.env.VUE_APP_UPLOAD_URL)
    return url.startsWith(OLD_URL) ? url.replace(OLD_URL, NEW_URL) : url
}

/**
 * Returns icon name by file extenstion
 * @param {File} file with ext field
 * @returns {String} icon
 */
export const getIcon = (file = {}) => {
    switch (file.ext) {
        case 'jpeg':
        case 'png':
        case 'svg':
            return {
                name: 'file-image',
                size: '16'
            }
        case 'html':
            return {
                name: 'file-html',
                size: '16,20'
            }
        case 'gzip':
        case 'rar':
        case 'tar':
        case 'tgz':
        case 'zip':
            return {
                name: 'file-zip',
                size: '19,16'
            }
        default:
            return {
                name: 'file-doc',
                size: '16,20'
            }
    }
}

export function isImage(file) {
    if (file instanceof Image) {
        return true
    }
    if (file.ext) {
        return TRUST_IMAGE_EXT.includes(file.ext)
    }
    if (file.mimeType) {
        return file.mimeType.startsWith('image/')
    }
    if (typeof file.type === 'string') {
        return file.type.startsWith('image/')
    }
    // if (file.base64) {
    //   return file.base64.startsWith('data:image')
    // }
}

/**
 * Reading a user uploaded file with image format checking
 * @throws {Error} if file failed verification. Open snackbar with error
 * @param {Blob} file
 * @returns {{ base64: String, mimeType: String }}
 */
export async function readImage(file, accept) {
    const fileData = await readFile(file)
    if (!isImage(fileData)) {
        const text = accept ?
            `Invalid file format. Please upload in ${accept}` :
            'Invalid file format. Only images allowed'
        openSnackbar({
            type: SnackTypes.FAILURE,
            title: 'Error',
            text,
        })
        throw new Error('Invalid file type. Only images allowed')
    }
    return fileData
}

/**
 * Load remote image and convert to base64
 * @param {String} url HTTP url to image
 * @returns {String} image in base64 format
 */
export async function loadRemoteImage(url) {
    const response = await fetch(url)
    const imageBlob = await response.blob()
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(imageBlob)
    })
}