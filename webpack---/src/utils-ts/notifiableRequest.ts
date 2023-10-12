import uniqueId from 'lodash/uniqueId'
import { SnackTypes } from '@/constants-ts/SnackTypes'
import { closeSnackbar, openSnackbar } from '@/utils-ts/snackbars'

/**
 * Execute request with opening snackbar
 * @param {Function<Promise<any>} request executed function
 * @param {String} title snackbar title
 * @param {String} successText snackbar text on success request
 * @param {String | Function} failureText snackbar text on fail request
 * @returns result of requestFn
 */
async function notifiableRequest (
  { request, title, loadingText, successText, failureText }:
  { request: () => Promise<any>, title?: string, loadingText?: string, successText: string, failureText: string | ((e: any) => string) }) {
  let loadingSnackId = uniqueId('snack_')
  try {
    if (loadingText) {
      openSnackbar({
        id: loadingSnackId,
        type: SnackTypes.LOADING,
        text: loadingText,
        title,
      })
    }
    const response = await request()
    openSnackbar({
      type: SnackTypes.SUCCESS,
      text: successText,
      title,
    })
    return response
  } catch (e) {
    openSnackbar({
      type: SnackTypes.FAILURE,
      text: typeof failureText === 'function' ? failureText(e) : failureText,
      title,
    })
    throw e
  } finally {
    if (loadingText) {
      closeSnackbar(loadingSnackId)
    }
  }
}

export default notifiableRequest
