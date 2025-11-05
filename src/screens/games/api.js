import { baseApi } from '@/apiServices/baseApi';
import { slug } from '@/utils/Slug';

export const tapTheDotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    showPointsApi: builder.mutation({
      query: (params) => {
        console.log("tapTheDotApi response", params)
        return {
          method: "POST",
          url: `/api/app/game/tap-dot`,
          headers: {
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
          body: params.data
        };
      },
    }),
  }),
});

export const { useShowPointsApiMutation } = tapTheDotApi;