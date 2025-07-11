import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const getCity = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCityApi: builder.mutation({
    query: () => {
    return {
    method: "GET",
    url: `/api/app/address/city`,
    headers: {
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useGetCityApiMutation} = getCity;

