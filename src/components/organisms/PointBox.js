//import liraries
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DisplayPoints from "../atoms/DisplayPoints";
import { useNavigation } from "@react-navigation/native";
// create a component
const PointBox = (props) => {
    const [pointBalance , setPointBalance] = useState( props.pointBalance)
  const [numberWidth, setNumberWidth] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0)
  const { t } = useTranslation();
  const navigation = useNavigation()
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const dispatch = useDispatch();
  
  useEffect(()=>{
    const temp = String(pointBalance)
    console.log("qwertyuisdfzfgasdas",temp)
    if(temp.length<=5)
        {
            setNumberWidth(50)
            setButtonWidth(50)
        }
    if(temp.length>5)
        {
            setNumberWidth(80)
            setButtonWidth(20)
        }
    
  },[pointBalance])

  

  console.log("widfthsssss",numberWidth,buttonWidth,pointBalance)

  

  

  return (
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 20,
          flexDirection: "row",
          borderColor: "#808080",
          borderWidth: 0.3,
          borderRadius: 10,
          alignItems: "center",
          height: 60,
          width:'100%',
          
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: `${numberWidth}%`,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
            <DisplayPoints pointBalance = {pointBalance ? pointBalance : 0}/>
        </View>

          
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("RedeemedHistory");
            }}
            style={{
              backgroundColor: ternaryThemeColor,
              width:`${buttonWidth}%`,
              // borderRadius: 10,
              // borderTopLeftRadius:10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              // padding: 6,
            }}
          >
           {/* <TooltipComp></TooltipComp> */}
          </TouchableOpacity>
        </View>
      
  );
};

// define your styles
const styles = StyleSheet.create({
 
});

//make this component available to the app
export default PointBox;
