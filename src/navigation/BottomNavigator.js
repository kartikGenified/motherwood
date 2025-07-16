import React, { useEffect, useState } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/dashboard/Dashboard";
import Gift from "react-native-vector-icons/AntDesign";
import Qrcode from "react-native-vector-icons/AntDesign";
import Book from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import Wave from "../../assets/svg/bottomDrawer.svg";
import PoppinsTextMedium from "../components/electrons/customFonts/PoppinsTextMedium";
import BookOpen from "react-native-vector-icons/Entypo";
import { useTranslation } from "react-i18next";
import FlipAnimation from "../components/animations/FlipAnimation";
import Tooltip from "react-native-walkthrough-tooltip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setStepId,
  setAlreadyWalkedThrough,
} from "../../redux/slices/walkThroughSlice";
import { needWalkedThrough } from "../utils/HandleClientSetup";

const Tab = createBottomTabNavigator();

//custom bottom drawer

function BottomNavigator({ navigation }) {
  const [requiresLocation, setRequiresLocation] = useState(false);
  const [walkthrough, setWalkThrough] = useState(false);
  const [step3, setStep3] = useState(false);

  const dispatch = useDispatch();
  const stepId = useSelector((state) => state.walkThrough.stepId);
  


  const { t } = useTranslation();

  const locationSetup = useSelector((state) => state.appusers.locationSetup);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const userData = useSelector((state) => state.appusersdata.userData);
  const workflow = useSelector((state) => state.appWorkflow.program);

  const platformFontWeight = Platform.OS === "ios" ? "400" : "800";
  console.log("workflow", workflow, userData);

  let isAlreadyWalkedThrough ;


   useEffect(() => {
    const getData = async () => {
      isAlreadyWalkedThrough = await AsyncStorage.getItem("isAlreadyWalkedThrough");
      // console.log("isAlreadyWalkedThrough",isAlreadyWalkedThrough)
      if( workflow.includes("Points On Product")){
        // console.log("isAlreadyWalkThrough", isAlreadyWalkedThrough, stepId);
        if ( !(isAlreadyWalkedThrough =="true") && stepId === 0 && needWalkedThrough) {
          setWalkThrough(false);
        } else if (stepId == 2) {
          setStep3(true);
        } else {
          setWalkThrough(false);
        }
      }
  }
  getData()



   
  }, [stepId]);

  const handleNextStep = () => {
    setWalkThrough(false);
    setStep3(false)
    console.log("stepIdddd", stepId)
    //step 1
    dispatch(setStepId(stepId + 1)); // Move to the next step
  };

  const handlePrevStep = () => {
    setWalkThrough(false);
    setStep3(false)
    dispatch(setStepId(stepId - 1)); // Move to the next step
  };

  const handleSkip = () => {
    dispatch(setStepId(0)); // Reset or handle skip logic
    dispatch(setAlreadyWalkedThrough(true)); // Mark walkthrough as completed
    setWalkThrough(false);
    setStep3(false)
  };

  useEffect(() => {
    if (locationSetup) {
      if (Object.keys(locationSetup)?.length != 0) {
        setRequiresLocation(true);
      }
    }
  }, [locationSetup]);

  return (
    <Tab.Navigator
      tabBar={() => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height:1,

          }}
        >

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 0,
              backgroundColor: "white",
              width: "100%",
            }}
          >
            {  console.log("workflow", workflow, )}
       
       
       
          </View>
        </View>
      )}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Home name="home" size={24} color={ternaryThemeColor}></Home>
          ),
        }}
        name="DashboardBottom"
        component={Dashboard}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator;
