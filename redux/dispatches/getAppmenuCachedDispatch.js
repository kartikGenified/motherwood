import { setApiCallStatus } from "../slices/splashApiCallsSlice";
const { setDrawerData } = require("../slices/drawerDataSlice");

setApiCallStatus
export const getAppmenuCachedDispatch=async(sessionData, dispatch, getAppMenuData)=>{
  console.log("getAppmenuCachedDispatch",getAppMenuData)
    const tempDrawerData = getAppMenuData.body.filter((item) => {
        return item.user_type === sessionData.user_type;
      });
      tempDrawerData && await dispatch(setDrawerData(tempDrawerData[0]));
      tempDrawerData &&  await dispatch(setApiCallStatus("getAppMenuData"))
}