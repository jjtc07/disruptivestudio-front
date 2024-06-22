import { getSessionToken, makeRequest } from '@modules/common/utils'

export const fetchUser = async () => {
  try {
    const token = getSessionToken()
    const response: any = await makeRequest({
      method: 'GET',
      url: 'auth/me',
      displayAlert: false,
      token,
    })

    if (response.data) {
      return response.data
    } else {
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
