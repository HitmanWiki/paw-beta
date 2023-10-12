import maxBy from 'lodash/maxBy'
import Image from '@/models/Image'
import {
    CAT_IMG_ORIGINAL,
    CAT_IMG_RESIZED
} from '@/constants/file'
import {
    parseJson
} from '@/utils/parser'
import {
    replaceUploadUrl
} from '@/utils/file'

class Avatar extends Image {
    static fromServer(data) {
        if (data ? .length) {
            const images = data
                .filter(file => file.category === CAT_IMG_RESIZED)
                .map(file => {
                    const width = parseJson(file.meta).width
                    return width ? {
                        src: file.url,
                        width
                    } : null
                })
                .filter(Boolean)
            const maxImage = maxBy(images, 'width')
            const srcSet = images
                .map(file => `${replaceUploadUrl(file.src)} ${file.width}w`)
                .join(', ')
            return new Avatar({
                src: replaceUploadUrl(maxImage ? .src || data.find(file => file.category === CAT_IMG_ORIGINAL) ? .url),
                srcSet: srcSet || undefined,
            })
        }
        return new Avatar()
    }

    getMaxAvatar(userId) {
        return this.src || `${process.env.VUE_APP_FRONTEND_URL}/static/images/avatars/user-${(userId || 0) % 6}-360.png`
    }
}

export default Avatar