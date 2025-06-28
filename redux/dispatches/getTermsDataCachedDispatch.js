import { setApiCallStatus } from "../slices/splashApiCallsSlice";
import { setTerms} from "../slices/termsPolicySlice";

export const getTermsDataCachedDispatch=async(dispatch, getTermsData)=>{
    console.log("getTermsDataCachedDispatch",JSON.stringify(getTermsData))
    dispatch(setTerms(getTermsData.body.data?.[0]?.files[0]));
    await  dispatch(setApiCallStatus("getTermsData"))

}