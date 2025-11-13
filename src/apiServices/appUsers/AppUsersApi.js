import { baseApi } from "../baseApi";
export const AppUsersApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppUsersData : builder.mutation({
            query(){
                return {
                    url:`/api/app/appUserType/only`,
                    method:'get',
                }
            }
        })
    })
});


export const {useGetAppUsersDataMutation} = AppUsersApi

