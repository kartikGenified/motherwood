import { baseApi } from '../baseApi';
import { slug } from '../../utils/Slug';

export const KycStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    aadharKycGenerate: builder.mutation({
      query: (token) => {
        console.log("aadharKycGenerate", token)
        return {
          method: "GET",
          url: `/api/app/digilocker-aadhaar/generate`,
          headers: {
            Authorization: "Bearer " + token,
            slug: slug,
          },
        };
      },
    }),
    aadharKycStatus: builder.mutation({
      query: (token) => {
        console.log("aadharKycStatus", token)
        return {
          method: "GET",
          url: `/api/app/digilocker-aadhaar/verify`,
          headers: {
            Authorization: "Bearer " + token,
            slug: slug,
          },
        };
      },
    }),

  }),
});

export const { useAadharKycGenerateMutation, useAadharKycStatusMutation } = KycStatusApi;