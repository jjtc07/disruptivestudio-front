import { getLocalStoreToken, makeRequest } from '@modules/common/utils'

export const createPostService = async (data: any) => {
  try {
    const token = getLocalStoreToken()

    const response: any = await makeRequest({
      method: 'POST',
      url: 'posts',
      data,
      token,
    })

    return response.data
  } catch (err) {
    throw err
  }
}
