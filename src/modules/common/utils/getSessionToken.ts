export const ACCESS_TOKEN = 'accessToken'
export const AUTH_TOKEN = 'authToken'

export const getSessionToken = () =>
  sessionStorage.getItem(ACCESS_TOKEN) as string

export const getAuthToken = () => sessionStorage.getItem(AUTH_TOKEN) as string
