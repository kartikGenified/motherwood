import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const refferalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateRefferalApi: builder.mutation({
      query(params) {
        console.log("client name", params);
        return {
          url: `api/app/validateReferralCode`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          "slug":slug,
        },
          body:params.data
        
        };
      },
    }),
  }),
});

export const { useValidateRefferalApiMutation } = refferalApi;
