import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const faqApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    fetchAllfaqs: builder.mutation({
        query: (params) => {
          return {
            method: "POST",
            url: `/api/app/faqs`,
            headers: {
              "Content-Type": "application/json",
              slug: slug,
            },
            
          };
        },
      }),
      fetchfaqsById: builder.mutation({
        query: (params) => {
          return {
            method: "GET",
            url: `/api/tenant/faqs/${params.id}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
        },
      }),
      addfaqs: builder.mutation({
        query: (params) => {
          return {
            method: "POST",
            url: `/api/tenant/faqs/add`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
            body: params.body,
          };
        },
      }),
  }),
});

export const {useAddfaqsMutation,useFetchAllfaqsMutation,useFetchfaqsByIdMutation} = faqApi;