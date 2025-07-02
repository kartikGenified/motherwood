import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const recievedOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDetailsByType: builder.mutation({
      query(data) {
        console.log("getOrderDetailsByType", data);
        return {
          url: `/api/tenant/orders/ordersByType?type=${data.type}&start_date=${data.start_date}&end_date=${data.end_date}`,
          method: "get",
          headers: {
            slug: slug,
            "Content-Type": "application/json",
            Authorization: "Bearer " + data.token,
          },
        };
      },
    }),

      getRetailerHistoryFromSales: builder.mutation({
      query(data) {
        let url = `/api/tenant/orders/ordersByType?userId=${data.id}&type=received_point`
        if (data.start_date) url+= `&start_date=${data.start_date}`
        if (data.end_date) url+= `&end_date=${data.end_date}`
        console.log("getOrderDetailsByType", data);
        return {
          url: url,
          method: "get",
          headers: {
            slug: slug,
            "Content-Type": "application/json",
            Authorization: "Bearer " + data.token,
          },
        };
      },
    }),
  }),
});

export const { useGetOrderDetailsByTypeMutation, useGetRetailerHistoryFromSalesMutation } = recievedOrderApi;
