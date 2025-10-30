import { baseApi } from '../baseApi';
import { slug } from '../../utils/Slug';

export const KycStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    aadharKycGenerate: builder.mutation({
      query: (body) => {
        console.log("aadharKycGenerate body", body.data);
        return {
          method: "POST",
          url: `/api/app/digilocker-aadhaar/generate`,
          headers: {
            Authorization: "Bearer " + body.token,
            slug: slug,
          },
          body: body.data,
        };
      },
    }),
    aadharKycStatus: builder.mutation({
      query: (body) => {
        console.log("boddyyyy", body.data);
        

        return {
          method: "POST",
          url: `/api/app/digilocker-aadhaar/verify`,
          headers: {
            Authorization: "Bearer " + body.token,
            slug: slug,
          },
          body: body.data,
        };
      },
    }),

  }),
});

export const { useAadharKycGenerateMutation, useAadharKycStatusMutation } = KycStatusApi;