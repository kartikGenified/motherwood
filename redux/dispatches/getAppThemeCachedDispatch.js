import { setApiCallStatus } from "../slices/splashApiCallsSlice";

const { setLocationSetup, setManualApproval, setAutoApproval, setRegistrationRequired } = require("../slices/appUserSlice");
const { setPrimaryThemeColor, setSecondaryThemeColor, setTernaryThemeColor, setIcon, setIconDrawer, setOptLogin, setPasswordLogin, setButtonThemeColor, setColorShades, setKycOptions, setSocials, setWebsite, setCustomerSupportMail, setCustomerSupportMobile, setExtraFeatures, setIsOnlineVeriification, setPermission, setValidationConditions } = require("../slices/appThemeSlice");
const { setPointSharing } = require("../slices/pointSharingSlice");
const { setDrawerData } = require("../slices/drawerDataSlice");


export const getAppThemeCachedDispatch=async(dispatch, getAppThemeData)=>{
  console.log("getAppThemeCachedDispatch",JSON.stringify(getAppThemeData))
  await dispatch(setLocationSetup(getAppThemeData?.body?.location));
      console.log(
        "dispatching locaion setup data",
        getAppThemeData?.body?.location
      )
      await dispatch(
        setPrimaryThemeColor(getAppThemeData?.body?.theme?.color_shades["600"])
      );
      await dispatch(
        setSecondaryThemeColor(
          getAppThemeData?.body?.theme?.color_shades["400"]
        )
      );
      await dispatch(
        setTernaryThemeColor(getAppThemeData?.body?.theme?.color_shades["700"])
      );

      await dispatch(setIcon(getAppThemeData?.body?.logo[0]));

      await dispatch(setPermission(getAppThemeData?.body?.permissions));
      
      await dispatch(setValidationConditions(getAppThemeData?.body?.validation_conditions));

      await dispatch(setOptLogin(getAppThemeData?.body?.login_options?.Otp.users));

      await dispatch(
        setPasswordLogin(getAppThemeData?.body?.login_options?.Password.users)
      );
      await dispatch(
        setButtonThemeColor(getAppThemeData?.body?.theme?.color_shades["700"])
      );
      await dispatch(
        setManualApproval(
          getAppThemeData?.body?.approval_flow_options?.Manual.users
        )
      );
      await dispatch(
        setAutoApproval(
          getAppThemeData?.body?.approval_flow_options?.AutoApproval.users
        )
      );
      await dispatch(
        setRegistrationRequired(
          getAppThemeData?.body?.registration_options?.Registration?.users
        )
      );
      await dispatch(setColorShades(getAppThemeData?.body?.theme.color_shades));
      await dispatch(setKycOptions(getAppThemeData?.body?.kyc_options_before_login));
      // dispatch(setLanguage(getAppThemeData?.body?.language))
      await dispatch(setPointSharing(getAppThemeData?.body?.points_sharing));
      await dispatch(setSocials(getAppThemeData?.body?.socials));
      await dispatch(setWebsite(getAppThemeData?.body?.website));
      await dispatch(
        setCustomerSupportMail(getAppThemeData?.body?.customer_support_email)
      );
      await dispatch(
        setCustomerSupportMobile(getAppThemeData?.body?.customer_support_mobile)
      );
      await dispatch(setExtraFeatures(getAppThemeData?.body?.addon_features));
      if (
        getAppThemeData?.body?.addon_features?.kyc_online_verification !==
        undefined
      ) {
        if (getAppThemeData?.body?.addon_features?.kyc_online_verification) {
          await dispatch(setIsOnlineVeriification());
        }
      }
      await  dispatch(setApiCallStatus("getAppThemeData"))
}