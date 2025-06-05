import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  BackHandler,
} from "react-native";
import { useGetAppThemeDataMutation } from "../../apiServices/appTheme/AppThemeApi";
import { useSelector, useDispatch } from "react-redux";
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
} from "../../../redux/slices/appThemeSlice";
import {
  setManualApproval,
  setAutoApproval,
  setRegistrationRequired,
  setAppVersion,
  setLocationSetup,
} from "../../../redux/slices/appUserSlice";
import { setPointSharing } from "../../../redux/slices/pointSharingSlice";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAppUserType,
  setAppUserName,
  setAppUserId,
  setUserData,
  setId,
} from "../../../redux/slices/appUserDataSlice";
import messaging from "@react-native-firebase/messaging";
import { setFcmToken } from "../../../redux/slices/fcmTokenSlice";
import {
  setAppUsers,
  setAppUsersData,
} from "../../../redux/slices/appUserSlice";
import { useGetAppUsersDataMutation } from "../../apiServices/appUsers/AppUsersApi";
import Geolocation from "@react-native-community/geolocation";
import InternetModal from "../../components/modals/InternetModal";
import ErrorModal from "../../components/modals/ErrorModal";
import {
  setLocation,
  setLocationEnabled,
} from "../../../redux/slices/userLocationSlice";
import { useCheckVersionSupportMutation } from "../../apiServices/minVersion/minVersionApi";
import VersionCheck from "react-native-version-check";
import { useGetAppDashboardDataMutation } from "../../apiServices/dashboard/AppUserDashboardApi";
import { setDashboardData } from "../../../redux/slices/dashboardDataSlice";
import { useGetAppUserBannerDataMutation } from "../../apiServices/dashboard/AppUserBannerApi";
import { setBannerData } from "../../../redux/slices/dashboardDataSlice";
import { useGetWorkflowMutation } from "../../apiServices/workflow/GetWorkflowByTenant";
import {
  setProgram,
  setWorkflow,
  setIsGenuinityOnly,
} from "../../../redux/slices/appWorkflowSlice";
import { useGetFormMutation } from "../../apiServices/workflow/GetForms";
import {
  setWarrantyForm,
  setWarrantyFormId,
} from "../../../redux/slices/formSlice";
import { useFetchLegalsMutation } from "../../apiServices/fetchLegal/FetchLegalApi";
import { setPolicy, setTerms,setAbout,setDetails } from "../../../redux/slices/termsPolicySlice";
import { useGetAppMenuDataMutation } from "../../apiServices/dashboard/AppUserDashboardMenuAPi.js";
import { setDrawerData } from "../../../redux/slices/drawerDataSlice";
import * as Keychain from "react-native-keychain";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useInternetSpeedContext } from "../../Contexts/useInternetSpeedContext";
import { setSlowNetwork } from "../../../redux/slices/internetSlice";
import { apiFetchingInterval } from "../../utils/apiFetchingInterval";
import { clientName, splash } from "../../utils/HandleClientSetup";
import FastImage from "react-native-fast-image";
import { useTranslation } from "react-i18next";
import handleLocationPermissionAndFetch from "../../utils/handleLocationPermissionAndFetch";
import getCurrentLocation from "../../components/organisms/getCurrentLocation";
import { apiCachingLogic, storeData } from "../../utils/apiCachingLogic";
import { getAppThemeCachedDispatch } from "../../../redux/dispatches/getAppThemeCachedDispatch";
import { getPolicyDataCachedDispatch } from "../../../redux/dispatches/getPolicyDataCachedDispatch";
import { getWorkflowCachedDispatch } from "../../../redux/dispatches/getWorkflowCachedDispatch";
import { getFormCachedDispatch } from "../../../redux/dispatches/getFormCachedDispatch";
import { getBannerCachedDispatch } from "../../../redux/dispatches/getBannerCachedDispatch";
import { getAppmenuCachedDispatch } from "../../../redux/dispatches/getAppmenuCachedDispatch";
import { getDashboardCachedDispatch } from "../../../redux/dispatches/getDashboardCachedDispatch";
import { getTermsDataCachedDispatch } from "../../../redux/dispatches/getTermsDataCachedDispatch";
import { getUsersDataCachedDispatch } from "../../../redux/dispatches/getUsersDataCachedDispatch";
import store from "../../../redux/store";

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  const [sessionData, setSessionData] = useState();
  const [currentAppVersion, setCurrentAppVersion] = useState();
  const [connected, setConnected] = useState(true);
  const [isSlowInternet, setIsSlowInternet] = useState(false);
  const [locationStatusChecked, setLocationCheckVisited] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [message, setMessage] = useState();
  const [mpinData, setMpinData] = useState();
  const [minVersionSupport, setMinVersionSupport] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const { responseTime, loading } = useInternetSpeedContext();
  const apiCallStatus = useSelector((state) => state.splashApi.apiCallStatus);
  // const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null);
  // const [gotLoginData, setGotLoginData] = useState()
  const isConnected = useSelector((state) => state.internet.isConnected);
  const allApiArray = ["getAppThemeData", "getTermsData", "getPolicyData", "getWorkflowData", "getDashboardData", "getAppMenuData", "getFormData", "getBannerData", "getUsersData"]

  // const gifUri = Image.resolveAssetSource(
  //   require("../../../assets/gif/SplashMotherWood.png")
  // ).uri;
  // generating functions and constants for API use cases---------------------
  const [
    getAppTheme,
    {
      data: getAppThemeData,
      error: getAppThemeError,
      isLoading: getAppThemeIsLoading,
      isError: getAppThemeIsError,
    },
  ] = useGetAppThemeDataMutation();

  const [
    getWorkflowFunc,
    {
      data: getWorkflowData,
      error: getWorkflowError,
      isLoading: getWorkflowIsLoading,
      isError: getWorkflowIsError,
    },
  ] = useGetWorkflowMutation();

  const [
    getFormFunc,
    {
      data: getFormData,
      error: getFormError,
      isLoading: getFormIsLoading,
      isError: getFormIsError,
    },
  ] = useGetFormMutation();

  const [
    getBannerFunc,
    {
      data: getBannerData,
      error: getBannerError,
      isLoading: getBannerIsLoading,
      isError: getBannerIsError,
    },
  ] = useGetAppUserBannerDataMutation();

  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();

  const [
    getAppMenuFunc,
    {
      data: getAppMenuData,
      error: getAppMenuError,
      isLoading: getAppMenuIsLoading,
      isError: getAppMenuIsError,
    },
  ] = useGetAppMenuDataMutation();

  const [
    getDashboardFunc,
    {
      data: getDashboardData,
      error: getDashboardError,
      isLoading: getDashboardIsLoading,
      isError: getDashboardIsError,
    },
  ] = useGetAppDashboardDataMutation();

  const [
    getTermsAndCondition,
    {
      data: getTermsData,
      error: getTermsError,
      isLoading: termsLoading,
      isError: termsIsError,
    },
  ] = useFetchLegalsMutation();

  const [
    getAboutMotherwoodFunc,
    {
      data: getAboutMotherwoodData,
      error: getAboutMotherwoodError,
      isLoading: getAboutMotherwoodIsLoading,
      isError: getAboutMotherwoodIsError,
    },
  ] = useFetchLegalsMutation();

  const [
    getDetailsFunc,
    {
      data: getDetailsData,
      error: getDetailsError,
      isLoading: getDetailsIsLoading,
      isError: getDetailsIsError,
    },
  ] = useFetchLegalsMutation();

  

  const [
    getMinVersionSupportFunc,
    {
      data: getMinVersionSupportData,
      error: getMinVersionSupportError,
      isLoading: getMinVersionSupportIsLoading,
      isError: getMinVersionSupportIsError,
    },
  ] = useCheckVersionSupportMutation();

  const [
    getPolicies,
    {
      data: getPolicyData,
      error: getPolicyError,
      isLoading: policyLoading,
      isError: policyIsError,
    },
  ] = useFetchLegalsMutation();

  // fetching session data if exists and dispatching it for further use
  useEffect(() => {
    const getSessionData = async () => {
      const loginData = await AsyncStorage.getItem("loginData");
      const parsedLoginData = JSON.parse(loginData);
      console.log("setSessionDataparsedLoginData",parsedLoginData)
      setSessionData(parsedLoginData);
      if((parsedLoginData.user_type).toLowerCase() == 'contractor' || (parsedLoginData.user_type).toLowerCase() == 'carpenter' || (parsedLoginData.user_type).toLowerCase() == 'oem' || (parsedLoginData.user_type).toLowerCase() == 'directoem')
      {
        console.log("dispatching new user themes according to user types")
        dispatch(setTernaryThemeColor("#F0F8F6"))
        dispatch(setSecondaryThemeColor("#00A79D"))
      }
      dispatch(setAppUserId(parsedLoginData.user_type_id));
      dispatch(setAppUserName(parsedLoginData.name));
      dispatch(setAppUserType(parsedLoginData.user_type));
      dispatch(setUserData(parsedLoginData));
      dispatch(setId(parsedLoginData.id));
    };
    getSessionData();
  }, []);
  //------------------------------------

  //fetching current version data
  useEffect(() => {
    const currentVersion = VersionCheck.getCurrentVersion();
    setCurrentAppVersion(currentVersion);
    console.log("current version check", currentVersion);
    dispatch(setAppVersion(currentVersion));
  }, []);
  //-------------------------------

  // getting MPIN data from session storage
  useEffect(() => {
    const getData = async () => {
      let mPin = await AsyncStorage.getItem("userMpin");
      console.log("mpin data",mPin)
      setMpinData(mPin);
    };
    getData();
  }, []);
  //----------------------------------------------

  // calling open api for minimum version support, terms and condition, policies
  useEffect(() => {
    if (currentAppVersion) {
      const asyncFunc = async () => {
        console.log(
          "currentVersiongetMinVersionSupportFunc",
          currentAppVersion,
          await apiCachingLogic("getAppThemeData")
        );
        if ((await apiCachingLogic("getAppThemeData")) != null) {
          getAppThemeCachedDispatch(
            dispatch,
            await apiCachingLogic("getAppThemeData")
          );
          storeData("getAppThemeData",await apiCachingLogic("getAppThemeData"))

        } else {
          getAppTheme(clientName);
        }

        getMinVersionSupportFunc(String(currentAppVersion));

        const fetchTerms = async () => {
          const params = {
            type: "term-and-condition",
          };
          getTermsAndCondition(params);
        };
        if ((await apiCachingLogic("getTermsData")) != null) {
          getTermsDataCachedDispatch(
            dispatch,
            await apiCachingLogic("getTermsData")
          );
          storeData("getTermsData",await apiCachingLogic("getTermsData"))

        } else {
          fetchTerms();
        }

        const fetchPolicies = async () => {
          const params = {
            type: "privacy-policy",
          };
          getPolicies(params);
        };
        console.log("policy async", await apiCachingLogic("getPolicyData"))
        if ((await apiCachingLogic("getPolicyData")) != null) {
          
          getPolicyDataCachedDispatch(
            dispatch,
            await apiCachingLogic("getPolicyData")
          );
          storeData("getPolicyData",await apiCachingLogic("getPolicyData"))
        } else {
          fetchPolicies();
        }


        const fetchAbout = async () => {
          const params = {
            type: "about",
          };
          getAboutMotherwoodFunc(params);
        };
        fetchAbout()

        const fetchDetails = async () => {
          const params = {
            type: "details",
          };
          getDetailsFunc(params);
        };
        fetchDetails()
      };
      asyncFunc();
    }
  }, [currentAppVersion]);

  //-------------------------------------------------

  // Calling the api when previous session exists(protected api)
  useEffect(() => {
    if (sessionData != null || sessionData != undefined) {
      console.log("sessiondata is present",sessionData)
      const getWorkflow = async () => {
        if ((await apiCachingLogic("getWorkflowData")) != null) {
          getWorkflowCachedDispatch(
            dispatch,
            await apiCachingLogic("getWorkflowData")
          );
          storeData("getWorkflowData",await apiCachingLogic("getWorkflowData"))

        } else {
          getWorkflowFunc({
            userId: sessionData?.user_type_id,
            token: sessionData?.token,
          });
        }
      };
      getWorkflow();

      const getForm = async () => {
        const form_type = "2";

        if ((await apiCachingLogic("getFormData")) != null) {
          getFormCachedDispatch(dispatch, await apiCachingLogic("getFormData"));
          storeData("getFormData",await apiCachingLogic("getFormData"))

        } else {
          getFormFunc({ form_type: form_type, token: sessionData?.token });
        }
      };
      getForm();

      const getBanner = async () => {
        if ((await apiCachingLogic("getBannerData")) != null) {
          getBannerCachedDispatch(
            dispatch,
            await apiCachingLogic("getBannerData")
          );
          storeData("getBannerData",await apiCachingLogic("getBannerData"))

        } else {
          getBannerFunc(sessionData?.token);
        }
      };
      getBanner();

      const getUser = async () => {
        console.log("await apiCachingLogic", await apiCachingLogic("getUsersData"))
        if ((await apiCachingLogic("getUsersData")) != null) {
          getUsersDataCachedDispatch(
            dispatch,
            await apiCachingLogic("getUsersData")
          );
          storeData("getUsersData",await apiCachingLogic("getUsersData"))

        } else {
          getUsers();
        }
      };
      getUser();

      const getMenu = async () => {
        if ((await apiCachingLogic("getAppMenuData")) != null) {
          getAppmenuCachedDispatch(
            sessionData,
            dispatch,
            await apiCachingLogic("getAppMenuData")
          );
          storeData("getAppMenuData",await apiCachingLogic("getAppMenuData"))

        } else {
          getAppMenuFunc(sessionData?.token);
        }
      };
      getMenu();

      const getDashboard = async () => {
        if ((await apiCachingLogic("getDashboardData")) != null) {
          getDashboardCachedDispatch(
            dispatch,
            await apiCachingLogic("getDashboardData")
          );
          storeData("getDashboardData",await apiCachingLogic("getDashboardData"))

        } else {
          getDashboardFunc(sessionData?.token);
        }
      };
      getDashboard();
    }
  }, [sessionData]);
  //--------------------------------------------------

  // navigating to respective screens
  useEffect(() => {
    let fallbackTimer;
    console.log("session data", sessionData)
  
    if (sessionData) {
      const allApisComplete = areAllApisComplete(apiCallStatus, allApiArray);
  
      if (allApisComplete) {
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      } else {
        fallbackTimer = setTimeout(() => {
          const missingApis = allApiArray.filter(api => !apiCallStatus?.includes(api));
          console.log("Timeout: Missing APIs:", missingApis);
  
          navigation.reset({ index: 0, routes: [{ name: "SelectUser" }] });
        }, 4000); // wait for all async calls (4 sec)
      }
    }
    else{
      fallbackTimer = setTimeout(() => {
        const missingApis = allApiArray.filter(api => !apiCallStatus?.includes(api));
        console.log("Timeout: Missing APIs:", missingApis);

        navigation.reset({ index: 0, routes: [{ name: "SelectUser" }] });
      }, 4000); // wait for all async calls (4 sec)
    }
  
    return () => clearTimeout(fallbackTimer);
  }, [apiCallStatus, sessionData]);
  

  
  useEffect(() => {
    if (getTermsData) {
      // console.log("getTermsData", getTermsData.body.data?.[0]?.files[0]);
      storeData("getTermsData", getTermsData);
      getTermsDataCachedDispatch(dispatch, getTermsData);
    } else if (getTermsError) {
      // console.log("gettermserror", getTermsError)
    }
  }, [getTermsData, getTermsError]);

  useEffect(() => {
    if (getAboutMotherwoodData) {
      console.log("getAboutMotherwoodData", getAboutMotherwoodData.body.data?.[0]?.files[0]);
      dispatch(setAbout(getAboutMotherwoodData.body.data?.[0]?.files[0]))
    } else if (getAboutMotherwoodError) {
      console.log("getAboutMotherwoodError", getAboutMotherwoodError)
    }
  }, [getAboutMotherwoodData, getAboutMotherwoodError]);

  useEffect(() => {
    if (getDetailsData) {
      console.log("getDetailsData", getDetailsData.body.data?.[0]?.files[0]);
      dispatch(setDetails(getDetailsData.body.data?.[0]?.files[0]))
    } else if (getDetailsError) {
      console.log("getDetailsError", getDetailsError)
    }
  }, [getDetailsData, getDetailsError]);

  // removing session data in case of session expired
  const removerTokenData = async () => {
    await AsyncStorage.removeItem("loginData").then(() => {
      navigation.navigate("SelectUser");
      setShowLoading(false);
    });
  };
  //--------------------------------------------

  // fetching dashboard data and storing it to redux store
  useEffect(() => {
    if (getDashboardData) {
      console.log("getDashboardData", getDashboardData);
      getDashboardCachedDispatch(dispatch, getDashboardData);
      storeData("getDashboardData", getDashboardData);
    } else if (getDashboardError) {
      console.log("getDashboardError", getDashboardError);
      if (getDashboardError?.status == 401) {
        removerTokenData();
      }
    }
  }, [getDashboardData, getDashboardError]);
  //------------------------------------------------------

  // getting app menu data and saving it in redux store
  useEffect(() => {
    if (getAppMenuData) {
      console.log("getAppMenuData", JSON.stringify(getAppMenuData));
      getAppmenuCachedDispatch(dispatch, getAppMenuData);
      storeData("getAppMenuData", getAppMenuData);
    } else if (getAppMenuError) {
      console.log("getAppMenuError", getAppMenuError);
    }
  }, [getAppMenuData, getAppMenuError]);
  //---------------------------------------------------

  // getting policy data and saving it in redux store
  useEffect(() => {
    if (getPolicyData) {
      console.log("getPolicyData hello",getPolicyData)
      getPolicyDataCachedDispatch(dispatch, getPolicyData);
      storeData("getPolicyData", getPolicyData);
    } else if (getPolicyError) {
      setError(true);
      setMessage(getPolicyError?.message);
      console.log("getPolicyError>>>>>>>>>>>>>>>", getPolicyError);
      if (getPolicyError?.status == 401) {
        removerTokenData();
      }
    }
  }, [getPolicyData, getPolicyError]);
  //--------------------------------------------------

  // getting form data from api and saving it in redux store
  useEffect(() => {
    if (getFormData) {
      console.log("getFormData", getFormData?.body);
      getFormCachedDispatch(dispatch, getFormData)
      storeData("getFormData", getFormData)
    } else if (getFormError) {
      console.log("getFormError", getFormError);
      setError(true);
      setMessage("Can't fetch forms for warranty.");
    }
  }, [getFormData, getFormError]);
  //---------------------------------------------------------

  // getting workflow data from api and saving it in redux store
  useEffect(() => {
    if (getWorkflowData) {
      storeData("getWorkflowData", getWorkflowData);
      getWorkflowCachedDispatch(dispatch, getWorkflowData);
    } else if (getWorkflowError) {
      console.log("getWorkflowError", getWorkflowError);
      setError(true);
      setMessage("Oops something went wrong");
      if (getWorkflowError?.status == 401) {
        removerTokenData();
      }
    }
  }, [getWorkflowData, getWorkflowError]);
  //-------------------------------------------------------------------

  //getting banner data from api and saving it in redux store
  useEffect(() => {
    if (getBannerData) {
      console.log("getBannerData", getBannerData?.body);
      getBannerCachedDispatch(dispatch, getBannerData);
      storeData("getBannerData", getBannerData);
      setShowLoading(false);
    } else if (getBannerError) {
      setError(true);
      setMessage("Unable to fetch app banners");
      console.log("getBannerError", getBannerError);
      if (getBannerError?.status == 401) {
        removerTokenData();
      }
    }
  }, [getBannerError, getBannerData]);
  //----------------------------------------------------------

  // handling back press on splash screen
  useEffect(() => {
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
      backHandler.remove(); // Clean up the listener
    };
  }, []);
  //--------------------------------------------------

  // fetching location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationData = await handleLocationPermissionAndFetch();
        if (locationData) {
          console.log("Fetched Location Data:", locationData);
          // Proceed with location data
        } else {
          console.log("Location fetch failed or permission denied");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, []);
  //-------------------------------------------------------

  // fetching fcm token for notifications and requesting location permisions
  useEffect(() => {
    console.log(clientName);
    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      console.log("fcmToken", fcmToken);
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
      }
    };
    checkToken();
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Geolocation Permission",
              message: "Can we access your location?",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === "granted") {
            return true;
          } else {
            return false;
          }
        } else {
          Geolocation.requestAuthorization();
        }
      } catch (err) {
        return false;
      }
    };
    requestLocationPermission();
    dispatch({ type: "NETWORK_REQUEST" });
  }, []);
  //--------------------------------------------------------

  // handling response from minimumVersionApi
  useEffect(() => {
    if (getMinVersionSupportData) {
      console.log("getMinVersionSupportData", getMinVersionSupportData);
      if (getMinVersionSupportData.success) {
        setMinVersionSupport(getMinVersionSupportData?.body?.data);
        if (!getMinVersionSupportData?.body?.data) {
          Alert.alert(
            t("Kindly update the app to the latest version"),
            t("Your version of app is not supported anymore, kindly update"),
            [
              {
                text: t("Update"),
                onPress: () =>
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.genefied.motherwood"
                  ),
              },
            ]
          );
        }
      } else {
        if (Object.keys(getMinVersionSupportData?.body)?.length == 0) {
          Alert.alert(
            t("Kindly update the app to the latest version"),
            t("Your version of app is not supported anymore, kindly update"),
            [
              {
                text: "Update",
                onPress: () =>
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.genefied.motherwood"
                  ),
              },
            ]
          );
        }
      }
    } else if (getMinVersionSupportError) {
      console.log("getMinVersionSupportError", getMinVersionSupportError);
      Alert.alert(
        t("Error"),
        t("An error occurred while fetching minimum version support."),
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }, [getMinVersionSupportData, getMinVersionSupportError]);
  //-----------------------------------------------------------

  // checking internet status
  useEffect(() => {
    console.log("internet status", isConnected);
    setConnected(isConnected.isInternetReachable);

    dispatch(setAppVersion(currentAppVersion));
  }, [isConnected, locationStatusChecked]);
  //------------------------------------------------------------

  // getting userdata and saving it in redux store

  useEffect(() => {
    if (getUsersData) {
      getUsersDataCachedDispatch(dispatch, getUsersData);
      storeData("getUsersData", getUsersData);
    } else if (getUsersError) {
      console.log("getUsersError", getUsersError);
    }
  }, [getUsersData, getUsersError]);
  //-----------------------------------------------------

  // calling API to fetch themes for the app

  useEffect(() => {
    if (getAppThemeData) {
      console.log("getAppThemeData", JSON.stringify(getAppThemeData?.body));
      storeData("getAppThemeData", getAppThemeData);
      getAppThemeCachedDispatch(dispatch, getAppThemeData, sessionData);
    } else if (getAppThemeError) {
      console.log("getAppThemeError", getAppThemeError)
    }
  }, [getAppThemeData, getAppThemeError]);

  // checking response time from google api

  // checking for slow internet
  useEffect(() => {
    console.log("responseTime", responseTime);
    if (responseTime > 4000) {
      setIsSlowInternet(true);
    }
    if (responseTime < 4000) {
      setIsSlowInternet(false);
    }
  }, [responseTime, connected]);
  //---------------------------------------
  const areAllApisComplete = (apiCallStatus, allApiArray) => {
    return allApiArray.every(api => apiCallStatus?.includes(api));
  };

  const modalClose = () => {
    setError(false);
  };
  const NoInternetComp = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "90%",
          zIndex: 1,
        }}
      >
        <Text style={{ color: "black" }}>No Internet Connection</Text>
        <Text style={{ color: "black" }}>
          Please check your internet connection and try again.
        </Text>
      </View>
    );
  };
  const SlowInternetComp = () => {
    return (
      <View
        style={{ alignItems: "center", justifyContent: "center", width: "90%" }}
      >
        {/* <FastImage
          style={{ width: "100%", height: "100%", alignSelf: "center" }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        /> */}
      </View>
    );
  };

  return (
    <ImageBackground style={{flex:1,}} source={require('../../../assets/images/SplashMotherWood.png')}>
      {/* <FastImage
        style={{ width: "100%", height: "100%", alignSelf: "center" }}
        source={{
          uri: gifUri, // Update the path to your GIF
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
      {console.log("isSlow", isConnected.isInternetReachable)}
      {!connected && (
        <InternetModal visible={!connected} comp={NoInternetComp} />
      )}

      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {/* <Image  style={{ width: 200, height: 200,  }}  source={require('../../../assets/gif/ozonegif.gif')} /> */}
      {
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 10,
          }}
        >
          <View style={{ position: "absolute", bottom: 60, height: 40 }}>
            <View></View>
            <ActivityIndicator
              size={"medium"}
              animating={true}
              color={MD2Colors.yellow800}
            />
            <PoppinsTextMedium
              style={{
                color: "white",
                marginTop: 4,
                fontWeight: "800",
                fontSize: 20,
              }}
              content="Please Wait"
            ></PoppinsTextMedium>
          </View>
        </View>
      }
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default Splash;
