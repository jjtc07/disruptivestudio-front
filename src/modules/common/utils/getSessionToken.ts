export const ACCESS_TOKEN = 'accessToken'

export const getSessionToken = () =>
  sessionStorage.getItem(ACCESS_TOKEN) as string

export const getLocalStoreToken = () =>
  localStorage.getItem(ACCESS_TOKEN) as string
