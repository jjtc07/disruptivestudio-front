import { getLocalStoreToken, makeRequest } from '@modules/common/utils'

export const fetchUser = async () => {
  try {
    const token = getLocalStoreToken()
    const response: any = await makeRequest({
      method: 'POST',
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
