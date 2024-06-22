import Axios, { AxiosResponse } from 'axios'
export const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL

export type DoRequestProps = {
  apiUrl?: string
  method: string
  url: string
  data?: any
  params?: Record<string, string | number>
  headers?: Record<string, string>
  version?: string
  displayAlert?: boolean
  token?: string
}

export const makeRequest = function ({
  apiUrl,
  method,
  url,
  data = [],
  params = {},
  headers = {},
  version = 'v1',
  displayAlert = true,
  token,
}: DoRequestProps): Promise<AxiosResponse<any, any>> {
  return new Promise(async (resolve, reject) => {
    try {
      headers.Accept = 'application/json'

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const options = {
        method,
        url: `${apiUrl ?? defaultApiUrl}/${version}/${url}`,
        data,
        params,
        headers,
      }

      if (method === 'GET' || method === 'get') {
        delete options.data
      }

      const response = await Axios(options)

      return resolve(response)
    } catch (err: any) {
      const { status = 500, data = {} } = err?.response ?? {}
      let alertMessage, responseError

      if (displayAlert && alertMessage) {
        alert(alertMessage)
      }

      if (!responseError) {
        const error = data?.error || err.toString()
        responseError = { status, error }
      }

      console.warn(`ERROR AT ${apiUrl}/${version}/${url}`, err?.response)

      return reject(responseError)
    }
  })
}
