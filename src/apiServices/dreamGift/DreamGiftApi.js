
import { slug } from "../../utils/Slug";
import { baseApi } from "../baseApi";

export const dreamGiftApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        dreamGiftList: builder.mutation({
            query: (params) => {
              return {
                method: "GET",
                url: `/api/app/dreamGifts/catalogue`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),

          selectedDreamGift: builder.mutation({
            query: (params) => {
              return {
                method: "GET",
                url: `/api/app/dreamGifts/active`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),

          addDreamGift: builder.mutation({
            query: (params) => {
                console.log("add dream gift para para", params)
              return {
                method: "POST",
                url: `/api/app/dreamGifts/add`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                body: params.body,
              };
            },
          }),
          deleteDreamGift: builder.mutation({
            query: (params) => {
                console.log("delete dream gift para para", params)
              return {
                method: "Delete",
                url: `/api/app/dreamGifts/remove?dream_gift_id=${params.dreamGiftId}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                
              };
            },
          }),
    })
});


export const {useDreamGiftListMutation, useSelectedDreamGiftMutation, useAddDreamGiftMutation,useDeleteDreamGiftMutation} = dreamGiftApi

