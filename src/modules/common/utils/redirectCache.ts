const REDIRECT = 'redirect'

export const getRedirectCache = () => {
  return localStorage.getItem(REDIRECT)
}

export const setRedirectCache = (path: string) => {
  localStorage.setItem(REDIRECT, path)
}

export const removeRedirectCache = () => {
  localStorage.removeItem(REDIRECT)
}
