import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Bell from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/core";
import { BaseUrl } from "../../utils/BaseUrl";
import RotateViewAnimation from "../animations/RotateViewAnimation";
import FadeInOutAnimations from "../animations/FadeInOutAnimations";
import Tooltip from "react-native-walkthrough-tooltip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAlreadyWalkedThrough,
  setStepId,
} from "../../../redux/slices/walkThroughSlice";
import { useIsFocused } from "@react-navigation/native";
import PoppinsTextMedium from "../electrons/customFonts/PoppinsTextMedium";

const DrawerHeader = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const count = props.count
  const icon = useSelector((state) => state.apptheme.icon);
  const stepId = useSelector((state) => state.walkThrough.stepId);
  
  const isAlreadyWalkedThrough = useSelector((state) => state.walkThrough.isAlreadyWalkedThrough);
  let walkThrough = !isAlreadyWalkedThrough;
  

  console.log(
    "isAlreadyWalkedThroughasdjkasjdhj",
    walkThrough,
    stepId
  );
  //asynch storage data saving
  const storeData = async () => {
    try {
      await AsyncStorage.setItem("isAlreadyWalkedThrough", "true");
    } catch (e) {
      // saving error
      console.log("error", e);
    }
  };
  
  useEffect(() => {
    const checkWalkThroughStatus = async () => {
      const value = await AsyncStorage.getItem("isAlreadyWalkedThrough");
      const isWalkThroughDone = value === "true";
      if(isWalkThroughDone)
      {
        dispatch(setAlreadyWalkedThrough(true))
      }
     
    };
  
    if (focused) {
      checkWalkThroughStatus();
    }
  }, [focused]);

  useEffect(() => {
    console.log("FOCUSED:", focused);
    console.log("WALKTHROUGH:", walkThrough);
    console.log("STEP ID:", stepId);
  }, [focused, walkThrough, stepId]);

  


  const handleNextStep = () => {
    dispatch(setStepId(stepId + 1));
  };

  const handleSkip = () => {
    // dispatch(setStepId(0)); // Reset or handle skip logic
    dispatch(setAlreadyWalkedThrough(true)); // Mark walkthrough as completed
    storeData();
  };

  console.log("step ID changes", stepId);

  const BellComponent = () => {
    return (
      <TouchableOpacity
        style={{ height: 30, width: 30 }}
        onPress={() => {
          navigation.navigate("Notification");
        }}
      >
        <Bell name="bell" size={30} color={ternaryThemeColor}></Bell>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "white",
      }}
    >
      <Tooltip
        isVisible={walkThrough && stepId === 1}
        content={
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: "black",
                textAlign: "center",
                marginBottom: 10,
                fontWeight: "bold",
              }}
            >
              Hamburger button (Select for more menu)
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: ternaryThemeColor,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  marginRight: 12,
                }}
                onPress={() => handleSkip()}
              >
                <Text style={{ color: "white" }}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: ternaryThemeColor,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                }}
                onPress={() => handleNextStep()}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        placement="right"
        onClose={() => {
          walkThrough = false
        }}
        tooltipStyle={{ borderRadius: 30 }}
        contentStyle={{
          backgroundColor: "white",
          minHeight: 100,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: ternaryThemeColor,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ marginLeft: 10 }}
        >
          <Icon name="bars" size={30} color={ternaryThemeColor} />
        </TouchableOpacity>
      </Tooltip>

      <Image
        style={{ height: 50, width: 80, resizeMode: "cover", marginLeft: 10 }}
        source={{ uri: icon }}
      ></Image>
      <View style={{ position: "absolute", right: 10,top:20 }}>
        <Tooltip
          isVisible={walkThrough && stepId === 2}
          content={
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Check Notifications
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: ternaryThemeColor,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    marginRight: 12,
                  }}
                  onPress={() => handleSkip()}
                >
                  <Text style={{ color: "white" }}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: ternaryThemeColor,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                  }}
                  onPress={() => handleNextStep()}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          placement="left"
          onClose={() => {
            walkThrough = false
          }}
          tooltipStyle={{ borderRadius: 30 }}
          contentStyle={{
            backgroundColor: "white",
            minHeight: 70,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: ternaryThemeColor,
          }}
        >
          
        </Tooltip>
        <RotateViewAnimation outputRange={["0deg","30deg", "-30deg","0deg"]} inputRange={[0,1,2,3]} comp={BellComponent} style={{height:30,width:30,position:'absolute',right:10}}>
                    
                </RotateViewAnimation>
                {count!=0 && <View style={{backgroundColor:"orange",height:20,width:20,borderRadius:10,position:'absolute',right:10,top:-6}}>

                <PoppinsTextMedium style={{color:'white',fontSize:14,fontWeight:'bold'}} content={count}></PoppinsTextMedium>

                </View>}
      </View>
      {/* <FadeInOutAnimations comp = {BellComponent}></FadeInOutAnimations> */}
      {/* <BellComponent></BellComponent> */}
    </View>
  );
};

const styles = StyleSheet.create({
  skipButton: (color) => ({
    backgroundColor: color,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 12,
  }),
  nextButton: (color) => ({
    backgroundColor: color,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  }),
});

export default DrawerHeader;
