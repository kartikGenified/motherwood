import { baseAuthApi } from "@/apiServices/baseApi";

export const DigilockerApi = baseAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    aadharKycGenerate: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `/api/app/digilocker-aadhaar/generate`,
          body: body,
        };
      },
    }),
    aadharKycStatus: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `/api/app/digilocker-aadhaar/verify`,
          body: body,
        };
      },
    }),

  }),
});

export const { useAadharKycGenerateMutation, useAadharKycStatusMutation } = DigilockerApi;