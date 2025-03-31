import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { getFromLocal } from '../../helpers/handleStorage'

const API_URL = import.meta.env.VITE_API_URL

const BASE_URL = `${API_URL}`

const baseQueryWithAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers: Headers): Headers => {
      const localToken = getFromLocal<string>('token') || null

      if (localToken) {
        headers.set('authorization', `Bearer ${localToken}`)
      }
      return headers
    },
  })

  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    window.location.href = '/'
  }

  return result
}

export const baseAPI = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Manager',
    'Admin',
    'Sub',
    'Reports',
    'Buses',
    'Driver',
    'BusStop',
    'Zones',
  ] as const,
  endpoints: () => ({}),
})
