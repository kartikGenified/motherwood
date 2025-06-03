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
    getProductCategoryList: builder.query({
      query: ({ token }) => ({
        method: "GET",
        url: "/api/app/subcategory",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          slug: slug,
        },
      }),
    }),
    getProductsByCategory: builder.mutation({
      query: ({ token, categoryId }) => (
        console.log("categoryIdandtoken", categoryId,token),
        {
        method: "GET",
        url: `/api/app/product/${categoryId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          slug: slug,
        },
      }),
    }),
  }),
});

export const { useGetProductListMutation, useGetProductCategoryListQuery, useGetProductsByCategoryMutation } = getProductApi;
