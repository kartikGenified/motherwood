import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const KycDynamicApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getkycDynamic: builder.mutation({
    query: (token) => {
      console.log("KycDynamicApiqwerty",token)
    return {
    method: "GET",
    url: `/api/admin/vendorTheme/getKycOptions`,
    headers: {
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    updateKycDynamic: builder.mutation({
        query: (params) => {
          console.log("object-00988900--->",params);
          return {
            method: "PUT",
            url: `/api/app/kycStatus/${params.id}`,
            headers: {
              slug : slug,
            },
            body : params.body
          };
        },
      })
    }),
   });
   
   export const { useGetkycDynamicMutation,useUpdateKycDynamicMutation} = KycDynamicApi;
