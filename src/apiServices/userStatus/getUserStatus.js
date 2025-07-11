import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const getUserStatus = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStatusApi: builder.mutation({
      query(params) {
        console.log("client name", params);
        return {
          url: `/api/app/user-status`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          "slug":slug,
          Authorization: "Bearer " + params.token,

        },
        
        };
      },
    }),
  }),
});

export const { useGetUserStatusApiMutation } = getUserStatus;
