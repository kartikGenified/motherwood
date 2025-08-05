import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const getNotificationCount = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationCountApi: builder.mutation({
      query(params) {
        console.log("get notification count params", params);
        return {
          url: `/api/app/notification/count`,
          method: "get",
          headers: {
            Authorization: "Bearer " + params.token,
            slug: slug,
            "Content-Type": "application/json",
          },
          
        };
      },
    }),
  }),
});

export const { useGetNotificationCountApiMutation } = getNotificationCount;
