import { setApiCallStatus } from "../slices/splashApiCallsSlice";

const { setDashboardData } = require("../slices/dashboardDataSlice");

export const getDashboardCachedDispatch=async(dispatch, getDashboardData)=>{
    console.log("getDashboardCachedDispatch",getDashboardData)
    dispatch(setDashboardData(getDashboardData?.body?.app_dashboard));
    await  dispatch(setApiCallStatus("getDashboardData"))
    
} 