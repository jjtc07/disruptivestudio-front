import { getLocalStoreToken, makeRequest } from '@modules/common/utils'

export const fetchPostById = async (postId: string) => {
  try {
    const token = getLocalStoreToken()

    const response: any = await makeRequest({
      method: 'GET',
      url: `posts/${postId}`,
      token,
    })

    return response.data
  } catch (err) {
    console.error(err)
  }
}
