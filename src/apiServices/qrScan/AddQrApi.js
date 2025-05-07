import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AddQrApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addQr : builder.mutation({
            query({token,requestData}){
                console.log(token,"and",requestData)
                return {
                    url:`api/tenant/qrScanHistory/add`,
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
        fetchAllQrScanedList: builder.mutation({
            query: (body) => {
              return {
                method: "GET",
                url: `api/app/qrScanHistory/${body.query_params}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + body.token,
                  slug: slug,
                },
              };
            },
          }),

          fetchDistributorBySearch: builder.mutation({
            query: (body) => {
              console.log("fetch body", body)
              return {
                method: "post",
                url: `/api/tenant/appUserType/search-tagging`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                  Authorization: "Bearer " + body.token,
                },
                body:body

              };
            },
          }),

          fetchDistributorQrScanedList: builder.mutation({
            query: (body) => {
              console.log("dis body", body)
              return {
                method: "post",
                url: `api/tenant/aqualite/distributor/scan/${body.user_id}/?${body.query_params}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + body.token,
                  slug: slug,
                },
                body:JSON.stringify({})
              };
            },
          }),

  
    })
});


export const {useAddQrMutation,useFetchAllQrScanedListMutation, useFetchDistributorQrScanedListMutation, useFetchDistributorBySearchMutation} = AddQrApi

