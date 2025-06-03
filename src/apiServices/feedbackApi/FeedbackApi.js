import {baseApi} from '../baseApi';
import { slug } from '../../utils/Slug';
export const FeedbackApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addFeedback: builder.mutation({
      query: ({token, body}) => {
        console.log(body)
        return {
          method: 'POST',
          url: `/api/app/feedback/add`,
          headers: {
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
          body: body,
        };
      },
    }),

    getFeedback: builder.mutation({
      query({file_name, token}) {
        console.log('image file name', file_name, token);
        return {
          method: 'GET',
          url: `/api/app/feedback`,
          headers: {
            Authorization: 'Bearer ' + token,
            slug:slug
        },
        };
      },
    }),

    

    getProductFeedback: builder.mutation({
      query({token, body}) {
        return {
          method: 'POST',
          url: `/api/app/feedback/add`,
          headers: {
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
          body: body,
        };
      },
    }),
  }),
});

export const {useAddFeedbackMutation, useGetFeedbackMutation, useGetProductFeedbackMutation} = FeedbackApi;
