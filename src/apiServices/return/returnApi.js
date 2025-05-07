import { supplyBeamApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetSchemeApi = supplyBeamApi.injectEndpoints({
  endpoints: (builder) => ({
    validateReturn: builder.mutation({
      query: (params) => {
        console.log("validateReturn",params)
        return {
          method: "POST",
          url: `/supply-beam/scans/takeReturn`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
          body:params.data
        };
      },
    }),
    submitReturn: builder.mutation({
      query: (params) => {
        return {
          method: "GET",
          url: `/supply-beam/inventory/takeReturn`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            slug: slug,
          },
        };
      },
    }),
    submitReturn: builder.mutation({
        query: (params) => {
          return {
            method: "POST",
            url: `/supply-beam/inventory/takeReturn`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
            body:params.data
          };
        },
      }),
      returnList: builder.mutation({
        query: (params) => {
          return {
            method: "POST",
            url: `/supply-beam/data/returnTakenList`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
        },
      }),
      returnInfo: builder.mutation({
        query: (params) => {
          console.log("return info", params)
          return {
            method: "POST",
            url: `/supply-beam/data/returnInfo`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
            body:params.data
          };
        },
      }),
  }),
});

export const { useReturnInfoMutation, useReturnListMutation,useSubmitReturnMutation,useValidateReturnMutation } =
  GetSchemeApi;
