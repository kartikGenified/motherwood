import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VersionCheck from "react-native-version-check";
import messaging from "@react-native-firebase/messaging";
import { Alert, BackHandler, Linking, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useInternetSpeedContext } from "@/Contexts/useInternetSpeedContext";
import usePermissions from "./usePermissions";

// API imports
import { useGetAppThemeDataMutation } from "../apiServices/appTheme/AppThemeApi";
import { useGetWorkflowMutation } from "../apiServices/workflow/GetWorkflowByTenant";
import { useGetFormMutation } from "../apiServices/workflow/GetForms";
import { useGetAppUserBannerDataMutation } from "../apiServices/dashboard/AppUserBannerApi";
import { useGetAppUsersDataMutation } from "../apiServices/appUsers/AppUsersApi";
import { useGetAppMenuDataMutation } from "../apiServices/dashboard/AppUserDashboardMenuAPi.js";
import { useGetAppDashboardDataMutation } from "../apiServices/dashboard/AppUserDashboardApi";
import { useFetchLegalsMutation } from "../apiServices/fetchLegal/FetchLegalApi";
import { useCheckVersionSupportMutation } from "../apiServices/minVersion/minVersionApi";

// Redux actions imports
import {
  setPrimaryThemeColor,
  setSecondaryThemeColor,
  setIcon,
  setIconDrawer,
  setTernaryThemeColor,
  setOptLogin,
  setPasswordLogin,
  setButtonThemeColor,
  setColorShades,
  setKycOptions,
  setIsOnlineVeriification,
  setSocials,
  setWebsite,
  setCustomerSupportMail,
  setCustomerSupportMobile,
  setExtraFeatures,
} from "../../redux/slices/appThemeSlice";
import {
  setManualApproval,
  setAutoApproval,
  setRegistrationRequired,
  setAppVersion,
  setLocationSetup,
  setAppUsers,
  setAppUsersData,
} from "../../redux/slices/appUserSlice";
import { setPointSharing } from "../../redux/slices/pointSharingSlice";
import {
  setAppUserType,
  setAppUserName,
  setAppUserId,
  setUserData,
  setId,
} from "../../redux/slices/appUserDataSlice";
import { setFcmToken } from "../../redux/slices/fcmTokenSlice";
import { setDashboardData } from "../../redux/slices/dashboardDataSlice";
import { setBannerData } from "../../redux/slices/dashboardDataSlice";
import {
  setProgram,
  setWorkflow,
  setIsGenuinityOnly,
} from "../../redux/slices/appWorkflowSlice";
import {
  setWarrantyForm,
  setWarrantyFormId,
} from "../../redux/slices/formSlice";
import { setPolicy, setTerms, setAbout, setDetails } from "../../redux/slices/termsPolicySlice";
import { setDrawerData } from "../../redux/slices/drawerDataSlice";

// Utility imports
import { apiCachingLogic, storeData } from "../utils/apiCachingLogic";
import { clientName } from "../utils/HandleClientSetup";

// Cached dispatch imports
import { getAppThemeCachedDispatch } from "../../redux/dispatches/getAppThemeCachedDispatch";
import { getPolicyDataCachedDispatch } from "../../redux/dispatches/getPolicyDataCachedDispatch";
import { getWorkflowCachedDispatch } from "../../redux/dispatches/getWorkflowCachedDispatch";
import { getFormCachedDispatch } from "../../redux/dispatches/getFormCachedDispatch";
import { getBannerCachedDispatch } from "../../redux/dispatches/getBannerCachedDispatch";
import { getAppmenuCachedDispatch } from "../../redux/dispatches/getAppmenuCachedDispatch";
import { getDashboardCachedDispatch } from "../../redux/dispatches/getDashboardCachedDispatch";
import { getTermsDataCachedDispatch } from "../../redux/dispatches/getTermsDataCachedDispatch";
import { getUsersDataCachedDispatch } from "../../redux/dispatches/getUsersDataCachedDispatch";

