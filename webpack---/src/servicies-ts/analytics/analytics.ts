(function (domain: string) {
  function getRandomString (n = 64) {
    var arr = new Uint8Array(n / 2)
    // @ts-ignore
    const crypto = window.crypto || window.msCrypto
    function dec2hex (dec: number) {
      return dec.toString(16).padStart(2, '0')
    }
    crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
  }
  if (process.client) {
    const session_id = getRandomString(16)
    const client: LxAnalytics = function (event: string, eventParams?: any) {
      fetch(domain + 'actions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          payload: {
            event,
            session_id,
            user_id: client.user_id,
            role_id: client.role_id,
            path: window.location.pathname,
            eventParams,
          }
        })
      })
    }
    client.setGASession = function ({ cId, sId, token }) {
      fetch(domain + 'ga/update', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          payload: {
            client_id: cId,
            session_id: sId,
          }
        })
      })
    }
    window['lxAnalytics'] = client
    client('init')
  }
})(process.env.VUE_APP_ANALYTICS_URL!)
