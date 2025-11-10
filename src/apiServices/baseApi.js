import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { Platform } from 'react-native'
import * as Keychain from "react-native-keychain";
import { slug } from '@/utils/Slug';
import { BaseUrl, SupplyUrl } from '../utils/BaseUrl'
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BaseUrl,
        prepareHeaders: (headers) => {
            headers.set('platform', Platform.OS)
            headers.set('slug', slug);
            return headers
        },
     }),
    endpoints: () => ({
      
      }),
    })

export const supplyBeamApi = createApi({
  reducerPath: 'supplyApi',
  baseQuery: fetchBaseQuery({ baseUrl: SupplyUrl }),
  endpoints: () => ({
    
    }),
  })

export const baseAuthApi = createApi({
  reducerPath: 'baseAuthApi',
  baseQuery: fetchBaseQuery({ 
      baseUrl: BaseUrl,
      prepareHeaders: async (headers) => {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
              headers.set('Authorization', `Bearer ${credentials.username}`);
          }
          headers.set('Content-Type', 'application/json');
          headers.set('platform', Platform.OS);
          headers.set('slug', slug);
          return headers;
      },
   }),
  endpoints: () => ({
    
    }),
  })
  
    
    
    
    // https://saas.genefied.in/
    // http://saas-api-dev.genefied.in/