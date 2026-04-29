async function getToast() {
  const module = await import('react-toastify')
  return module.toast
}

export async function notifySuccess(message: string) {
  const toast = await getToast()
  toast.success(message)
}

export async function notifyError(message: string) {
  const toast = await getToast()
  toast.error(message)
}
