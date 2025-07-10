import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const ApproveUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    approveUserForSales: builder.mutation({
      query(params) {
        console.log("client name", params);
        return {
          url: `/api/app/employee/approve/user`,
          method: "POST",
          headers: { "Content-Type": "application/json",
          "slug":slug,
          "Authorization": `Bearer ${params.token}`,
        },
          body: {
            userId: params.userId,
            status: params.status,
            reason: params.reason,
          },
        };
      },
    }),
  }),
});

export const { useApproveUserForSalesMutation } = ApproveUserApi;
