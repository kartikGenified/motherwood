import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeValue } from "./apiCachingLogic";

const allApiArray = ["getAppThemeData", "getTermsData", "getPolicyData", "getWorkflowData", "getDashboardData", "getAppMenuData", "getFormData", "getBannerData", "getUsersData"]

export const asyncRemoveFunc =async(key)=>{
    try{
        await removeValue(key)
    }
    catch(e)
    {
        console.log("Error in removing key " + key + " from async storage")
    }
}

export const removeCachingLogic=async()=>{
    for(let i=0;i<allApiArray.length;i++)
    {
        await asyncRemoveFunc(allApiArray[i]);
    } 
}

