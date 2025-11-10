import { baseAuthApi } from "../baseApi";


export const AppUserDashboardApi = baseAuthApi.injectEndpoints({
    endpoints: (builder) =>({
        getAppDashboardData : builder.mutation({
            query(){
                return {
                    url:`/api/app/appUserDashboard/`,
                    method:'get',
                }
            }
        })
    })
});


export const {useGetAppDashboardDataMutation} = AppUserDashboardApi

