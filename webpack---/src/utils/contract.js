import striptags from 'striptags'
import {
    replaceLinks
} from '@/utils-ts/strings'

export function stripDescriptionTags(description) {
    description = trimDescription(description)
    description = striptags(description, ['h1', 'h2', 'h3', 'li', 'p', 'br'])
    description = striptags(description, ['br'], '<br>')
    description = description.replace(/(<br \/>|<br>){2,}/g, '<br>')
    description = description.replace(/\s{2,}/g, '')
    const firstBr = description.startsWith('<br>') ? 4 : 0
    const lastBr = description.endsWith('<br>') ? description.length - 4 : description.length
    description = description.substr(firstBr, lastBr - firstBr)
    return replaceLinks(description)
}

export function formatDescription(description = '') {
    const text = trimDescription(description)
    return replaceLinks(text)
}

function trimDescription(description) {
    return (description || '')
        // eslint-disable-next-line no-irregular-whitespace
        .replace(/<p>[(<br />|<br>)\\s&nbsp; ]{1,}<\/p>/g, '')
}