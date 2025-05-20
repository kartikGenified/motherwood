import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const recievedOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDetailsByType: builder.mutation({
      query(data) {
        console.log("getOrderDetailsByType", data);
        return {
          url: `/api/tenant/orders/ordersByType?type=${data.type}`,
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

export const { useGetOrderDetailsByTypeMutation } = recievedOrderApi;
