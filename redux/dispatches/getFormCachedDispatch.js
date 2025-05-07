import { setWarrantyForm, setWarrantyFormId } from "../slices/formSlice";
import { setApiCallStatus } from "../slices/splashApiCallsSlice";



export const getFormCachedDispatch=async(dispatch, getFormData)=>{
    console.log("getFormCachedDispatch",getFormData)
    dispatch(setWarrantyForm(getFormData?.body?.template));
    dispatch(setWarrantyFormId(getFormData?.body?.form_template_id));
    await  dispatch(setApiCallStatus("getFormData"))

}