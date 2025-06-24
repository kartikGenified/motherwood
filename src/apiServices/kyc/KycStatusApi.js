import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const KycStatusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getkycStatus: builder.mutation({
    query: (token) => {
      console.log("KycStatusApiqwerty",token)
    return {
    method: "GET",
    url: `/api/app/kyc`,
    headers: {
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    getkycStatusOfOtherUserByUserId: builder.mutation({
      query: (data) => {
        console.log("KycStatusApiqwerty getkycStatusOfOtherUserByUserId",data)
      return {
      method: "GET",
      url: `api/app/kyc?user=${data.userId}`,
      headers: {
      Authorization: "Bearer " + data.token,
      slug: slug,
      },
      };
      },
      }),
      
    updateKycStatus: builder.mutation({
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
   
   export const { useGetkycStatusMutation,useUpdateKycStatusMutation ,useGetkycStatusOfOtherUserByUserIdMutation} = KycStatusApi;