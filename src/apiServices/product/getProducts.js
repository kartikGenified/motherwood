import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const getProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.mutation({
      query({ token, body }) {
        return {
          method: "POST",
          url: `/api/tenant/products`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            slug: slug,
          },
          body: JSON.stringify(body),
        };
      },
    }),
  }),
});

export const { useGetProductListMutation } = getProductApi;
