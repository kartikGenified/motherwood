import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const birthdayApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getUserBirthdayApi : builder.mutation({
            query(params){
                console.log(params)
                return {
                    url:`api/app/employee/user-birthday`,
                    method:'Post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${params.token}`,
                    },
                    body:params.data
                    
                   
                }
            }
        })
    })
});


export const {useGetUserBirthdayApiMutation} = birthdayApi

