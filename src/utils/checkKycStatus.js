import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetkycDynamicMutation } from "../apiServices/kyc/KycDynamicApi";
import { useGetkycStatusMutation } from "../apiServices/kyc/KycStatusApi";
import * as Keychain from 'react-native-keychain';
import { setKycData } from "../../redux/slices/userKycStatusSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useKycValidation() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
  
    const [validCombinations, setValidCombinations] = useState([]);
    const [isValid, setIsValid] = useState(false);
  
    const [getKycDynamicFunc, { data: dynamicData, error: dynamicError }] =
      useGetkycDynamicMutation();
  
    const [
      getKycStatusFunc,
      {
        data: statusData,
        error: statusError,
        isLoading: statusLoading,
        isError: statusIsError,
      },
    ] = useGetkycStatusMutation();
  
    // function to fetch both APIs
    const fetchData = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials?.username;
          if (token) {
            getKycDynamicFunc(token);
            getKycStatusFunc(token);
          }
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    };
  
    // run once at mount
    useEffect(() => {
      fetchData();
    }, []);
  
    useEffect(() => {
      if (dynamicData?.success) {
        setValidCombinations(dynamicData.body?.valid_combinations || []);
      }
      if (dynamicError) {
        console.log("Error fetching KYC dynamic rules:", dynamicError);
      }
    }, [dynamicData, dynamicError]);
  
    useEffect(() => {
      if (statusData?.success) {
  
        if (validCombinations?.length) {
          const keyMapping = { aadhaar: "aadhar" };
          const valid = validCombinations.every((combo) => {
            const options = combo.split("-");
            return options.some((opt) => {
              const mappedKey = keyMapping[opt] || opt;
              return statusData.body?.[mappedKey];
            });
          });
          setIsValid(valid);
        }
      } else if (statusError) {
        if (statusError.status === 401) {
          const handleLogout = async () => {
            try {
              await AsyncStorage.removeItem("loginData");
              navigation.navigate("Splash");
              navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
            } catch (e) {
              console.log("error deleting loginData", e);
            }
          };
          handleLogout();
        } else {
          console.log("Can't get KYC status, kindly retry later:", statusError);
        }
      }
    }, [statusData, statusError, validCombinations]);
  
    return {
      isValid,
      statusLoading,
      statusIsError,
      refresh: fetchData, // 🔑 expose refresh
    };
  }
  