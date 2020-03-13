import { BvToast } from 'bootstrap-vue'

export const toastError = (toaster: BvToast, message: string, title: string) => {
  toaster.toast(message, {
    title: title,
    autoHideDelay: 2000,
    variant: 'danger',
    toaster: 'b-toaster-bottom-center',
    append: true,
  })
  console.error(`[${title}] ${message}`)
}
export const toastSuccess = (toaster: BvToast, message: string, title: string) => {
  toaster.toast(message, {
    title: title,
    autoHideDelay: 2000,
    variant: 'success',
    toaster: 'b-toaster-bottom-center',
    append: true,
  })
  console.log(`[${title}] ${message}`)
}