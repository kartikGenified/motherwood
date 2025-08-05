import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const notificationsApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        markNotificationAsReadApi : builder.mutation({
            query(params){
                console.log("From api getLoginOtpForVerification",params)
                return {
                    url:`/api/tenant/push-notification/seen`,
                    method:'PATCH',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                    },
                    body:params.body
                    
                   
                }
            }
        })
    })
});


export const {useMarkNotificationAsReadApiMutation} = notificationsApi

