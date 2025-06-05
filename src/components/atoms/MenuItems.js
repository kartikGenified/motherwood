import React,{useEffect,useState} from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import PoppinsTextMedium from "../electrons/customFonts/PoppinsTextMedium";
import { SvgUri } from "react-native-svg";
import ZoomViewAnimations from "../animations/ZoomViewAnimations";
import { useTranslation } from "react-i18next";
import { FAB } from "react-native-paper";

const MenuItems = (props) => {
  const [isTertiary, setIsTertiary] = useState(false)
  const colorShades = useSelector((state) => state.apptheme.colorShades);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
  const userData = useSelector(state => state.appusersdata.userData)

  const image = props.image;
  const content = props.content;
  const platformFontSize = Platform.OS === "ios" ? 8 : 10;
  const platformFontWeight = Platform.OS === "ios" ? "500" : "600";
  
  useEffect(()=>{
    if((userData.user_type).toLowerCase() == 'contractor' || (userData.user_type).toLowerCase() == 'carpenter' || (userData.user_type).toLowerCase() == 'oem' || (userData.user_type).toLowerCase() == 'directoem')
      {
        setIsTertiary(true)
      }
  },[])

  const { t } = useTranslation();
  // console.log("menu item images", image)
  const handlePress = () => {
    // console.log(content)
    props.handlePress(content);
  };

  // console.log(image)
  return (
    <View
      accessibilityLabel={String(props.index)}
      style={{
        margin:4
      }}
    >
      <TouchableOpacity
        onPress={() => {
          handlePress();
        }}
        style={{
          width: 96,
          borderRadius:5,
          borderWidth:1,
          borderColor:ternaryThemeColor,
          backgroundColor: secondaryThemeColor,
          alignItems: "center",
          justifyContent: "center",
          opacity: 1,
          paddingBottom:4
        }}
      >
        <Image
          style={{ height: 39, width: 39,marginTop:10,resizeMode:'contain' }}
          source={{ uri: image }}
        ></Image>
           <PoppinsTextMedium
        content={
          content == "Scan Qr" || content == "Scan QR"
            ? t("Scan QR")
            : content == "Activate Warranty"
            ? t("Activate Warranty")
            : content.toLowerCase() == "check genuinity"
            ? t("Check Genuinity")
            : content == "Passbook"
            ? t("Passbook")
            : content == "Product Catalogue"
            ? t("Product Catalogue")
            : content == "Report an Issue"
            ? t("Report an Issue")
            : content == "Customer Support"
            ? t("Customer Support")
            : t(content)
        }
        style={{
          width: 80,
          marginTop: 6,
          color:  !isTertiary ? ternaryThemeColor : "#00A79D",
          fontSize: platformFontSize,
          fontWeight: platformFontWeight,
        }}
      ></PoppinsTextMedium>
      </TouchableOpacity>
   
    </View>
  );
};

const styles = StyleSheet.create({});

export default MenuItems;
