import React, { useCallback, useEffect, useId, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import TextInputRectangle from "../../components/atoms/input/TextInputRectangle";
import TextInputNumericRectangle from "../../components/atoms/input/TextInputNumericRectangle";
import InputDate from "../../components/atoms/input/InputDate";
import ImageInput from "../../components/atoms/input/ImageInput";
import MessageModal from "../../components/modals/MessageModal";
import {
  useGetFormAccordingToAppUserTypeMutation,
  useGetFormMutation,
} from "../../apiServices/workflow/GetForms";
import ButtonOval from "../../components/atoms/buttons/ButtonOval";
import {
  useRegisterUserByBodyMutation,
} from "../../apiServices/register/UserRegisterApi";
import TextInputAadhar from "../../components/atoms/input/TextInputAadhar";
import TextInputPan from "../../components/atoms/input/TextInputPan";
import TextInputGST from "../../components/atoms/input/TextInputGST";
import ErrorModal from "../../components/modals/ErrorModal";
import Geolocation from "@react-native-community/geolocation";
import PrefilledTextInput from "../../components/atoms/input/PrefilledTextInput";
import PincodeTextInput from "../../components/atoms/input/PincodeTextInput";
import OtpInput from "../../components/organisms/OtpInput";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useGetLoginOtpForVerificationMutation } from "../../apiServices/otp/GetOtpApi";
import { useVerifyOtpForNormalUseMutation } from "../../apiServices/otp/VerifyOtpForNormalUseApi";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";
import EmailTextInput from "../../components/atoms/input/EmailTextInput";
import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { GoogleMapsKey } from "@env";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownForDistributor from "../../components/atoms/dropdown/DropDownForDistributor";
import { useFetchLegalsMutation } from "../../apiServices/fetchLegal/FetchLegalApi";
import { useGetAppMenuDataMutation } from "../../apiServices/dashboard/AppUserDashboardMenuAPi.js";
import { useGetAppUserBannerDataMutation } from "../../apiServices/dashboard/AppUserBannerApi";
import { useGetAppDashboardDataMutation } from "../../apiServices/dashboard/AppUserDashboardApi";
import { useGetWorkflowMutation } from "../../apiServices/workflow/GetWorkflowByTenant";
import { getTermsDataCachedDispatch } from "../../../redux/dispatches/getTermsDataCachedDispatch";
import { getDashboardCachedDispatch } from "../../../redux/dispatches/getDashboardCachedDispatch";
import { getAppmenuCachedDispatch } from "../../../redux/dispatches/getAppmenuCachedDispatch";
import { getPolicyDataCachedDispatch } from "../../../redux/dispatches/getPolicyDataCachedDispatch";
import { getFormCachedDispatch } from "../../../redux/dispatches/getFormCachedDispatch";
import { getWorkflowCachedDispatch } from "../../../redux/dispatches/getWorkflowCachedDispatch";
import { getBannerCachedDispatch } from "../../../redux/dispatches/getBannerCachedDispatch";
import { storeData } from "../../utils/apiCachingLogic";
import { useGetAppUsersDataMutation } from "../../apiServices/appUsers/AppUsersApi";
import { getUsersDataCachedDispatch } from "../../../redux/dispatches/getUsersDataCachedDispatch";
import { setUserData } from "../../../redux/slices/appUserDataSlice";


