import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const pointTransfer = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        pointTransfer : builder.mutation({
            query({token,requestData}){
                console.log(token,"and",requestData)
                return {
                    url:`api/tenant/orders/saveAppOrder`,
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


export const {usePointTransferMutation} = pointTransfer

