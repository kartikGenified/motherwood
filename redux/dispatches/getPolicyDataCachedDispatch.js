import { setApiCallStatus } from "../slices/splashApiCallsSlice";
import { setPolicy } from "../slices/termsPolicySlice";


export const getPolicyDataCachedDispatch=async(dispatch,getPolicyData)=>{
    console.log("getPolicyDataCachedDispatch",getPolicyData)
    await dispatch(setPolicy(getPolicyData?.body?.data?.[0]?.files?.[0]))
    await  dispatch(setApiCallStatus("getPolicyData"))

}