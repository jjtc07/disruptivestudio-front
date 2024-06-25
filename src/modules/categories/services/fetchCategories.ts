import { getLocalStoreToken, makeRequest } from '@modules/common/utils'
import { ICategory } from '../interfaces'

export const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const token = getLocalStoreToken()

    const response = await makeRequest({
      method: 'GET',
      url: 'categories',
      token,
    })

    return response.data
  } catch (err) {
    throw err
  }
}
