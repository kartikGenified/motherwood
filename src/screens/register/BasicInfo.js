import React, { useCallback, useEffect, useId, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text
} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector, useDispatch } from 'react-redux';
import TextInputRectangleMandatory from '../../components/atoms/input/TextInputRectangleMandatory';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import * as Keychain from 'react-native-keychain';
import MessageModal from '../../components/modals/MessageModal';
import RegistrationProgress from '../../components/organisms/RegistrationProgress';
import { useGetFormAccordingToAppUserTypeMutation } from '../../apiServices/workflow/GetForms';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import { useRegisterUserByBodyMutation, useUpdateProfileAtRegistrationMutation } from '../../apiServices/register/UserRegisterApi';
import TextInputAadhar from '../../components/atoms/input/TextInputAadhar';
import TextInputPan from '../../components/atoms/input/TextInputPan';
import TextInputGST from '../../components/atoms/input/TextInputGST';
import ErrorModal from '../../components/modals/ErrorModal';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import PrefilledTextInput from '../../components/atoms/input/PrefilledTextInput';
import { useGetLocationFromPinMutation } from '../../apiServices/location/getLocationFromPincode';
import PincodeTextInput from '../../components/atoms/input/PincodeTextInput';
import OtpInput from '../../components/organisms/OtpInput';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { useGetLoginOtpMutation } from '../../apiServices/login/otpBased/SendOtpApi';
import { useGetAppLoginMutation } from '../../apiServices/login/otpBased/OtpLoginApi';
import { useVerifyOtpMutation } from '../../apiServices/login/otpBased/VerifyOtpApi';
import { useGetLoginOtpForVerificationMutation } from '../../apiServices/otp/GetOtpApi';
import { useVerifyOtpForNormalUseMutation } from '../../apiServices/otp/VerifyOtpForNormalUseApi';
import DropDownRegistration from '../../components/atoms/dropdown/DropDownRegistration';
import EmailTextInput from '../../components/atoms/input/EmailTextInput';
import { validatePathConfig } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {GoogleMapsKey} from "@env"
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownForDistributor from '../../components/atoms/dropdown/DropDownForDistributor';
import { useCreateUserMappingMutation, useCreateUserMappingOpenMutation } from '../../apiServices/userMapping/userMappingApi';

