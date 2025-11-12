import { setApiCallStatus } from "../slices/splashApiCallsSlice";
import { setAllLegal } from "../slices/termsPolicySlice";

export const getLegalCachedDispatch=async(dispatch,getLegalData)=>{
    // console.log("getLegalCachedDispatch",JSON.stringify(getLegalData),getLegalData?.body?.data?.[0]?.files?.[0])
    const legalData = {
      terms: getLegalData.body.data.find(item => item.type === 'term-and-condition')?.files[0] || "",
      policy: getLegalData.body.data.find(item => item.type === 'privacy-policy')?.files[0] || "",
      about: getLegalData.body.data.find(item => item.type === 'about')?.files[0] || "",
      details: getLegalData.body.data.find(item => item.type === 'details')?.files[0] || ""
    }
    await dispatch(setAllLegal(legalData))
    await  dispatch(setApiCallStatus("getLegalData"))

}