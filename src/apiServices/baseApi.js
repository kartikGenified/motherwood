
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BaseUrl, SupplyUrl } from '../utils/BaseUrl'
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
    endpoints: () => ({
      
      }),
    })

export const supplyBeamApi = createApi({
  reducerPath: 'supplyApi',
  baseQuery: fetchBaseQuery({ baseUrl: SupplyUrl }),
  endpoints: () => ({
    
    }),
  })
  
    
    
    
    // https://saas.genefied.in/
    // http://saas-api-dev.genefied.in/