const BasicInfo = ({ navigation, route }) => {
  const [userName, setUserName] = useState(route.params.name)
  const [userMobile, setUserMobile] = useState(route.params.mobile)
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [registrationForm, setRegistrationForm] = useState([])
  const [responseArray, setResponseArray] = useState([]);
  const [isManuallyApproved, setIsManuallyApproved] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [needsAadharVerification, setNeedsAadharVerification] = useState(false)
  const [location, setLocation] = useState()
  const [formFound, setFormFound] = useState(true)
  const [isCorrectPincode, setIsCorrectPincode] = useState(true)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpModal, setOtpModal] = useState(false)
  const [otpVisible, setOtpVisible] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [hideButton, setHideButton] = useState(false)
  const [timer, setTimer] = useState(0)
  const [aadhaarVerified, setAadhaarVerified] = useState(false)
  const [aadhaarEntered, setAadhaarEntered] = useState(false)
  const [aadhaarRequired, setAadhaarRequired] = useState(false)
  const [pansVerified, setPansVerified] = useState(true)
  const [panEntered, setPanEntered] = useState(false)
  const [panRequired, setPanRequired] = useState(false)
  const [mappedUserType, setMappedUserType] = useState()
  const [gstVerified, setGstVerified] = useState(true)
  const [gstEntered, setGstEntered] = useState(false)
  const [formStage, setFormStage] = useState(1);
  const [gstinRequired, setGstinRequired] = useState(false)
  const [distributorName, setDistributorName] = useState("");
  const [distributorMobile, setDistributorMobile] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [mappedUserData, setMappedUserData] = useState();
  const [showDistributorInput, setShowDistributorInput] = useState(false);
  const [mobileVerified, setMobileVerified] = useState()
  const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);
  const focused = useIsFocused()
  let showSubmit = true;


  const dispatch = useDispatch()

  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const isOnlineVerification = useSelector(state => state.apptheme.isOnlineVerification)
  const userData = useSelector(state => state.appusersdata.userData);
  const appUsers = useSelector(state => state.appusers.value)
  const manualApproval = useSelector(state => state.appusers.manualApproval)
  const appVersion = useSelector(state=>state.appusers.app_version)
  const userType = route.params.userType
  const userTypeId = route.params.userId
  const needsApproval = route.params.needsApproval
  const navigatingFrom = route.params.navigatingFrom
  const registrationRequired = route.params.registrationRequired
  console.log("registration required basic info", registrationRequired,navigatingFrom)
  // const navigationParams = { "needsApproval": needsApproval, "userId": userTypeId, "user_type": userType, "mobile": mobile, "name": name, "registrationRequired":registrationRequired}
  const navigationParams = { "needsApproval": needsApproval, "userId": userTypeId, "userType": userType, "registrationRequired":registrationRequired}
  console.log("navigation params from basic info",navigationParams)
  const name = route.params?.name
  const mobile = route.params?.mobile
  console.log("appUsers", userType, userTypeId, isManuallyApproved, name, mobile)
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const locationStage = ["city", "state", "district", "pincode"]
  const {t} = useTranslation()
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;
  const progressStage = ["details", "address"]
  const isLocationStageField = (fieldName) => {
    return locationStage.includes(fieldName.trim().toLowerCase());
  };
  let timeoutId;
    let preferedLanguage ;
  const [getFormFunc, {
    data: getFormData,
    error: getFormError,
    isLoading: getFormIsLoading,
    isError: getFormIsError
  }] = useGetFormAccordingToAppUserTypeMutation()

  const [registerUserFunc,
    {
      data: registerUserData,
      error: registerUserError,
      isLoading: registerUserIsLoading,
      isError: registerUserIsError
    }] = useRegisterUserByBodyMutation()

  const [
    updateProfileAtRegistrationFunc, {
      data: updateProfileAtRegistrationData,
      error: updateProfileAtRegistrationError,
      isLoading: updateProfileAtRegistrationIsLoading,
      isError: updateProfileAtRegistrationIsError
    }
  ] = useUpdateProfileAtRegistrationMutation()

  const [createUserMapping, {
    data: getUserMappingPincodeData,
    error: getuserMappingError,
    isLoading: getuserMappingIsLoading,
    isError: getUserMappingIsError
  }] = useCreateUserMappingOpenMutation()

  const [getLocationFromPincodeFunc, {
    data: getLocationFormPincodeData,
    error: getLocationFormPincodeError,
    isLoading: getLocationFormPincodeIsLoading,
    isError: getLocationFromPincodeIsError
  }] = useGetLocationFromPinMutation()

  // send otp for login--------------------------------
  const [sendOtpFunc, {
    data: sendOtpData,
    error: sendOtpError,
    isLoading: sendOtpIsLoading,
    isError: sendOtpIsError
  }] = useGetLoginOtpForVerificationMutation()

  const [
    verifyOtpFunc,
    {
      data: verifyOtpData,
      error: verifyOtpError,
      isLoading: verifyOtpIsLoading,
      isError: verifyOtpIsError,
    },
  ] = useVerifyOtpForNormalUseMutation();

  useEffect(() => {
    if(timer > 0){
      timeoutId = setTimeout(timeOutCallback, 1000);
    } 
    if(otpVerified)
    {
      clearTimeout(timeoutId)
    }

    return () => clearTimeout(timeoutId);
  }, [timer, timeOutCallback,otpVerified]);

  useEffect(() => {
    if (getUserMappingPincodeData) {
      console.log("getUserMappingPincodeData", getUserMappingPincodeData)

    }
    else if(getuserMappingError) {
      console.log("getuserMappingError", getuserMappingError)
      alert("Unable to map the selected user, please contact the customer care")
    }
  }, [getUserMappingPincodeData, getuserMappingError])

  useEffect(() => {
    setUserName(route.params.name)
  }, [route.params.name])

  useEffect(() => {
    console.log("mobile number from use effect", route.params.mobile, navigatingFrom)
    setUserMobile(route.params.mobile)

  }, [route.params.mobile])

  useEffect(() => {

    const AppUserType = userType
    getFormFunc({ AppUserType })
    if (manualApproval.includes(userType)) {
      setIsManuallyApproved(true)
    }
    else {
      setIsManuallyApproved(false)
    }

    

  }, [])

  useEffect(()=>{
    setHideButton(false)
  },[focused])

  useEffect(() => {
    if (verifyOtpData?.success) {
      setOtpVerified(true)
      setOtpModal(true)
      console.log("verifyOtp", verifyOtpData)
      setMessage(t("OTP verified"))

    }
    else if (verifyOtpError) {
      console.log("verifyOtpError", verifyOtpError)
      setError(true)
      setMessage(t("Please Enter Correct OTP"))
    }
  }, [verifyOtpData, verifyOtpError])
  
  useEffect(() => {
    let lat = ''
    let lon = ''
    Geolocation.getCurrentPosition((res) => {
      console.log("res", res)
      lat = res.coords.latitude
      lon = res.coords.longitude
      // getLocation(JSON.stringify(lat),JSON.stringify(lon))
      console.log("latlong", lat, lon)
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.coords.latitude},${res.coords.longitude}
        &location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`

      fetch(url).then(response => response.json()).then(json => {
        console.log("location address=>", JSON.stringify(json));
        const formattedAddress = json.results[0].formatted_address
        const formattedAddressArray = formattedAddress?.split(',')

        let locationJson = {

          lat: json.results[0].geometry.location.lat === undefined ? "N/A" : json.results[0].geometry.location.lat,
          lon: json.results[0].geometry.location.lng === undefined ? "N/A" : json.results[0].geometry.location.lng,
          address: formattedAddress === undefined ? "N/A" : formattedAddress

        }

        const addressComponent = json.results[0].address_components
        console.log("addressComponent", addressComponent)
        for (let i = 0; i <= addressComponent.length; i++) {
          if (i === addressComponent.length) {
            dispatch(setLocation(locationJson))
            setLocation(locationJson)
          }
          else {
            if (addressComponent[i].types.includes("postal_code")) {
              console.log("inside if")

              console.log(addressComponent[i].long_name)
              locationJson["postcode"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("country")) {
              console.log(addressComponent[i].long_name)

              locationJson["country"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("administrative_area_level_1")) {
              console.log(addressComponent[i].long_name)

              locationJson["state"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("administrative_area_level_3")) {
              console.log(addressComponent[i].long_name)

              locationJson["district"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("locality")) {
              console.log(addressComponent[i].long_name)

              locationJson["city"] = addressComponent[i].long_name
            }
          }

        }


        console.log("formattedAddressArray", locationJson)

      })
    })

  }, [])
  useEffect(() => {
    if (getLocationFormPincodeData) {
      console.log("getLocationFormPincodeData", getLocationFormPincodeData)
      if (getLocationFormPincodeData.success) {
        const address = getLocationFormPincodeData.body[0].office + ", " + getLocationFormPincodeData.body[0].district + ", " + getLocationFormPincodeData.body[0].state + ", " + getLocationFormPincodeData.body[0].pincode
        let locationJson = {

          lat: "N/A",
          lon: "N/A",
          address: address,
          city: getLocationFormPincodeData.body[0].district,
          district: getLocationFormPincodeData.body[0].division,
          state: getLocationFormPincodeData.body[0].state,
          country: "N/A",
          postcode: getLocationFormPincodeData.body[0].pincode


        }
        console.log("getLocationFormPincodeDataLocationJson",locationJson)
        setLocation(locationJson)
      }
    }
    else if (getLocationFormPincodeError) {
      console.log("getLocationFormPincodeError", getLocationFormPincodeError)
      setError(true)
      setMessage(getLocationFormPincodeError.data.message)
    }
  }, [getLocationFormPincodeData, getLocationFormPincodeError])

  
  useEffect(() => {
    if (getFormData) {
      if (getFormData.message !== "Not Found") {
        console.log("Form Fields", JSON.stringify(getFormData))

        const values = Object.values(getFormData.body.template)
        setRegistrationForm(values)
        console.log("values values are bering printed", values.length)
        if(values)
        for(let i=0;i<values;i++)
        {
          console.log("form values are being printed", values[i])
          if(values[i].label == "Aadhaar" && values[i].required)
          {
            setAadhaarRequired(true)
          }
          if(values[i].label == "Pan" && values[i].required)
          {
            setPanRequired(true)
          }
          if(values[i].label == "Gstin" && values[i].required)
          {
            setGstinRequired(true)
          }
        }

      }
      else {
        setError(true)
        setMessage("Form can't be fetched")
        setFormFound(false)
      }

    }
    else if (getFormError) {
      console.log("Form Field Error", getFormError)
    }
  }, [getFormData, getFormError])

  useEffect(() => {
    if (registerUserData) {
      console.log("data after submitting form", registerUserData,mappedUserData)
      if (registerUserData.success ) {

          const body = {
            user_type: mappedUserData?.user_type,
            user_type_id: Number(mappedUserData?.user_type_id),
            app_user_id: mappedUserData?.id,
            app_user_name: mappedUserData?.name,
            app_user_mobile: mappedUserData?.mobile,
            mapped_user_type: registerUserData.body.user_type,
            mapped_user_type_id: registerUserData.body.user_type_id,
            mapped_app_user_id: registerUserData.body.id,
            mapped_app_user_name: registerUserData.body.name,
            mapped_app_user_mobile: registerUserData.body.mobile,
          };
          console.log("the body", body)
         
            
  
            let params = {
              body: { "rows": [body] }
            }
            console.log("createusermapping", JSON.stringify(params))
            createUserMapping(params)
          
        setSuccess(true)
        setMessage(t("Thank you for joining Shiba World Loyalty program"))
        setModalTitle(t("Greetings"))
      }
      setHideButton(false)

      // const values = Object.values(registerUserData.body.template)
      // setRegistrationForm(values)
    }
    else if (registerUserError) {
      console.log("form submission error", registerUserError)
      setError(true)
      setMessage(registerUserError.data.message)
      setHideButton(false)

    }
  }, [registerUserData, registerUserError])

  useEffect(() => {
    if (updateProfileAtRegistrationData) {
      console.log("updateProfileAtRegistrationData", updateProfileAtRegistrationData)
      if (updateProfileAtRegistrationData.success) {
        setSuccess(true)
        setMessage(updateProfileAtRegistrationData.message)
        setModalTitle("WOW")
      }

      // const values = Object.values(updateProfileAtRegistrationData.body.template)
      // setRegistrationForm(values)
    }
    else if (updateProfileAtRegistrationError) {
      console.log("updateProfileAtRegistrationError", updateProfileAtRegistrationError)
      setError(true)
      // setMessage(updateProfileAtRegistrationError.data.message)

    }
  }, [updateProfileAtRegistrationData, updateProfileAtRegistrationError])
  useEffect(() => {
    if (sendOtpData) {
      console.log("sendOtpData", sendOtpData);
      setOtpVisible(true);
    }
    else {
      console.log("sendOtpError", sendOtpError)
    }
  }, [sendOtpData, sendOtpError])

  const handleTimer = () => {
    if(userName.length!=0)
    {
      if(userMobile)
      {
        if(userMobile.length==10)
        {
          if(timer===60)
          {
            getOTPfunc()
            setOtpVisible(true)
          }
          if (timer===0 || timer===-1) {
            setTimer(60);
            getOTPfunc()
            setOtpVisible(true)
      
           
          }
        }
        else{
          setError(true)
          setMessage(t("Mobile number length must be 10"))
        }
       
      }
      else{
        setError(true)
          setMessage(t("Kindly enter mobile number"))
      }
    }
    else{
      alert("Name could not be empty")
    }

    
    
  }


  const isValidEmail = (text) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(text);
  };

  const handleFetchPincode = (data) => {
    console.log("pincode is", data)
    getLocationFromPinCode(data)

  }

  

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('primaryLanguage');
      console.log("fetched prefered language from async",value)

      if (value !== null) {
        preferedLanguage = value
      }
    } catch (e) {
      // error reading value
    }
  };
  getData()

  const handleChildComponentData = data => {
   console.log("handleChildComponentData data",data)
    // setOtpVisible(true)
    if(data.label == "dealer_name")
    {
      setMappedUserData(data.data)
    }
    if(data.label === "map_user_type")
    {
      setMappedUserType(data.value)
      
    }
    if (data?.name === "name") {
      setUserName(data?.value)
    }
    // console.log("isValidEmail", isValidEmail(data.value))

    if (data?.name === "email") {
      console.log("from text input", data?.name);

      console.log("isValidEmail", isValidEmail(data?.value), isValid)

    }
    if(data?.name=== "aadhar")
    {
      console.log("aadhar input returned", data?.value?.length,data,aadhaarVerified)
      if(data?.value?.length>0)
      {
        setAadhaarEntered(true)
      }
      else if(data?.value?.length == 0)
      {
        setAadhaarEntered(false)
      }
    }
    if(data?.name=== "pan")
    {
      if(data?.value?.length>0)
      {
        setPanEntered(true)
      }
      else if(data?.value?.length == 0)
      {
        setPanEntered(false)
      }
    }
    if(data?.name=== "gstin")
    {
      if(data?.value?.length>0)
      {
        setGstEntered(true)
      }
      else if(data?.value?.length == 0)
      {
        setGstEntered(false)
      }
    }



    if (data?.name === "mobile") {
      const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
      const mobReg = new RegExp(reg)
      if (data?.value?.length === 10) {
        if(mobReg.test(data?.value))
      {
      setUserMobile(data?.value)
      }
      else{
        setError(true)
        setMessage(t("Please enter a valid mobile number"))
      }
    }

    }

    if (data.name == "dealer_name") {
      if(data.value =="Other"){
        setShowDistributorInput(true);
      }
      else{
        setShowDistributorInput(false);
        setDistributorName(data.value);
        setDistributorId(data.id)
        setDistributorMobile(data.mobile)
        console.log("Data dis", data);
      }
      
    }

    // Update the responseArray state with the new data
    setResponseArray(prevArray => {
      const existingIndex = prevArray.findIndex(
        item => item.name === data.name,
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

  console.log("responseArray", responseArray)
  const modalClose = () => {
    setError(false);
  };

  const getLocationFromPinCode =  (pin) => {
    console.log("getting location from pincode",pin)
    var url = `http://postalpincode.in/api/pincode/${pin}`

  fetch(url).then(response => response.json()).then(json => {
    console.log("location address=>", JSON.stringify(json));
    if(json.PostOffice===null)
    {
      setError(true)
      setMessage(t("Pincode data cannot be retrieved"))
      setIsCorrectPincode(false)
      setLocation({})
    }
    else{
      setIsCorrectPincode(true)
      const locationJson = {
        "postcode":pin,
        "district":json.PostOffice[0].District,
        "state":json.PostOffice[0].State,
        "country":json.PostOffice[0].Country,
        "city":json.PostOffice[0].Region
      }
      setLocation(locationJson)
      
    }
    

  }).catch((e) => {
    console.log("HEllalsdasbdhj", e);
    setLocation({});
    setError(true);
    setMessage(t("Pincode data cannot be retrieved"));
    setIsCorrectPincode(false);
  });
}

  const getOtpFromComponent = value => {
    if (value.length === 6) {

      setOtp(value);


      const params = { mobile: userMobile, name: userName, otp: value, user_type_id: userTypeId, user_type: userType,type:'login' }


      verifyOtpFunc(params);

    }
  };

  const getOTPfunc = () => {
    console.log("get user data", userData)

    console.log("ooooooo->>>>>>>>", { userName, userMobile, userTypeId, userType })
    const params = { mobile: userMobile, name: userName, user_type_id: userTypeId, user_type: userType,type:'registration' }
    sendOtpFunc(params)
  }

  const panVerified =(bool)=>{
    setPansVerified(bool)
  }


  console.log("panVerifiedhideButton",hideButton)

  const addharVerified = (bool)=>{
    console.log("aadhar text input status", bool)
    
      setAadhaarVerified(bool)
  }

const handleRegistrationFormSubmission = () => {
  console.log("handleRegistrationFormSubmission", responseArray,aadhaarRequired,panRequired,gstinRequired);
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
console.log("responseMap",responseMap)
  // Check for required fields and missing values
  for (let i = 0; i < registrationForm.length; i++) {
      const field = registrationForm[i];
      console.log("Field", field)
      if (field.required) {
          const value = responseMap.get(field.name);
          console.log("didnt get value for",value,field.name)
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
  inputFormData["login_type"] = navigatingFrom == "OtpLogin" ? "otp" : 'uidp'
  inputFormData["language"] = preferedLanguage
  inputFormData["app_version"] = appVersion
  inputFormData["distributor_name"] = String(distributorName);
  inputFormData["distributor_mobile"] = distributorMobile!= undefined ? String(distributorMobile) : null;
  inputFormData["distributor_user_id"] = distributorId!= undefined  ? String(distributorId) : null
  const body = inputFormData;
  console.log("registration output", body);

  if (otpVerified) {
      const keys = Object.keys(body);
      const values = Object.values(body);

      if (keys.includes('pincode') && !isCorrectPincode) {
          setError(true);
          setMessage(t("Pincode must be verified first"));
          return;
      }

      if (keys.includes('email')) {
          const index = keys.indexOf('email');
          if (isValidEmail(values[index])) {
              if (isFormValid) {
                console.log("registerUserFuncqwerty",body)
                  if(aadhaarRequired && !aadhaarVerified)
                  {
                    alert("aadhar is not verified")
                  }
                  else{
                    if(aadhaarEntered && !aadhaarVerified)
                    {
                      alert("aadhar is not verified")
                    }
                    else{
                      if(panRequired && !pansVerified)
                    {
                      alert("pan is not verified")
                    }
                    else{
                      if(panEntered && !pansVerified)
                      {
                      alert("pan is not verified")
                      }
                      else{
                        if(gstinRequired && !gstVerified)
                        {
                          alert("gstin is not verified")
                        }
                        else{
                          if(gstEntered && !gstVerified)
                          {
                          alert("gstin is not verified")
                          }
                          else{
                            console.log("aadhar fields required, verified",aadhaarRequired,aadhaarVerified )
                            console.log("pan fields required, verified",panRequired,pansVerified )
                            console.log("gstin fields required, verified",gstinRequired,gstVerified )


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
            console.log("registerUserFuncqwerty",body)
            if(aadhaarRequired && !aadhaarVerified)
                  {
                    alert("aadhar is not verified")
                  }
                  else{
                    if(aadhaarEntered && !aadhaarVerified)
                    {
                      alert("aadhar is not verified")
                    }
                    else{
                      if(panRequired && !pansVerified)
                    {
                      alert("pan is not verified")
                    }
                    else{
                      if(panEntered && !pansVerified)
                      {
                      alert("pan is not verified")
                      }
                      else{
                        if(gstinRequired && !gstVerified)
                        {
                          alert("gstin is not verified")
                        }
                        else{
                          if(gstEntered && !gstVerified)
                          {
                          alert("gstin is not verified")
                          }
                          else{
                            console.log("aadhar fields required, verified",aadhaarRequired,aadhaarVerified )
                            console.log("pan fields required, verified",panRequired,pansVerified )
                            console.log("gstin fields required, verified",gstinRequired,gstVerified )
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
  } else {
      setError(true);
      setMessage(t("Otp isn't verified yet"));
  }

  console.log("responseArraybody", body);
};

const ProgressMeter = ({ currentStage }) => {
  const Circle = ({ index, title }) => {
    const isCompleted = index <= currentStage;

    return (
      <TouchableOpacity onPress={()=>{
        setFormStage(index+1)
      }} style={{ alignItems: 'center' }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 36,
            width: 36,
            borderRadius: 18,
            backgroundColor: isCompleted ? '#00A79D' : 'white',
            borderWidth: 2,
            borderColor: '#00A79D',
          }}
        >
          <PoppinsTextMedium
            content={index + 1}
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: isCompleted ? 'white' : '#00A79D',
            }}
          />
        </View>
        <PoppinsTextMedium
          content={(title).toUpperCase()}
          style={{
            marginTop: 4,
            fontSize: 14,
            fontWeight: '700',
            color: '#00A79D',
            textAlign: 'center',
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <View
        style={{
          position: 'absolute',
          top: 18, // aligned to the center of the circles
          height: 2,
          width: '70%',
          backgroundColor: '#00A79D',
          zIndex: 0,

        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
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
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: "#F0F8F6",
        height: '100%',


      }}>
      {error && (
        <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={modalTitle}
          message={message}
          openModal={success}
          navigateTo={"SelectUser"}
          params={{ needsApproval: needsApproval, userType: userType, userId: userTypeId, registrationRequired:registrationRequired }}></MessageModal>
      )}

      {otpModal && (
        <MessageModal
          modalClose={() => { setOtpModal(false) }}
          title={modalTitle}
          message={message}
          openModal={otpModal}
          // navigateTo={navigatingFrom === "PasswordLogin" ? "PasswordLogin" : "OtpLogin"}
          params={{ needsApproval: needsApproval, userType: userType, userId: userTypeId }}></MessageModal>
      )}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '20%',
        }}>
        <TouchableOpacity
          style={{
            height: 24, width: 24,
            position: 'absolute',
            top: 20,
            left: 10
          }}
          onPress={() => {
            navigation.navigate('OtpLogin',navigationParams);
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center', position: "absolute", top: 20, left: 50 }}>
          <PoppinsTextMedium
            content={t("registration")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'black',
            }}></PoppinsTextMedium>
        </View>
        <ProgressMeter currentStage={formStage-1}></ProgressMeter>
      </View>
      <ScrollView style={{ width: '100%' }}>

        <View style={{ width: width, backgroundColor: "white", alignItems: "center", justifyContent: 'flex-start', paddingTop: 20 }}>
          {formFound ? <PoppinsTextMedium style={{ color: 'black', fontWeight: '700', fontSize: 18, marginBottom: 40 }} content={t("Please Fill The Following Form To Register")}></PoppinsTextMedium> : <PoppinsTextMedium style={{ color: 'black', fontWeight: '700', fontSize: 18, marginBottom: 40 }} content="No Form Available !!"></PoppinsTextMedium>}

          {/* <RegistrationProgress data={["Basic Info","Business Info","Manage Address","Other Info"]}></RegistrationProgress> */}
          {registrationForm &&
  registrationForm
    .filter((item) => {
      const name = item.name?.trim()?.toLowerCase();
      return formStage === 1 ? !isLocationStageField(name) : isLocationStageField(name);
    })
    .map((item, index) => {
              if (item.type === 'text') {
                console.log("the user name", userName)
                if ((item.name === 'phone' || item.name === "mobile")) {
                  return (
                    <>

                      <View style={{ flexDirection: 'row', flex: 1 }}>

                        <View style={{ flex: 0.75 }}>
                          {navigatingFrom === "OtpLogin" && <TextInputNumericRectangle
                            jsonData={item}
                            key={index}
                            maxLength={10}
                            handleData={handleChildComponentData}
                            placeHolder={item.name}
                            value={userMobile}
                            displayText ={item.name}
                            label={item.label}
                            isEditable={otpVisible ? false : true}
                          >
                            {' '}
                          </TextInputNumericRectangle>}
                          {navigatingFrom === "PasswordLogin" && <TextInputNumericRectangle
                            jsonData={item}
                            key={index}
                            maxLength={10}
                            handleData={handleChildComponentData}
                            placeHolder={item.name}
                            label={item.label}

                          >
                            {' '}
                          </TextInputNumericRectangle>}
                        </View>

                        {otpVerified ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/greenTick.png')}></Image>
                        </View> : <TouchableOpacity style={{ flex: 0.15, marginTop: 6, backgroundColor: ternaryThemeColor, alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 5 }} onPress={()=>{
                          handleTimer()
                        }}>
                          <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800', padding: 5 }}content={t("get otp")}></PoppinsTextLeftMedium>
                        </TouchableOpacity>}
                        {sendOtpIsLoading && <FastImage
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
              />}
                      </View>



                      {console.log("conditions", otpVerified, otpVisible)}
                      {!otpVerified && otpVisible &&
                        <>

                          <PoppinsTextLeftMedium style={{ marginRight: '70%' }} content="OTP"></PoppinsTextLeftMedium>

                          <OtpInput
                            getOtpFromComponent={getOtpFromComponent}
                            color={'white'}></OtpInput>

                          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
                              <Image
                                style={{
                                  height: 20,
                                  width: 20,
                                  resizeMode: 'contain',

                                }}
                                source={require('../../../assets/images/clock.png')}></Image>
                              <Text style={{ color: ternaryThemeColor, marginLeft: 4 }}>{timer}</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ color: ternaryThemeColor, marginTop: 10 }}>{t("Didn't recieve any Code?")}</Text>

                              <Text onPress={()=>{handleTimer()}} style={{ color: ternaryThemeColor, marginTop: 6, fontWeight: '600', fontSize: 16 }}>{t("Resend Code")}</Text>

                            </View>
                          </View>
                        </>
                      }
                    </>
                  );


                }


                else if ((item.name).trim().toLowerCase() === "name") {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      displayText = {t(item.name.toLowerCase().trim())}
                      value={userName}
                      label={item.label}
                      isEditable={true}
                 
                    ></PrefilledTextInput>
                  )
                }


                else if ((item.name).trim().toLowerCase() === "email") {
                  return (
                    <EmailTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      displayText = {t(item.name.trim())}
                      label={item.label}
                    // isValidEmail = {isValidEmail}
                    ></EmailTextInput>
                  )
                }

                // } 
                else if (item.name === 'aadhaar' || item.name === "aadhar") {
                  console.log("aadhar")
                  return (
                    <TextInputAadhar
                      required={item.required}
                      jsonData={item}
                      key={index}
                      verified={addharVerified}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      displayText = {t(item.name.toLowerCase().trim())}
                      label={item.label}
                    >
                      {' '}
                    </TextInputAadhar>
                  );
                }
                else if (item.name === 'pan') {
                  console.log("pan")
                  return (
                    <TextInputPan
                      required={item.required}
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      label={item.label}
                      displayText={item.name}
                      panVerified = {panVerified}
                    >
                      {' '}
                    </TextInputPan>
                  );
                }
                else if (item.name === 'gstin') {
                  console.log("gstin")
                  return (
                    <TextInputGST
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      label={item.label}>
                      {' '}
                    </TextInputGST>
                  );
                }
                else if ((item.name).trim().toLowerCase() === "city" ) {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location?.city}
                      displayText = {item.name}
                      label={item.label}
                      isEditable={true}
                    ></PrefilledTextInput>
                  )



                }
                else if ((item.name).trim().toLowerCase() === "pincode"   ) {
                 
                    return (
                      <PincodeTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        handleFetchPincode={handleFetchPincode}
                        placeHolder={item.name}
                        value={location?.postcode}
                        label={item.label}
                        displayText = {item.name}
                        maxLength={6}
                      ></PincodeTextInput>
                    )
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
                
                else if ((item.name).trim().toLowerCase() === "state"  ) {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location?.state}
                      label={item.label}
                      displayText = {item.name}
                      isEditable={false}
                    ></PrefilledTextInput>
                  )
                }
                else if ((item.name).trim().toLowerCase() === "district"  ) {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location?.district}
                      label={item.label}
                      displayText = {item.name}
                      isEditable={false}

                    ></PrefilledTextInput>
                  )



                }
                else if (item.name.trim().toLowerCase() === "dealer_name") {
                  return (
                    <View style={{ width: "90%" }}>
                      {mappedUserType && <DropDownForDistributor
                        state = {location?.state}
                        title={`Select ${mappedUserType}`}
                        header={`Select ${mappedUserType}`}
                        jsonData={{label:item.name,name:item.name}}
                        searchEnable={true}
                        data={[]}
                        type ={mappedUserType}
                        handleData={handleChildComponentData}
                      ></DropDownForDistributor>}
                  
                    </View>
                  );
                } 
                else {
                  return (
                    <TextInputRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      label={item.label}>
                      {' '}
                    </TextInputRectangle>
                  );
                }
              } else if (item.type === 'file') {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleChildComponentData}
                    key={index}
                    data={item.name}
                    label={item.label}
                    action="Select File"></ImageInput>
                );
              }
              else if (item.type === "select") {
                return (
                  <DropDownRegistration

                    title={item.name}
                    header={"Select user to map"}
                    jsonData={item}
                    data={item.options}
                    handleData={handleChildComponentData}
                  ></DropDownRegistration>
                )
              }
              
              else if (item.type === 'date') {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleChildComponentData}
                    data={item.label}
                    key={index}></InputDate>
                );
              }
            })}

{formFound && !hideButton  && <ButtonOval
            handleOperation={() => {
              setFormStage(2)
            }}
            content={t("Next")}
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              padding: 10,
              color: 'white',
              fontSize: 16,
            }}></ButtonOval>}
  {/* {console.log("sadbhjasbhjvfhjvhasjvhj",hideButton)}
          {formFound && !hideButton  && <ButtonOval
            handleOperation={() => {
              handleRegistrationFormSubmission();
            }}
            content={t("submit")}
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              padding: 10,
              color: 'white',
              fontSize: 16,
            }}></ButtonOval>} */}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({})

export default BasicInfo;