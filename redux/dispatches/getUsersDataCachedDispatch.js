import { setAppUsers, setAppUsersData } from "../slices/appUserSlice";
import { setApiCallStatus } from "../slices/splashApiCallsSlice";

export const getUsersDataCachedDispatch = async (dispatch, getUsersData) => {
  console.log("getUsersDataCachedDispatch", getUsersData);
  const appUsers = getUsersData?.body.map((item, index) => {
    return item.name;
  });
  const appUsersData = getUsersData?.body.map((item, index) => {
    return {
      name: item.name,
      id: item.user_type_id,
    };
  });
  console.log("getUsersData", appUsers, appUsersData);
  dispatch(setAppUsers(appUsers));
  dispatch(setAppUsersData(appUsersData));
  await dispatch(setApiCallStatus("getUsersData"));
};
