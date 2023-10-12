let tronWeb: any = null

export async function getTronWebInstanceAsync (): Promise<any> {
  if (!tronWeb) {
    // @ts-ignore
    let TronWeb = (await import(/* webpackChunkName: "tronweb" */ 'tronweb')).default
    tronWeb = new TronWeb({
      fullHost: process.env.VUE_APP_TRONWEB_PROVIDER,
    })
    tronWeb.setAddress('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t') // TODO TRX Replace and set correct
  }
  return tronWeb
}
