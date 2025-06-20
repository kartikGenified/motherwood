import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const userMappingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserMapping: builder.mutation({
      query: (params) => {
        console.log("createUserMappingAPI", params);
        return {
          method: "POST",
          url: `/api/tenant/user-mapping/add`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
          body: params.body,
        };
      },
    }),

    // open route for creating user mapping
    createUserMappingOpen: builder.mutation({
      query: (params) => {
        console.log("createUserMappingAPIOPEN", params);
        return {
          method: "POST",
          url: `/api/open/user-mapping/add`,
          headers: {
            "Content-Type": "application/json",
            slug: slug,
          },
          body: params.body,
        };
      },
    }),
    fetchUserMappingByAppUserIdAndMappedUserType: builder.mutation({
      query: (params) => {
        return {
          method: "GET",
          url: `/api/tenant/user-mapping/${params.app_user_id}?mapped_user_type=${params?.type}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
        };
      },
    }),

    fetchUserMappingByUserTypeAndMappedUserType: builder.mutation({
      query: (params) => {
        return {
          method: "GET",
          url: `/api/tenant/user-mapping/?user_type=distributor&mapped_user_type=retailer`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
        };
      },
    }),

    deleteUserMapping: builder.mutation({
      query: (params) => {
        return {
          method: "DELETE",
          url: `/api/tenant/user-mapping/${params.id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
        };
      },
    }),

    getMappingDetailsByAppUserId: builder.mutation({
      query: (params) => {
        return {
          method: "GET",
          url: `/api/tenant/user-mapping/details/${params.id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
          },
        };
      },
    }),

getZoneWiseEmployeeUser: builder.mutation({
  query: (params) => {
    const queryParams = [];
    if (params.status) queryParams.push(`status=${params.status}`);
    if (params.dateFrom) queryParams.push(`dateFrom=${params.dateFrom}`);
    if (params.dateTo) queryParams.push(`dateTo=${params.dateTo}`);
    if (params.userId) queryParams.push(`userId=${params.userId}`);
    if (params.mobile) queryParams.push(`mobile=${params.mobile}`);
    const queryString = queryParams.length
      ? `?${queryParams.join("&")}`
      : "";
    return {
      method: "GET",
      url: `/api/app/employee/zone-wise/user${queryString}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + params.token,
        slug: slug,
      },
    };
  },
}),
  }),
});

export const {
  useCreateUserMappingOpenMutation,
  useCreateUserMappingMutation,
  useDeleteUserMappingMutation,
  useFetchUserMappingByAppUserIdAndMappedUserTypeMutation,
  useFetchUserMappingByUserTypeAndMappedUserTypeMutation,
  useGetMappingDetailsByAppUserIdMutation,
  useGetZoneWiseEmployeeUserMutation
} = userMappingApi;
