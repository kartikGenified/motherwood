import { baseAuthApi } from "@/apiServices/baseApi";

export const notificationsApi = baseAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    markNotificationAsReadApi: builder.mutation({
      query(body) {
        console.log("From api getLoginOtpForVerification", body)
        return {
          method: 'PATCH',
          url: `/api/tenant/push-notification/seen`,
          body: body
        }
      }
    }),
    fetchNotificationList: builder.mutation({
      query: (params) => {
        return {
          method: "GET",
          url: `/api/tenant/push-notification/app-user/${params.app_user_id}`,
        };
      },
    }),
  })
});


export const { useMarkNotificationAsReadApiMutation, useFetchNotificationListMutation } = notificationsApi

