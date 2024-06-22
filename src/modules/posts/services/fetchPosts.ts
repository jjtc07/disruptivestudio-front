import { getLocalStoreToken, makeRequest } from '@modules/common/utils'

export const fetchPosts = async (themeId?: string | string[]) => {
  try {
    const token = getLocalStoreToken()
    let url = 'posts'

    if (themeId) {
      url = `posts?themeId=${themeId}`
    }

    const response: any = await makeRequest({
      method: 'GET',
      url,
      token,
    })

    return response.data
  } catch (err) {
    return []
  }
}
