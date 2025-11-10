import { baseAuthApi } from "../baseApi";
export const AppUserBannerApi = baseAuthApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppUserBannerData : builder.mutation({
            query(token){
                console.log("Banner data getAppUserBannerData",token)
                return {
                    url:`api/tenant/appBanner`,
                    method:'get',
                }
            }
        })
    })
});


export const {useGetAppUserBannerDataMutation} = AppUserBannerApi

