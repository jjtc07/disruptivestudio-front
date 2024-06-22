import { getLocalStoreToken, makeRequest } from '@modules/common/utils'

export const fetchThemes = async () => {
  try {
    const token = getLocalStoreToken()

    const response: any = await makeRequest({
      method: 'GET',
      url: 'themes',
      token,
    })

    return response.data
  } catch (err) {
    return []
  }
}
