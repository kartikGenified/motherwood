import { baseApi } from "@/apiServices/baseApi";
import { slug } from "@/utils/Slug";

export const VerificationDocKycApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        verifyDocKyc: builder.mutation({
            query: (data) => {
                console.log("Data from kyc doc api",data, data.token)
              return {
                method: "POST",
                url: `/api/tenant/verificationDocs/add`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + data.token,
                  slug: slug,
                },
                body:data.body,
              };
            },
          }),
    })
});


export const {useVerifyDocKycMutation} = VerificationDocKycApi