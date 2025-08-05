import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const getState = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCityFromStateApi: builder.mutation({
    query: (params) => {
        console.log("jksanjdbhvgcghfghvjhbn n", params)
    return {
    method: "GET",
    url: `/api/app/address/city?state=${params.stateId}`,
    headers: {
    slug: slug,
    },
    };
    },
    }),
    getStateApi: builder.mutation({
        query: (params) => {
        return {
        method: "GET",
        url: `/api/app/address/state`,
        headers: {
        slug: slug,
        },
        };
        },
        }),
    }),
   });
   
   export const { useGetCityFromStateApiMutation,useGetStateApiMutation} = getState;

