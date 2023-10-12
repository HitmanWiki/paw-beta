/**
 * Extracts slug without id from backend slug
 * @param {String} slug slug from backend
 * @returns {String}
 */
export function parseSlug (slug: string | null = ''): string {
  try {
    const parsed = slug?.match(/^(.*)(-\d*$)/)
    return parsed && parsed.length > 1
      ? parsed[1]
      : ''
  } catch (e) {
    return ''
  }
}
