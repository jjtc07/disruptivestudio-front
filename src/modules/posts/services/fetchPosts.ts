import { getLocalStoreToken, makeRequest } from '@modules/common/utils'

export const fetchPosts = async (query: {
  themeId?: string
  search?: string
}) => {
  try {
    const token = getLocalStoreToken()
    let url = 'posts'

    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    )
    const queryParams = new URLSearchParams(filteredQuery).toString()

    if (Boolean(queryParams)) {
      url = `posts?${queryParams}`
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
