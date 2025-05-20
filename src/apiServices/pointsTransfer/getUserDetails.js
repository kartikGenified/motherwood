import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const getUserDetails = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getUserDetails : builder.mutation({
            query({token,requestData}){
                console.log(token,"and",requestData)
                return {
                    url:`api/tenant/orders/getUserForOrder`,
                    method:'post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${token}`,
                    },
                    body:JSON.stringify(requestData)    
                }
            }
        }),
  
    })
});


export const {useGetUserDetailsMutation} = getUserDetails

