import { Channel } from '@/constants-ts/user/channels'
import { Roles } from '@/constants-ts/user/roles'
import Autolinker from 'autolinker'
import striptags from 'striptags'

export function stripDescriptionTags (description?: string | null, { stripLinks = false } = {}) {
  description = trimDescription(description)
  description = striptags(description, ['h1', 'h2', 'h3', 'li', 'p', 'br'])
  description = striptags(description, ['br'], '<br>')
  description = description.replace(/(<br \/>|<br>){2,}/g, '<br>')
  description = description.replace(/\s{2,}/g, '')
  const firstBr = description.startsWith('<br>') ? 4 : 0
  const lastBr = description.endsWith('<br>') ? description.length - 4 : description.length
  description = description.substr(firstBr, lastBr - firstBr)
  return stripLinks ? description : replaceLinks(description)
}

export function replaceLinks (text: string, classes = 'lx-new-link') {
  return Autolinker.link(text, {
    newWindow: true,
    className: 'auto-link',
    stripPrefix: false,
    replaceFn: function (match) {
      let tag = match.buildTag()
      tag.addClass(classes)
      tag.setAttr('rel', 'nofollow noopener')
      return tag
    }
  })
}

export function stripWithLinks (text: string) {
  const strips = striptags(text)
  return replaceLinks(strips, 'lx-new-link')
}

export function getSocialLink (channel: Channel, nick?: string) {
  if (nick) {
    let domain = getSocialDomain(channel)
    if (nick.startsWith('@')) {
      return `${domain}${nick.substr(1)}`
    }
    if (nick.startsWith('https://')) {
      return nick
    }
    return `${domain}${nick}`
  }
  return nick
}

function getSocialDomain (channel: Channel) {
  switch (channel) {
    case Channel.LinkedIn: return 'https://www.linkedin.com/company/'
    case Channel.Twitter: return 'https://twitter.com/'
    case Channel.Facebook: return '//'
    case Channel.Github: return 'https://github.com/'
    default: return '//'
  }
}

/**
 * Returns url for OAuth login or registrations
 * @param {String} social authclient query param
 */
export function getOAuthLink (social: string, profileType: Roles = Roles.FREELANCER, viaLogin: boolean = true) {
  if (process.client) {
    const domain = `${window.location.protocol}//${window.location.host}`
    const role = profileType ? `&profileType=${profileType}` : ''
    const module = viaLogin ? 1 : 0
    // eslint-disable-next-line max-len
    return `${process.env.VUE_APP_BACKEND_CLIENT_URL}oauth/connect?authclient=${social}&module=${module}&successRegisterUrl=${domain}&successAuthUrl=${domain}/auth/social&failureUrl=${domain}&faUrl=${domain}/&tokenMode=url${role}`
  }
}

export function humanizeBytes (bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Detect search crawler bots
 * @param userAgent
 * @returns {Boolean}
 */
export function isCrawler (userAgent?: Navigator['userAgent']) {
  // eslint-disable-next-line max-len
  const bots = /google|bot|crawl|spider|slurp|baidu|bing|msn|teoma|yandex|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|biglotron|convera|gigablast|archive|webmon|httrack|grub|netresearchserver|speedy|fluffy|bibnum|findlink|panscient|IOI|ips-agent|yanga|Voyager|CyberPatrol|postrank|page2rss|linkdex|ezooms|heritrix|findthatfile|Aboundex|summify|ec2linkfinder|facebook|slack|instagram|pinterest|reddit|twitter|whatsapp|yeti|RetrevoPageAnalyzer|sogou|wotbox|ichiro|drupact|coccoc|integromedb|siteexplorer|proximic|changedetection|WeSEE|scrape|scaper|g00g1e|binlar|indexer|MegaIndex|ltx71|BUbiNG|Qwantify|lipperhey|y!j-asr|AddThis/i
  return bots.test(userAgent || '')
}

function trimDescription (description?: string | null) {
  return (description || '')
    // eslint-disable-next-line no-irregular-whitespace
    .replace(/<p>[(<br />|<br>)\\s&nbsp; ]{1,}<\/p>/g, '')
}