const useSplashData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { responseTime } = useInternetSpeedContext();
  const { initializeAllPermissions } = usePermissions();
  
  // State
  const [sessionData, setSessionData] = useState(null);
  const [currentAppVersion, setCurrentAppVersion] = useState(null);
  const [mpinData, setMpinData] = useState(null);
  const [minVersionSupport, setMinVersionSupport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSlowInternet, setIsSlowInternet] = useState(false);

  // API hooks
  const [getAppTheme, {
    data: getAppThemeData,
    error: getAppThemeError,
    isLoading: getAppThemeIsLoading,
    isError: getAppThemeIsError,
  }] = useGetAppThemeDataMutation();

  const [getWorkflowFunc, {
    data: getWorkflowData,
    error: getWorkflowError,
    isLoading: getWorkflowIsLoading,
    isError: getWorkflowIsError,
  }] = useGetWorkflowMutation();

  const [getFormFunc, {
    data: getFormData,
    error: getFormError,
    isLoading: getFormIsLoading,
    isError: getFormIsError,
  }] = useGetFormMutation();

  const [getBannerFunc, {
    data: getBannerData,
    error: getBannerError,
    isLoading: getBannerIsLoading,
    isError: getBannerIsError,
  }] = useGetAppUserBannerDataMutation();

  const [getUsers, {
    data: getUsersData,
    error: getUsersError,
    isLoading: getUsersDataIsLoading,
    isError: getUsersDataIsError,
  }] = useGetAppUsersDataMutation();

  const [getAppMenuFunc, {
    data: getAppMenuData,
    error: getAppMenuError,
    isLoading: getAppMenuIsLoading,
    isError: getAppMenuIsError,
  }] = useGetAppMenuDataMutation();

  const [getDashboardFunc, {
    data: getDashboardData,
    error: getDashboardError,
    isLoading: getDashboardIsLoading,
    isError: getDashboardIsError,
  }] = useGetAppDashboardDataMutation();

  const [getTermsAndCondition, {
    data: getTermsData,
    error: getTermsError,
    isLoading: termsLoading,
    isError: termsIsError,
  }] = useFetchLegalsMutation();

  const [getAboutMotherwoodFunc, {
    data: getAboutMotherwoodData,
    error: getAboutMotherwoodError,
    isLoading: getAboutMotherwoodIsLoading,
    isError: getAboutMotherwoodIsError,
  }] = useFetchLegalsMutation();

  const [getDetailsFunc, {
    data: getDetailsData,
    error: getDetailsError,
    isLoading: getDetailsIsLoading,
    isError: getDetailsIsError,
  }] = useFetchLegalsMutation();

  const [getMinVersionSupportFunc, {
    data: getMinVersionSupportData,
    error: getMinVersionSupportError,
    isLoading: getMinVersionSupportIsLoading,
    isError: getMinVersionSupportIsError,
  }] = useCheckVersionSupportMutation();

  const [getPolicies, {
    data: getPolicyData,
    error: getPolicyError,
    isLoading: policyLoading,
    isError: policyIsError,
  }] = useFetchLegalsMutation();

  // Initialize session data
  const initializeSessionData = async () => {
    try {
      const loginData = await AsyncStorage.getItem("loginData");
      const parsedLoginData = JSON.parse(loginData);
      console.log("setSessionDataparsedLoginData", parsedLoginData);
      
      if (parsedLoginData) {
        setSessionData(parsedLoginData);
        
        // Dispatch user data to store
        if ((parsedLoginData.user_type).toLowerCase() === 'contractor' || 
            (parsedLoginData.user_type).toLowerCase() === 'carpenter' || 
            (parsedLoginData.user_type).toLowerCase() === 'oem' || 
            (parsedLoginData.user_type).toLowerCase() === 'directoem') {
          console.log("dispatching new user themes according to user types");
          dispatch(setTernaryThemeColor("#F0F8F6"));
          dispatch(setSecondaryThemeColor("#00A79D"));
        }
        
        dispatch(setAppUserId(parsedLoginData.user_type_id));
        dispatch(setAppUserName(parsedLoginData.name));
        dispatch(setAppUserType(parsedLoginData.user_type));
        dispatch(setUserData(parsedLoginData));
        dispatch(setId(parsedLoginData.id));
      }
    } catch (error) {
      console.error("Error initializing session data:", error);
      setError("Failed to load session data");
    }
  };

  // Initialize app version
  const initializeAppVersion = () => {
    const currentVersion = VersionCheck.getCurrentVersion();
    console.log("currentVersion", currentVersion);
    
    setCurrentAppVersion(currentVersion);
    console.log("current version check", currentVersion);
    dispatch(setAppVersion(currentVersion));
  };

  // Initialize MPIN data
  const initializeMpinData = async () => {
    try {
      const mPin = await AsyncStorage.getItem("userMpin");
      console.log("mpin data", mPin);
      setMpinData(mPin);
    } catch (error) {
      console.error("Error fetching MPIN data:", error);
    }
  };

  // Initialize FCM token
  const initializeFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log("fcmToken", fcmToken);
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  // Handle back press
  const setupBackHandler = () => {
    if (!navigation) return null;

    const backAction = () => {
      Alert.alert(t("Exit App"), t("Are you sure you want to exit?"), [
        {
          text: t("Cancel"),
          onPress: () => null,
          style: "cancel",
        },
        { text: t("Exit"), onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  };


  // Call open APIs (non-authenticated)
  const callOpenApis = async () => {
    if (!currentAppVersion) return;

    try {
      // App theme API
      const cachedThemeData = await apiCachingLogic("getAppThemeData");
      if (cachedThemeData != null) {
        getAppThemeCachedDispatch(dispatch, cachedThemeData);
        storeData("getAppThemeData", cachedThemeData);
      } else {
        getAppTheme(clientName);
      }
      console.log('current version', currentAppVersion);
      
      // Min version support API
      getMinVersionSupportFunc(String(currentAppVersion));

      // Users data API
      const cachedUsersData = await apiCachingLogic("getUsersData");
      if (cachedUsersData != null) {
        getUsersDataCachedDispatch(dispatch, cachedUsersData);
        storeData("getUsersData", cachedUsersData);
      } else {
        getUsers();
      }

      // Terms and conditions API
      const cachedTermsData = await apiCachingLogic("getTermsData");
      if (cachedTermsData != null) {
        getTermsDataCachedDispatch(dispatch, cachedTermsData);
        storeData("getTermsData", cachedTermsData);
      } else {
        const params = { type: "term-and-condition" };
        getTermsAndCondition(params);
      }

      // Privacy policy API
      const cachedPolicyData = await apiCachingLogic("getPolicyData");
      if (cachedPolicyData != null) {
        getPolicyDataCachedDispatch(dispatch, cachedPolicyData);
        storeData("getPolicyData", cachedPolicyData);
      } else {
        const params = { type: "privacy-policy" };
        getPolicies(params);
      }

      // About API
      const aboutParams = { type: "about" };
      getAboutMotherwoodFunc(aboutParams);

      // Details API
      const detailsParams = { type: "details" };
      getDetailsFunc(detailsParams);

    } catch (error) {
      console.error("Error calling open APIs:", error);
      setError("Failed to load app data");
    }
  };

  // Call protected APIs (require authentication)
  const callProtectedApis = async () => {
    if (!sessionData) return;

    try {
      // Workflow API
      const cachedWorkflowData = await apiCachingLogic("getWorkflowData");
      if (cachedWorkflowData != null) {
        getWorkflowCachedDispatch(dispatch, cachedWorkflowData);
        storeData("getWorkflowData", cachedWorkflowData);
      } else {
        getWorkflowFunc({
          userId: sessionData?.user_type_id,
          token: sessionData?.token,
        });
      }

      // Form API
      const cachedFormData = await apiCachingLogic("getFormData");
      if (cachedFormData != null) {
        getFormCachedDispatch(dispatch, cachedFormData);
        storeData("getFormData", cachedFormData);
      } else {
        const form_type = "2";
        getFormFunc({ form_type: form_type, token: sessionData?.token });
      }

      // Banner API
      const cachedBannerData = await apiCachingLogic("getBannerData");
      if (cachedBannerData != null) {
        getBannerCachedDispatch(dispatch, cachedBannerData);
        storeData("getBannerData", cachedBannerData);
      } else {
        getBannerFunc(sessionData?.token);
      }

      // App Menu API
      const cachedMenuData = await apiCachingLogic("getAppMenuData");
      if (cachedMenuData != null) {
        getAppmenuCachedDispatch(sessionData, dispatch, cachedMenuData);
        storeData("getAppMenuData", cachedMenuData);
      } else {
        getAppMenuFunc(sessionData?.token);
      }

      // Dashboard API
      const cachedDashboardData = await apiCachingLogic("getDashboardData");
      if (cachedDashboardData != null) {
        getDashboardCachedDispatch(dispatch, cachedDashboardData);
        storeData("getDashboardData", cachedDashboardData);
      } else {
        getDashboardFunc(sessionData?.token);
      }

    } catch (error) {
      console.error("Error calling protected APIs:", error);
      setError("Failed to load user data");
    }
  };

  // Handle API responses
  useEffect(() => {
    if (getAppThemeData) {
      console.log("getAppThemeData", JSON.stringify(getAppThemeData?.body));
      storeData("getAppThemeData", getAppThemeData);
      getAppThemeCachedDispatch(dispatch, getAppThemeData, sessionData);
    } else if (getAppThemeError) {
      console.log("getAppThemeError", getAppThemeError);
      setError("Failed to load app theme");
    }
  }, [getAppThemeData, getAppThemeError]);

  useEffect(() => {
    if (getTermsData) {
      console.log("getTermsData", getTermsData.body.data?.[0]?.files[0]);
      storeData("getTermsData", getTermsData);
      getTermsDataCachedDispatch(dispatch, getTermsData);
    } else if (getTermsError) {
      console.log("getTermsError", getTermsError);
      setError("Failed to load terms and conditions");
    }
  }, [getTermsData, getTermsError]);

  useEffect(() => {
    if (getAboutMotherwoodData) {
      console.log("getAboutMotherwoodData", getAboutMotherwoodData.body.data?.[0]?.files[0]);
      dispatch(setAbout(getAboutMotherwoodData.body.data?.[0]?.files[0]));
    } else if (getAboutMotherwoodError) {
      console.log("getAboutMotherwoodError", getAboutMotherwoodError);
    }
  }, [getAboutMotherwoodData, getAboutMotherwoodError]);

  useEffect(() => {
    if (getDetailsData) {
      console.log("getDetailsData", getDetailsData.body.data?.[0]?.files[0]);
      dispatch(setDetails(getDetailsData.body.data?.[0]?.files[0]));
    } else if (getDetailsError) {
      console.log("getDetailsError", getDetailsError);
    }
  }, [getDetailsData, getDetailsError]);

  useEffect(() => {
    if (getDashboardData) {
      console.log("getDashboardData", getDashboardData);
      getDashboardCachedDispatch(dispatch, getDashboardData);
      storeData("getDashboardData", getDashboardData);
    } else if (getDashboardError) {
      console.log("getDashboardError", getDashboardError);
      if (getDashboardError?.status === 401) {
        setError("Session expired");
      }
    }
  }, [getDashboardData, getDashboardError]);

  useEffect(() => {
    if (getAppMenuData) {
      console.log("getAppMenuData", JSON.stringify(getAppMenuData));
      getAppmenuCachedDispatch(dispatch, getAppMenuData);
      storeData("getAppMenuData", getAppMenuData);
    } else if (getAppMenuError) {
      console.log("getAppMenuError", getAppMenuError);
      setError("Failed to load app menu");
    }
  }, [getAppMenuData, getAppMenuError]);

  useEffect(() => {
    if (getPolicyData) {
      console.log("getPolicyData", JSON.stringify(getPolicyData));
      getPolicyDataCachedDispatch(dispatch, getPolicyData);
      storeData("getPolicyData", getPolicyData);
    } else if (getPolicyError) {
      console.log("getPolicyError", getPolicyError);
      if (getPolicyError?.status === 401) {
        setError("Session expired");
      } else {
        setError("Failed to load privacy policy");
      }
    }
  }, [getPolicyData, getPolicyError]);

  useEffect(() => {
    if (getFormData) {
      console.log("getFormData", getFormData?.body);
      getFormCachedDispatch(dispatch, getFormData);
      storeData("getFormData", getFormData);
    } else if (getFormError) {
      console.log("getFormError", getFormError);
      setError("Can't fetch forms for warranty.");
    }
  }, [getFormData, getFormError]);

  useEffect(() => {
    if (getWorkflowData) {
      storeData("getWorkflowData", getWorkflowData);
      getWorkflowCachedDispatch(dispatch, getWorkflowData);
    } else if (getWorkflowError) {
      console.log("getWorkflowError", getWorkflowError);
      setError("Oops something went wrong");
      if (getWorkflowError?.status === 401) {
        setError("Session expired");
      }
    }
  }, [getWorkflowData, getWorkflowError]);

  useEffect(() => {
    if (getBannerData) {
      console.log("getBannerData", getBannerData?.body);
      getBannerCachedDispatch(dispatch, getBannerData);
      storeData("getBannerData", getBannerData);
    } else if (getBannerError) {
      setError("Unable to fetch app banners");
      console.log("getBannerError", getBannerError);
      if (getBannerError?.status === 401) {
        setError("Session expired");
      }
    }
  }, [getBannerError, getBannerData]);

  useEffect(() => {
    if (getUsersData) {
      console.log("getUsersData", getUsersData);
      getUsersDataCachedDispatch(dispatch, getUsersData);
      storeData("getUsersData", getUsersData);
    } else if (getUsersError) {
      console.log("getUsersError", getUsersError);
      setError("Failed to load users data");
    }
  }, [getUsersData, getUsersError]);

  useEffect(() => {
    console.log("getMinVersionSupportData", getMinVersionSupportData);
    if (getMinVersionSupportData) {
      setMinVersionSupport(!!(getMinVersionSupportData?.success && getMinVersionSupportData?.body?.data))
    } else if (getMinVersionSupportError) {
      console.log("getMinVersionSupportError", getMinVersionSupportError);
      // setError("An error occurred while fetching minimum version support.");
      Alert.alert(
              t("Error"),
              t("An error occurred while fetching minimum version support."),
              [{ text: "Exit", onPress: () => BackHandler.exitApp() }],
              { cancelable: false }
            );
    }
  }, [getMinVersionSupportData, getMinVersionSupportError]);



  // TODO: remaining update for ios
  useEffect(()=>{
    if(minVersionSupport===false){
    Alert.alert(
          t("Kindly update the app to the latest version"),
          t("Your version of app is not supported anymore, kindly update"),
          [
            {
              text: "Update",
              onPress: () =>{
                if(Platform.OS === 'android'){
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.genefied.motherwood"
                  );
                }
              }
            },
          ]
        );
    }
  },[minVersionSupport])

  // Initialize hook
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await initializeSessionData();
      initializeAppVersion();
      await initializeMpinData();
      await initializeFcmToken();
      
      // Initialize all permissions using the custom hook
      const permissionResults = await initializeAllPermissions();
      // console.log("Permission results:", permissionResults);
      
      dispatch({ type: "NETWORK_REQUEST" });
      setIsLoading(false);
    };

    initialize();
  }, []);

  // Setup back handler
  useEffect(() => {
    const cleanup = setupBackHandler();
    return cleanup;
  }, [navigation]);

  // Handle response time for slow internet detection
  useEffect(() => {
    if (responseTime) {
      console.log("responseTime", responseTime);
      if (responseTime > 4000) {
        setIsSlowInternet(true);
      } else if (responseTime < 4000) {
        setIsSlowInternet(false);
      }
    }
  }, [responseTime]);

  // Handle version support


  // Call APIs based on current app version
  useEffect(() => {
    if (currentAppVersion) {
      callOpenApis();
    }
  }, [currentAppVersion]);

  // Call protected APIs when session data is available
  useEffect(() => {
    if (sessionData) {
      callProtectedApis();
    }
  }, [sessionData]);

  // Calculate loading state
  const allLoadingStates = [
    getAppThemeIsLoading,
    getWorkflowIsLoading,
    getFormIsLoading,
    getBannerIsLoading,
    getUsersDataIsLoading,
    getAppMenuIsLoading,
    getDashboardIsLoading,
    termsLoading,
    getAboutMotherwoodIsLoading,
    getDetailsIsLoading,
    getMinVersionSupportIsLoading,
    policyLoading,
  ];

  const isApiLoading = allLoadingStates.some(loading => loading) || isLoading;

  return {
    // State
    sessionData,
    currentAppVersion,
    mpinData,
    minVersionSupport,
    isLoading: isApiLoading,
    error,
    isSlowInternet,
    
    // Data
    appThemeData: getAppThemeData,
    workflowData: getWorkflowData,
    formData: getFormData,
    bannerData: getBannerData,
    usersData: getUsersData,
    appMenuData: getAppMenuData,
    dashboardData: getDashboardData,
    termsData: getTermsData,
    aboutData: getAboutMotherwoodData,
    detailsData: getDetailsData,
    minVersionData: getMinVersionSupportData,
    policyData: getPolicyData,
    
    // Functions
    initializeSessionData,
    callOpenApis,
    callProtectedApis,
    setError,
  };
};

export default useSplashData;
