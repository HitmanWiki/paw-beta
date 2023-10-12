import AbstractLazyAnalyticsService from './AbstractLazyAnalyticsService'

// eslint-disable-next-line max-len
const LINTRK_SCRIPT = `_linkedin_partner_id = "3694508";window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l) {if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s = document.getElementsByTagName("script")[0];var b = document.createElement("script");b.type = "text/javascript";b.async = true;b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b, s);})(window.lintrk);`

class LinkedInAnalytics extends AbstractLazyAnalyticsService {
  async getClient () {
    if (this.loading) {
      if (!this.client) {
        await this.loadScript(LINTRK_SCRIPT)
        if (window.hasOwnProperty('lintrk')) {
          this.client = window.lintrk
        }
      }
      return this.client
    }
  }
  async send (event: string | number) {
    try {
      if (this.isAvailable()) {
        if (!this.client) {
          this.postponeQuery(() => {
            window.lintrk('track', { conversion_id: event })
          })
          await this.getClient()
        } else {
          window.lintrk('track', { conversion_id: event })
        }
      }
    } catch (e) {
      console.error('Error sending event %s to LinkedIn', event, e)
    }
  }

  sendSuccessRegistration () {
    this.send(6144396)
  }

  sendJobPublished () {
    this.send(6144404)
  }
}

export default new LinkedInAnalytics()