const BasicInfo = ({ navigation, route }) => {
  const [userName, setUserName] = useState();
  const [userMobile, setUserMobile] = useState(route.params.mobile);
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [registrationForm, setRegistrationForm] = useState([]);
  const [responseArray, setResponseArray] = useState([]);
  const [isManuallyApproved, setIsManuallyApproved] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [needsAadharVerification, setNeedsAadharVerification] = useState(false);
  const [location, setLocation] = useState();
  const [formFound, setFormFound] = useState(true);
  const [isCorrectPincode, setIsCorrectPincode] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [hideButton, setHideButton] = useState(false);
  const [timer, setTimer] = useState(0);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarEntered, setAadhaarEntered] = useState(false);
  const [aadhaarRequired, setAadhaarRequired] = useState(false);
  const [pansVerified, setPansVerified] = useState(true);
  const [panEntered, setPanEntered] = useState(false);
  const [panRequired, setPanRequired] = useState(false);
  const [mappedUserType, setMappedUserType] = useState();
  const [gstVerified, setGstVerified] = useState(true);
  const [gstEntered, setGstEntered] = useState(false);
  const [formStage, setFormStage] = useState(1);
  const [gstinRequired, setGstinRequired] = useState(false);
  const [distributorName, setDistributorName] = useState("");
  const [distributorMobile, setDistributorMobile] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [mappedUserData, setMappedUserData] = useState();
  const [showDistributorInput, setShowDistributorInput] = useState(false);
  const [mobileVerified, setMobileVerified] = useState();
  const [token, setToken] = useState()
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );
  const focused = useIsFocused();
  let showSubmit = true;

  const dispatch = useDispatch();

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
    ? useSelector((state) => state.apptheme.secondaryThemeColor)
    : "#FFB533";
  const isOnlineVerification = useSelector(
    (state) => state.apptheme.isOnlineVerification
  );
  const userData = useSelector((state) => state.appusersdata.userData);
  const appUsers = useSelector((state) => state.appusers.value);
  const manualApproval = useSelector((state) => state.appusers.manualApproval);
  const appVersion = useSelector((state) => state.appusers.app_version);
  const userType = route.params.user_type;
  const userTypeId = route.params.user_type_id;
  const needsApproval = route.params.needsApproval;
  const navigatingFrom = route.params.navigatingFrom;
  const registrationRequired = route.params.registrationRequired;
  console.log(
    "registration required basic info",
    registrationRequired,
    navigatingFrom
  );
  const navigationParams = route.params;
  // const navigationParams = { "needsApproval": needsApproval, "userId": userTypeId, "user_type": userType, "mobile": mobile, "name": name, "registrationRequired":registrationRequired}
  // const navigationParams = { "needsApproval": needsApproval, "userId": userTypeId, "userType": userType, "registrationRequired":registrationRequired}
  console.log("navigation params from basic info", navigationParams);
  const name = route.params?.name;
  const mobile = route.params?.mobile;
  console.log(
    "appUsers",
    userType,
    userTypeId,
    isManuallyApproved,
    name,
    mobile
  );
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const locationStage = ["city", "state", "district", "pincode", "address1"];
  const { t } = useTranslation();
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;
  const progressStage = ["details", "address"];
  const isLocationStageField = (fieldName) => {
    return locationStage.includes(fieldName.trim().toLowerCase());
  };
  let timeoutId;
  let preferedLanguage;

  //unprotected routes
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
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();

  const [
    getPolicies,
    {
      data: getPolicyData,
      error: getPolicyError,
      isLoading: policyLoading,
      isError: policyIsError,
    },
  ] = useFetchLegalsMutation();

  const [
    registerUserFunc,
    {
      data: registerUserData,
      error: registerUserError,
      isLoading: registerUserIsLoading,
      isError: registerUserIsError,
    },
  ] = useRegisterUserByBodyMutation();

  const [
    getFormFunc,
    {
      data: getFormData,
      error: getFormError,
      isLoading: getFormIsLoading,
      isError: getFormIsError,
    },
  ] = useGetFormAccordingToAppUserTypeMutation();

  // send otp for login--------------------------------
  const [
    sendOtpFunc,
    {
      data: sendOtpData,
      error: sendOtpError,
      isLoading: sendOtpIsLoading,
      isError: sendOtpIsError,
    },
  ] = useGetLoginOtpForVerificationMutation();

  const [
    verifyOtpFunc,
    {
      data: verifyOtpData,
      error: verifyOtpError,
      isLoading: verifyOtpIsLoading,
      isError: verifyOtpIsError,
    },
  ] = useVerifyOtpForNormalUseMutation();

  //--------------------------------

  //protected routes --------------------------
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
    getBannerFunc,
    {
      data: getBannerData,
      error: getBannerError,
      isLoading: getBannerIsLoading,
      isError: getBannerIsError,
    },
  ] = useGetAppUserBannerDataMutation();

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
    getWorkflowFunc,
    {
      data: getWorkflowData,
      error: getWorkflowError,
      isLoading: getWorkflowIsLoading,
      isError: getWorkflowIsError,
    },
  ] = useGetWorkflowMutation();

  const [
    getFormProtFunc,
    {
      data: getFormProtData,
      error: getFormProtError,
      isLoading: getFormProtIsLoading,
      isError: getFormProtIsError,
    },
  ] = useGetFormMutation();

  useEffect(() => {
    if (timer > 0) {
      timeoutId = setTimeout(timeOutCallback, 1000);
    }
    if (otpVerified) {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [timer, timeOutCallback, otpVerified]);

  useEffect(() => {
    if (getUsersData) {
      console.log("getUsersData", getUsersData);

      getUsersDataCachedDispatch(dispatch, getUsersData);
      storeData("getUsersData", getUsersData);
    } else if (getUsersError) {
      console.log("getUsersError", getUsersError);
    }
  }, [getUsersData, getUsersError]);

  useEffect(() => {
    if (getFormProtData) {
      // console.log("Form Fields", getFormProtData?.body)
      getFormCachedDispatch(dispatch, getFormProtData);
      storeData("getFormData", getFormProtData);
    } else if (getFormProtError) {
      console.log("getFormProtError", getFormProtError);
      setError(true);
      setMessage("Can't fetch forms for warranty.");
    }
  }, [getFormProtData, getFormProtError]);

  useEffect(() => {
    if (getWorkflowData) {
      storeData("getWorkflowData", getWorkflowData);
      getWorkflowCachedDispatch(dispatch, getWorkflowData);
    } else if (getWorkflowError) {
      console.log("getWorkflowError", getWorkflowError);
      setError(true);
      setMessage("Oops something went wrong");
    }
  }, [getWorkflowData, getWorkflowError]);

  useEffect(() => {
    if (getDashboardData) {
      getDashboardCachedDispatch(dispatch, getDashboardData);
      storeData("getDashboardData", getDashboardData);
    } else if (getDashboardError) {
      setError(true);
      setMessage("Can't get dashboard data, kindly retry.");
      console.log("getDashboardError", getDashboardError);
    }
  }, [getDashboardData, getDashboardError]);

  useEffect(() => {
    if (getBannerData) {
      // console.log("getBannerData", getBannerData?.body)
      getBannerCachedDispatch(dispatch, getBannerData);
      storeData("getBannerData", getBannerData);
    } else if (getBannerError) {
      setError(true);
      setMessage("Unable to fetch app banners");
      console.log("getBannerError", getBannerError);
    }
  }, [getBannerError, getBannerData]);

  useEffect(() => {
    const fetchTerms = async () => {
      // const credentials = await Keychain.getGenericPassword();
      // const token = credentials.username;
      const params = {
        type: "term-and-condition",
      };
      getTermsAndCondition(params);
    };
    fetchTerms();

    const fetchPolicies = async () => {
      // const credentials = await Keychain.getGenericPassword();
      // const token = credentials.username;
      const params = {
        type: "privacy-policy",
      };
      getPolicies(params);
    };
    fetchPolicies();

    getUsers();

  }, []);

  useEffect(() => {
    if (getAppMenuData) {
      // console.log("usertype", userData.user_type)
      console.log("getAppMenuData", JSON.stringify(getAppMenuData));
      getAppmenuCachedDispatch(navigationParams, dispatch, getAppMenuData);
      storeData("getAppMenuData", getAppMenuData);
    } else if (getAppMenuError) {
      console.log("getAppMenuError", getAppMenuError);
    }
  }, [getAppMenuData, getAppMenuError]);

  useEffect(() => {
    if (getTermsData) {
      // console.log("getTermsData", getTermsData.body.data?.[0]?.files[0]);
      storeData("getTermsData", getTermsData);
      getTermsDataCachedDispatch(dispatch, getTermsData);
    } else if (getTermsError) {
      console.log("gettermserror", getTermsError);
    }
  }, [getTermsData, getTermsError]);


  useEffect(()=>{


    if(token)
    {
    console.log("inside useEffect ashdashdvas", token)

      getAppMenuFunc(token);
      getBannerFunc(token)
      getDashboardFunc(token)
      getWorkflowFunc({
        userId: userTypeId,
        token: token,
      });
      const form_type = "2";
      getFormProtFunc({ form_type: form_type, token: token });
    }
    
  },[token])

  useEffect(() => {
    if (getPolicyData) {
      console.log("getPolicyData123>>>>>>>>>>>>>>>>>>>", getPolicyData);
      getPolicyDataCachedDispatch(dispatch, getPolicyData);
      storeData("getPolicyData", getPolicyData);
    } else if (getPolicyError) {
      setError(true);
      setMessage(getPolicyError?.message);
      console.log("getPolicyError>>>>>>>>>>>>>>>", getPolicyError);
    }
  }, [getPolicyData, getPolicyError]);

  useEffect(() => {
    console.log(
      "mobile number from use effect",
      route.params.mobile,
      navigatingFrom
    );
    setUserMobile(route.params.mobile);
  }, [route.params.mobile]);

  useEffect(() => {
    const AppUserType = userType;
    getFormFunc({ AppUserType });
    if (manualApproval.includes(userType)) {
      setIsManuallyApproved(true);
    } else {
      setIsManuallyApproved(false);
    }
  }, []);

  useEffect(() => {
    setHideButton(false);
  }, [focused]);

  useEffect(() => {
    if (verifyOtpData?.success) {
      setOtpVerified(true);
      setOtpModal(true);
      console.log("verifyOtp", verifyOtpData);
      setMessage(t("OTP verified"));
    } else if (verifyOtpError) {
      console.log("verifyOtpError", verifyOtpError);
      setError(true);
      setMessage(t("Please Enter Correct OTP"));
    }
  }, [verifyOtpData, verifyOtpError]);

  useEffect(() => {
    let lat = "";
    let lon = "";
    Geolocation.getCurrentPosition((res) => {
      console.log("res", res);
      lat = res.coords.latitude;
      lon = res.coords.longitude;
      // getLocation(JSON.stringify(lat),JSON.stringify(lon))
      console.log("latlong", lat, lon);
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.coords.latitude},${res.coords.longitude}
        &location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          console.log("location address=>", JSON.stringify(json));
          const formattedAddress = json.results[0].formatted_address;
          const formattedAddressArray = formattedAddress?.split(",");

          let locationJson = {
            lat:
              json.results[0].geometry.location.lat === undefined
                ? "N/A"
                : json.results[0].geometry.location.lat,
            lon:
              json.results[0].geometry.location.lng === undefined
                ? "N/A"
                : json.results[0].geometry.location.lng,
            address: formattedAddress === undefined ? "N/A" : formattedAddress,
          };

          const addressComponent = json.results[0].address_components;
          console.log("addressComponent", addressComponent);
          for (let i = 0; i <= addressComponent.length; i++) {
            if (i === addressComponent.length) {
              dispatch(setLocation(locationJson));
              setLocation(locationJson);
            } else {
              if (addressComponent[i].types.includes("postal_code")) {
                console.log("inside if");

                console.log(addressComponent[i].long_name);
                locationJson["postcode"] = addressComponent[i].long_name;
              } else if (addressComponent[i].types.includes("country")) {
                console.log(addressComponent[i].long_name);

                locationJson["country"] = addressComponent[i].long_name;
              } else if (
                addressComponent[i].types.includes(
                  "administrative_area_level_1"
                )
              ) {
                console.log(addressComponent[i].long_name);

                locationJson["state"] = addressComponent[i].long_name;
              } else if (
                addressComponent[i].types.includes(
                  "administrative_area_level_3"
                )
              ) {
                console.log(addressComponent[i].long_name);

                locationJson["district"] = addressComponent[i].long_name;
              } else if (addressComponent[i].types.includes("locality")) {
                console.log(addressComponent[i].long_name);

                locationJson["city"] = addressComponent[i].long_name;
              }
            }
          }

          console.log("formattedAddressArray", locationJson);
        });
    });
  }, []);
  // useEffect(() => {
  //   if (getLocationFormPincodeData) {
  //     console.log("getLocationFormPincodeData", getLocationFormPincodeData)
  //     if (getLocationFormPincodeData.success) {
  //       const address = getLocationFormPincodeData.body[0].office + ", " + getLocationFormPincodeData.body[0].district + ", " + getLocationFormPincodeData.body[0].state + ", " + getLocationFormPincodeData.body[0].pincode
  //       let locationJson = {

  //         lat: "N/A",
  //         lon: "N/A",
  //         address: address,
  //         city: getLocationFormPincodeData.body[0].district,
  //         district: getLocationFormPincodeData.body[0].division,
  //         state: getLocationFormPincodeData.body[0].state,
  //         country: "N/A",
  //         postcode: getLocationFormPincodeData.body[0].pincode

  //       }
  //       console.log("getLocationFormPincodeDataLocationJson",locationJson)
  //       setLocation(locationJson)
  //     }
  //   }
  //   else if (getLocationFormPincodeError) {
  //     console.log("getLocationFormPincodeError", getLocationFormPincodeError)
  //     setError(true)
  //     setMessage(getLocationFormPincodeError.data.message)
  //   }
  // }, [getLocationFormPincodeData, getLocationFormPincodeError])

  useEffect(() => {
    if (getFormData) {
      console.log("Form Fields", JSON.stringify(getFormData));

      if (getFormData.message !== "Not Found") {
        const values = Object.values(getFormData.body.template);
        setRegistrationForm(values);
        console.log("values values are bering printed", values.length);
        if (values)
          for (let i = 0; i < values; i++) {
            console.log("form values are being printed", values[i]);
            if (values[i].label == "Aadhaar" && values[i].required) {
              setAadhaarRequired(true);
            }
            if (values[i].label == "Pan" && values[i].required) {
              setPanRequired(true);
            }
            if (values[i].label == "Gstin" && values[i].required) {
              setGstinRequired(true);
            }
          }
      } else {
        setError(true);
        setMessage("Form can't be fetched");
        setFormFound(false);
      }
    } else if (getFormError) {
      console.log("Form Field Error", getFormError);
    }
  }, [getFormData, getFormError]);

  useEffect(() => {
    if (registerUserData) {
      console.log(
        "data after submitting form",
        registerUserData,
        
      );
      if (registerUserData.success) {
        setToken(registerUserData?.body?.token)
        setSuccess(true);
        setMessage(t("Thank you for joining Motherwood Loyalty program"));
        setModalTitle(t("Greetings"));
        dispatch(setUserData(registerUserData?.body));

      }
      setHideButton(false);

      // const values = Object.values(registerUserData.body.template)
      // setRegistrationForm(values)
    } else if (registerUserError) {
      console.log("form submission error", registerUserError);
      setError(true);
      setMessage(registerUserError.data.message);
      setHideButton(false);
    }
  }, [registerUserData, registerUserError]);

  
  useEffect(() => {
    if (sendOtpData) {
      console.log("sendOtpData", sendOtpData);
      setOtpVisible(true);
    } else {
      console.log("sendOtpError", sendOtpError);
    }
  }, [sendOtpData, sendOtpError]);

  const handleTimer = () => {
    if (userName.length != 0) {
      if (userMobile) {
        if (userMobile.length == 10) {
          if (timer === 60) {
            getOTPfunc();
            setOtpVisible(true);
          }
          if (timer === 0 || timer === -1) {
            setTimer(60);
            getOTPfunc();
            setOtpVisible(true);
          }
        } else {
          setError(true);
          setMessage(t("Mobile number length must be 10"));
        }
      } else {
        setError(true);
        setMessage(t("Kindly enter mobile number"));
      }
    } else {
      alert("Name could not be empty");
    }
  };

  const isValidEmail = (text) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(text);
  };

  const handleFetchPincode = (data) => {
    console.log("pincode is", data);
    getLocationFromPinCode(data);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("primaryLanguage");
      console.log("fetched prefered language from async", value);

      if (value !== null) {
        preferedLanguage = value;
      }
    } catch (e) {
      // error reading value
    }
  };
  getData();

  const handleChildComponentData = (data) => {
    console.log("handleChildComponentData data", data);
    // setOtpVisible(true)
    if ((data.label).toLowerCase() == "dealer_name") {
      setMappedUserData(data.data);
    }
    if ((data.label).toLowerCase() === "map_user_type") {
      setMappedUserType(data.value);
    }
    if ((data?.name).toLowerCase() === "name") {
      setUserName(data?.value);
    }
    // console.log("isValidEmail", isValidEmail(data.value))

    if ((data?.name).toLowerCase() === "email") {
      console.log("from text input", data?.name);

      console.log("isValidEmail", isValidEmail(data?.value), isValid);
    }
    if ((data?.name).toLowerCase() === "aadhar") {
      console.log(
        "aadhar input returned",
        data?.value?.length,
        data,
        aadhaarVerified
      );
      if (data?.value?.length > 0) {
        setAadhaarEntered(true);
      } else if (data?.value?.length == 0) {
        setAadhaarEntered(false);
      }
    }
    if ((data?.name).toLowerCase() === "pan") {
      if (data?.value?.length > 0) {
        setPanEntered(true);
      } else if (data?.value?.length == 0) {
        setPanEntered(false);
      }
    }
    if ((data?.name).toLowerCase() === "gstin") {
      if (data?.value?.length > 0) {
        setGstEntered(true);
      } else if (data?.value?.length == 0) {
        setGstEntered(false);
      }
    }

    if ((data?.name).toLowerCase() === "mobile") {
      const reg = "^([0|+[0-9]{1,5})?([6-9][0-9]{9})$";
      const mobReg = new RegExp(reg);
      if (data?.value?.length === 10) {
        if (mobReg.test(data?.value)) {
          setUserMobile(data?.value);
        } else {
          setError(true);
          setMessage(t("Please enter a valid mobile number"));
        }
      }
    }

    if ((data.name).toLowerCase() == "dealer_name") {
      if (data.value == "Other") {
        setShowDistributorInput(true);
      } else {
        setShowDistributorInput(false);
        setDistributorName(data.value);
        setDistributorId(data.id);
        setDistributorMobile(data.mobile);
        console.log("Data dis", data);
      }
    }

    // Update the responseArray state with the new data
    setResponseArray((prevArray) => {
      const existingIndex = prevArray.findIndex(
        (item) => item.name === data.name
      );

      if (existingIndex !== -1) {
        // If an entry for the field already exists, update the value
        const updatedArray = [...prevArray];
        updatedArray[existingIndex] = {
          ...updatedArray[existingIndex],
          value: data?.value,
        };
        return updatedArray;
      } else {
        // If no entry exists for the field, add a new entry
        return [...prevArray, data];
      }
    });
  };

  console.log("responseArray", responseArray);
  const modalClose = () => {
    setError(false);
  };

  const getLocationFromPinCode = (pin) => {
    console.log("getting location from pincode", pin);
    var url = `http://postalpincode.in/api/pincode/${pin}`;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log("location address=>", JSON.stringify(json));
        if (json.PostOffice === null) {
          setError(true);
          setMessage(t("Pincode data cannot be retrieved"));
          setIsCorrectPincode(false);
          setLocation({});
        } else {
          setIsCorrectPincode(true);
          const locationJson = {
            postcode: pin,
            district: json.PostOffice[0].District,
            state: json.PostOffice[0].State,
            country: json.PostOffice[0].Country,
            city: json.PostOffice[0].Region,
          };
          setLocation(locationJson);
        }
      })
      .catch((e) => {
        console.log("HEllalsdasbdhj", e);
        setLocation({});
        setError(true);
        setMessage(t("Pincode data cannot be retrieved"));
        setIsCorrectPincode(false);
      });
  };

  const getOtpFromComponent = (value) => {
    if (value.length === 6) {
      setOtp(value);

      const params = {
        mobile: userMobile,
        name: userName,
        otp: value,
        user_type_id: userTypeId,
        user_type: userType,
        type: "login",
      };

      verifyOtpFunc(params);
    }
  };

  const getOTPfunc = () => {
    console.log("get user data", userData);

    console.log("ooooooo->>>>>>>>", {
      userName,
      userMobile,
      userTypeId,
      userType,
    });
    const params = {
      mobile: userMobile,
      name: userName,
      user_type_id: userTypeId,
      user_type: userType,
      type: "registration",
    };
    sendOtpFunc(params);
  };

  const panVerified = (bool) => {
    setPansVerified(bool);
  };

  console.log("panVerifiedhideButton", hideButton);

  const addharVerified = (bool) => {
    console.log("aadhar text input status", bool);

    setAadhaarVerified(bool);
  };

  const handleRegistrationFormSubmission = () => {
    console.log(
      "handleRegistrationFormSubmission",
      responseArray,
      aadhaarRequired,
      panRequired,
      gstinRequired
    );
    const inputFormData = {};
    let isFormValid = true;
    let missingParam = "";

    inputFormData["user_type"] = userType;
    inputFormData["user_type_id"] = userTypeId;
    inputFormData["is_approved_needed"] = isManuallyApproved;
    inputFormData["name"] = name;
    inputFormData["mobile"] = mobile;

    // Create a map for quick lookup of responseArray fields
    const responseMap = new Map();
    for (let i = 0; i < responseArray.length; i++) {
      responseMap.set(responseArray[i].name, responseArray[i].value);
    }
    console.log("responseMap", responseMap);
    // Check for required fields and missing values
    for (let i = 0; i < registrationForm.length; i++) {
      const field = registrationForm[i];
      console.log("Field", field);
      if (field.required) {
        const value = responseMap.get(field.name);
        console.log("didnt get value for", value, field.name);
        if (!value) {
          isFormValid = false;
          missingParam = field.label;
          break;
        }
        if (field.name === "pincode" && value.length !== 6) {
          isFormValid = false;
          missingParam = "Pincode must be exactly 6 digits";
          break;
        }
      }
    }

    console.log("missing params", missingParam);

    // Populate inputFormData with responseArray values
    for (let i = 0; i < responseArray.length; i++) {
      inputFormData[responseArray[i].name] = responseArray[i].value;
    }
    inputFormData["login_type"] = navigatingFrom == "OtpLogin" ? "otp" : "uidp";
    inputFormData["language"] = preferedLanguage;
    inputFormData["app_version"] = appVersion;
    inputFormData["mobile"] = navigationParams?.mobile;

    inputFormData["distributor_name"] = String(distributorName);
    inputFormData["distributor_mobile"] =
      distributorMobile != undefined ? String(distributorMobile) : null;
    inputFormData["distributor_user_id"] =
      distributorId != undefined ? String(distributorId) : null;
    const body = inputFormData;
    console.log("registration output", body);

    const keys = Object.keys(body);
    const values = Object.values(body);

    if (keys.includes("pincode") && !isCorrectPincode) {
      setError(true);
      setMessage(t("Pincode must be verified first"));
      return;
    }

    if (keys.includes("email")) {
      const index = keys.indexOf("email");
      if (isValidEmail(values[index])) {
        if (isFormValid) {
          console.log("registerUserFuncqwerty", body);
          if (aadhaarRequired && !aadhaarVerified) {
            alert("aadhar is not verified");
          } else {
            if (aadhaarEntered && !aadhaarVerified) {
              alert("aadhar is not verified");
            } else {
              if (panRequired && !pansVerified) {
                alert("pan is not verified");
              } else {
                if (panEntered && !pansVerified) {
                  alert("pan is not verified");
                } else {
                  if (gstinRequired && !gstVerified) {
                    alert("gstin is not verified");
                  } else {
                    if (gstEntered && !gstVerified) {
                      alert("gstin is not verified");
                    } else {
                      console.log(
                        "aadhar fields required, verified",
                        aadhaarRequired,
                        aadhaarVerified
                      );
                      console.log(
                        "pan fields required, verified",
                        panRequired,
                        pansVerified
                      );
                      console.log(
                        "gstin fields required, verified",
                        gstinRequired,
                        gstVerified
                      );

                      registerUserFunc(body);
                    }
                  }
                }
              }
            }
          }
        } else {
          setError(true);
          setMessage(missingParam);
        }
      } else {
        setError(true);
        setMessage(t("Email isn't verified"));
      }
    } else {
      if (isFormValid) {
        console.log("registerUserFuncqwerty", body);
        if (aadhaarRequired && !aadhaarVerified) {
          alert("aadhar is not verified");
        } else {
          if (aadhaarEntered && !aadhaarVerified) {
            alert("aadhar is not verified");
          } else {
            if (panRequired && !pansVerified) {
              alert("pan is not verified");
            } else {
              if (panEntered && !pansVerified) {
                alert("pan is not verified");
              } else {
                if (gstinRequired && !gstVerified) {
                  alert("gstin is not verified");
                } else {
                  if (gstEntered && !gstVerified) {
                    alert("gstin is not verified");
                  } else {
                    console.log(
                      "aadhar fields required, verified",
                      aadhaarRequired,
                      aadhaarVerified
                    );
                    console.log(
                      "pan fields required, verified",
                      panRequired,
                      pansVerified
                    );
                    console.log(
                      "gstin fields required, verified",
                      gstinRequired,
                      gstVerified
                    );
                    registerUserFunc(body);
                  }
                }
              }
            }
          }
        }
      } else {
        setError(true);
        setMessage(missingParam);
      }
    }

    console.log("responseArraybody", body);
  };

  const ProgressMeter = ({ currentStage }) => {
    const Circle = ({ index, title }) => {
      const isCompleted = index <= currentStage;

      return (
        <TouchableOpacity
          onPress={() => {
            setFormStage(index + 1);
          }}
          style={{ alignItems: "center" }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 18,
              backgroundColor: isCompleted ? "#00A79D" : "white",
              borderWidth: 2,
              borderColor: "#00A79D",
            }}
          >
            <PoppinsTextMedium
              content={index + 1}
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: isCompleted ? "white" : "#00A79D",
              }}
            />
          </View>
          <PoppinsTextMedium
            content={title.toUpperCase()}
            style={{
              marginTop: 4,
              fontSize: 14,
              fontWeight: "700",
              color: "#00A79D",
              textAlign: "center",
            }}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 18, // aligned to the center of the circles
            height: 2,
            width: "70%",
            backgroundColor: "#00A79D",
            zIndex: 0,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          {progressStage.map((item, index) => (
            <Circle index={index} key={index} title={item} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#F0F8F6",
        height: "100%",
      }}
    >
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={modalTitle}
          message={message}
          openModal={success}
          navigateTo={"Dashboard"}
          params={{
            needsApproval: needsApproval,
            userType: userType,
            userId: userTypeId,
            registrationRequired: registrationRequired,
          }}
        ></MessageModal>
      )}

      {otpModal && (
        <MessageModal
          modalClose={() => {
            setOtpModal(false);
          }}
          title={modalTitle}
          message={message}
          openModal={otpModal}
          // navigateTo={navigatingFrom === "PasswordLogin" ? "PasswordLogin" : "OtpLogin"}
          params={{
            needsApproval: needsApproval,
            userType: userType,
            userId: userTypeId,
          }}
        ></MessageModal>
      )}

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "12%",
        }}
      >
        <TouchableOpacity
          style={{
            height: 24,
            width: 24,
            position: "absolute",
            top: 20,
            left: 10,
          }}
          onPress={() => {
            navigation.navigate("OtpLogin", {
              needsApproval: navigationParams?.needsApproval,
              userType: navigationParams?.user_type,
              userId: navigationParams?.user_type_id,
              registrationRequired: navigationParams?.registrationRequired,
            });
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 20,
            left: 50,
          }}
        >
          <PoppinsTextMedium
            content={t("registration")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
       
      </View>
      <View style={{marginTop:0,width:'100%',marginBottom:20}}>
        <ProgressMeter currentStage={formStage - 1}></ProgressMeter>
        </View>
      <ScrollView style={{ width: "100%" }}>
        <View
          style={{
            width: width,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 20,
          }}
        >
          {formFound ? (
            <PoppinsTextMedium
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 40,
              }}
              content={formStage == 1 ? t("Just few more things about you") : t("Where do you live/work?")}
            ></PoppinsTextMedium>
          ) : (
            <PoppinsTextMedium
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 40,
              }}
              content="No Form Available !!"
            ></PoppinsTextMedium>
          )}

          {/* <RegistrationProgress data={["Basic Info","Business Info","Manage Address","Other Info"]}></RegistrationProgress> */}
          {registrationForm &&
            registrationForm
              .filter((item) => {
                const name = item.name?.trim()?.toLowerCase();
                return formStage === 1
                  ? !isLocationStageField(name)
                  : isLocationStageField(name);
              })
              .map((item, index) => {
                if (item.type === "text") {
                  console.log("the user name", userName);
                  if (item.name === "phone" || item.name === "mobile") {
                    return (
                      <>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                          <View style={{ flex: 0.75 }}>
                            <TextInputNumericRectangle
                              jsonData={item}
                              key={index}
                              maxLength={10}
                              handleData={handleChildComponentData}
                              placeHolder={item.name}
                              value={userMobile}
                              displayText={item.name}
                              label={item.label}
                              isEditable={otpVisible ? false : true}
                            >
                              {" "}
                            </TextInputNumericRectangle>
                            {/* {navigatingFrom === "PasswordLogin" && <TextInputNumericRectangle
                            jsonData={item}
                            key={index}
                            maxLength={10}
                            handleData={handleChildComponentData}
                            placeHolder={item.name}
                            label={item.label}

                          >
                            {' '}
                          </TextInputNumericRectangle>} */}
                          </View>

                          {otpVerified ? (
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  resizeMode: "contain",
                                }}
                                source={require("../../../assets/images/greenTick.png")}
                              ></Image>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={{
                                flex: 0.15,
                                marginTop: 6,
                                backgroundColor: ternaryThemeColor,
                                alignItems: "center",
                                justifyContent: "center",
                                height: 50,
                                borderRadius: 5,
                              }}
                              onPress={() => {
                                handleTimer();
                              }}
                            >
                              <PoppinsTextLeftMedium
                                style={{
                                  color: "white",
                                  fontWeight: "800",
                                  padding: 5,
                                }}
                                content={t("get otp")}
                              ></PoppinsTextLeftMedium>
                            </TouchableOpacity>
                          )}
                          {sendOtpIsLoading && (
                            <FastImage
                              style={{
                                width: 40,
                                height: 40,
                                alignSelf: "center",
                              }}
                              source={{
                                uri: gifUri, // Update the path to your GIF
                                priority: FastImage.priority.normal,
                              }}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                          )}
                        </View>

                        {console.log("conditions", otpVerified, otpVisible)}
                        {!otpVerified && otpVisible && (
                          <>
                            <PoppinsTextLeftMedium
                              style={{ marginRight: "70%" }}
                              content="OTP"
                            ></PoppinsTextLeftMedium>

                            <OtpInput
                              getOtpFromComponent={getOtpFromComponent}
                              color={"white"}
                            ></OtpInput>

                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: 4,
                                }}
                              >
                                <Image
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: "contain",
                                  }}
                                  source={require("../../../assets/images/clock.png")}
                                ></Image>
                                <Text
                                  style={{
                                    color: ternaryThemeColor,
                                    marginLeft: 4,
                                  }}
                                >
                                  {timer}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: ternaryThemeColor,
                                    marginTop: 10,
                                  }}
                                >
                                  {t("Didn't recieve any Code?")}
                                </Text>

                                <Text
                                  onPress={() => {
                                    handleTimer();
                                  }}
                                  style={{
                                    color: ternaryThemeColor,
                                    marginTop: 6,
                                    fontWeight: "600",
                                    fontSize: 16,
                                  }}
                                >
                                  {t("Resend Code")}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}
                      </>
                    );
                  } else if (item.name.trim().toLowerCase() === "name") {
                    return (
                      <PrefilledTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        displayText={t(item.name.toLowerCase().trim())}
                        value={userName}
                        label={item.label}
                        isEditable={true}
                      ></PrefilledTextInput>
                    );
                  } else if (item.name.trim().toLowerCase() === "email") {
                    return (
                      <EmailTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        displayText={t(item.name.trim())}
                        label={item.label}
                        // isValidEmail = {isValidEmail}
                      ></EmailTextInput>
                    );
                  }

                  // }
                  else if (item.name === "aadhaar" || item.name === "aadhar") {
                    console.log("aadhar");
                    return (
                      <TextInputAadhar
                        required={item.required}
                        jsonData={item}
                        key={index}
                        verified={addharVerified}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        displayText={t(item.name.toLowerCase().trim())}
                        label={item.label}
                      >
                        {" "}
                      </TextInputAadhar>
                    );
                  } else if (item.name === "pan") {
                    console.log("pan");
                    return (
                      <TextInputPan
                        required={item.required}
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        label={item.label}
                        displayText={item.name}
                        panVerified={panVerified}
                      >
                        {" "}
                      </TextInputPan>
                    );
                  } else if (item.name === "gstin") {
                    console.log("gstin");
                    return (
                      <TextInputGST
                        required={item.required}
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        label={item.label}
                      >
                        {" "}
                      </TextInputGST>
                    );
                  } else if (item.name.trim().toLowerCase() === "city") {
                    return (
                      <PrefilledTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        value={location?.city}
                        displayText={item.name}
                        label={item.label}
                        isEditable={true}
                      ></PrefilledTextInput>
                    );
                  } else if (item.name.trim().toLowerCase() === "pincode") {
                    return (
                      <PincodeTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        handleFetchPincode={handleFetchPincode}
                        placeHolder={item.name}
                        value={location?.postcode}
                        label={item.label}
                        displayText={item.name}
                        maxLength={6}
                      ></PincodeTextInput>
                    );
                  }

                  // else if ((item.name).trim().toLowerCase() === "pincode" ) {

                  //   return (
                  //     <PincodeTextInput
                  //       jsonData={item}
                  //       key={index}
                  //       handleData={handleChildComponentData}
                  //       handleFetchPincode={handleFetchPincode}
                  //       placeHolder={item.name}

                  //       label={item.label}
                  //       maxLength={6}
                  //     ></PincodeTextInput>
                  //   )
                  // }
                  else if (item.name.trim().toLowerCase() === "state") {
                    return (
                      <PrefilledTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        value={location?.state}
                        label={item.label}
                        displayText={item.name}
                        isEditable={false}
                      ></PrefilledTextInput>
                    );
                  } else if (item.name.trim().toLowerCase() === "district") {
                    return (
                      <PrefilledTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        value={location?.district}
                        label={item.label}
                        displayText={item.name}
                        isEditable={false}
                      ></PrefilledTextInput>
                    );
                  } else if (item.name.trim().toLowerCase() === "dealer_name") {
                    return (
                      <View style={{ width: "90%" }}>
                        {mappedUserType && (
                          <DropDownForDistributor
                            state={location?.state}
                            title={`Select ${mappedUserType}`}
                            header={`Select ${mappedUserType}`}
                            jsonData={{ label: item.name, name: item.name }}
                            searchEnable={true}
                            data={[]}
                            type={mappedUserType}
                            handleData={handleChildComponentData}
                          ></DropDownForDistributor>
                        )}
                      </View>
                    );
                  } else {
                    return (
                      <TextInputRectangle
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        label={item.label}
                      >
                        {" "}
                      </TextInputRectangle>
                    );
                  }
                } else if (item.type === "file") {
                  return (
                    <ImageInput
                      jsonData={item}
                      handleData={handleChildComponentData}
                      key={index}
                      data={item.name}
                      label={item.label}
                      action="Select File"
                    ></ImageInput>
                  );
                } else if (item.type === "select") {
                  return (
                    <DropDownRegistration
                      required={item.required}
                      title={item.name}
                      header={item.name}
                      jsonData={item}
                      data={item.options}
                      handleData={handleChildComponentData}
                    ></DropDownRegistration>
                  );
                } else if (item.type === "date") {
                  return (
                    <InputDate
                      required={item.required}
                      jsonData={item}
                      handleData={handleChildComponentData}
                      data={item.label}
                      key={index}
                    ></InputDate>
                  );
                }
              })}

          {formStage != 2 && formFound && !hideButton && (
            <ButtonOval
              handleOperation={() => {
                setFormStage(2);
              }}
              content={t("Next")}
              style={{
                paddingLeft: 30,
                paddingRight: 30,
                padding: 10,
                color: "white",
                fontSize: 16,
              }}
            ></ButtonOval>
          )}
          {console.log("sadbhjasbhjvfhjvhasjvhj", hideButton)}
          {formStage == 2 && formFound && !hideButton && (
            <ButtonOval
              handleOperation={() => {
                handleRegistrationFormSubmission();
              }}
              content={t("submit")}
              style={{
                paddingLeft: 30,
                paddingRight: 30,
                padding: 10,
                color: "white",
                fontSize: 16,
              }}
            ></ButtonOval>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BasicInfo;
