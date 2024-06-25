import { makeRequest } from '@modules/common/utils'

export const fetchPostById = async (postId: string) => {
  try {
    const response: any = await makeRequest({
      method: 'GET',
      url: `posts/${postId}`,
    })

    return response.data
  } catch (err) {
    console.error(err)
  }
}
