import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { useGetAppUsersDataMutation } from "@/apiServices/appUsers/AppUsersApi";
import SelectUserBox from "@/components/molecules/SelectUserBox";
import { setAppUsers } from "@/../redux/slices/appUserSlice";
import {
  setAppUserType,
  setAppUserName,
  setAppUserId,
  setUserData,
  setId,
} from "@/../redux/slices/appUserDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";
import hideUserFromLogin from "@/utils/hideUserFromLogin";
import FastImage from "react-native-fast-image";
import PoppinsTextLeftMedium from "@/components/electrons/customFonts/PoppinsTextLeftMedium";
import { useIsFocused } from "@react-navigation/native";
import BackUi from "@/components/atoms/BackUi";

const SelectUser = ({ navigation,route }) => {
  const [listUsers, setListUsers] = useState();
  const [showSplash, setShowSplash] = useState(true);
  const [connected, setConnected] = useState(true);
  const [isSingleUser, setIsSingleUser] = useState(true);
  const [needsApproval, setNeedsApproval] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState();
  // const primaryThemeColor = useSelector(
  //   (state) => state.apptheme.primaryThemeColor
  // );

  // const secondaryThemeColor = useSelector(
  //   (state) => state.apptheme.secondaryThemeColor
  // );

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const isFocused = useIsFocused(); // Track if screen is focused
  const icon = useSelector((state) => state.apptheme.icon);

  const otpLogin = useSelector((state) => state.apptheme.otpLogin);
  // console.log(useSelector(state => state.apptheme.otpLogin))
  const passwordLogin = useSelector((state) => state.apptheme.passwordLogin);
  // console.log(useSelector(state => state.apptheme.passwordLogin))
  const manualApproval = useSelector((state) => state.appusers.manualApproval);
  const autoApproval = useSelector((state) => state.appusers.autoApproval);
  const apiCallStatus = useSelector((state) => state.splashApi.apiCallStatus);
    console.log("select user screen apicall status", route.params)
  const registrationRequired = useSelector(
    (state) => state.appusers.registrationRequired
  );
  console.log("registration required", registrationRequired);
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/Splash-myronew.gif")
  ).uri;
  const width = Dimensions.get("window").width;

  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();
  const dispatch = useDispatch();

  useEffect(() => {

    getData();
    getUsers();

  }, []);

  useEffect(() => {
    if (!isFocused) return;
  
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "Exit", onPress: () => BackHandler.exitApp() },
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
  }, [isFocused]);

  useEffect(() => {
    if (getUsersData) {
      console.log("type of users", getUsersData?.body);
      const tempUsers = getUsersData?.body.filter(
        (item) => !hideUserFromLogin.includes((item.user_type).toLowerCase())
      );
      console.log(
        "new user data array after removing NON REQUIRED users",
        tempUsers
      );
      setUsers(tempUsers);
      if (tempUsers.length == 1) {
        setIsSingleUser(true);
      } else {
        setIsSingleUser(false);
      }
      dispatch(setAppUsers(tempUsers));
      setListUsers(tempUsers);
    } else if (getUsersError) {
      setErrorMessage("Error in getting profile data, kindly retry after sometime");
      console.log("getUsersError", getUsersError);
    }
  }, [getUsersData, getUsersError]);

  // useEffect(() => {
  //   if (isSingleUser && users) {
  //     console.log(
  //       "IS SINGLE USER",
  //       manualApproval,
  //       autoApproval,
  //       registrationRequired,
  //       users
  //     );

  //     if (registrationRequired.includes(users[0]?.name)) {
  //       setNeedsApproval(true);
  //       console.log("registration required");
  //       setTimeout(() => {
  //         navigation.navigate("VerifyOtp", route.params);
  //       }, 1000);
  //     } else {
  //       setNeedsApproval(false);
  //       console.log("registration not required");
  //       setTimeout(() => {
  //         navigation.navigate("VerifyOtp", route.params);
  //       }, 1000);
  //     }
  //   }
  // }, [isSingleUser, users]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("loginData");
      console.log("loginData", JSON.parse(jsonValue));
      if (jsonValue != null) {
        saveUserDetails(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log("Error is reading loginData", e);
    }
  };
  const saveUserDetails = (data) => {
    try {
      console.log("Saving user details", data);
      dispatch(setAppUserId(data?.user_type_id));
      dispatch(setAppUserName(data?.name));
      dispatch(setAppUserType(data?.user_type));
      dispatch(setUserData(data));
      dispatch(setId(data?.id));
      handleNavigation();
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleNavigation = () => {
    setTimeout(() => {
      setShowSplash(false);
      // navigation.navigate('Dashboard')
    }, 5000);
  };

  console.log("issingleuserqwerty", isSingleUser);

  return (
    <BackUi
      scrollable={!isSingleUser}
      style={styles.mainContainer}
      errorMessage={errorMessage}
    >
      {!isSingleUser ? (
        <LinearGradient
          colors={["#F0F8F6", "#F0F8F6"]}
          style={styles.container}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Image
              style={{
                height: 220,
                width: 220,
                resizeMode: "cover",
              }}
              source={require("@assets/images/MotherWoodCircle.png")}
            ></Image>
          </View>

          <View style={{ marginTop: "10%", marginBottom: 30 }}>
            <PoppinsTextLeftMedium
              style={{
                color: "#00A79D",
                fontSize: 22,
                fontWeight: "700",
                marginLeft: 40,
              }}
              content={t("Let's get started! I am a...")}
            />
          </View>

          <View style={styles.userListContainer}>
            {listUsers &&
              listUsers.map((item, index) => {
                return (
                  <SelectUserBox
                    style={{}}
                    navigation={navigation}
                    otpLogin={otpLogin}
                    passwordLogin={passwordLogin}
                    autoApproval={autoApproval}
                    manualApproval={manualApproval}
                    registrationRequired={registrationRequired}
                    key={index}
                    mobile={route?.params?.mobile}
                    color={ternaryThemeColor}
                    image={item.user_type_logo}
                    content={item.user_type}
                    id={item.user_type_id}
                  ></SelectUserBox>
                );
              })}
          </View>
        </LinearGradient>
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <FastImage
            style={{ width: "100%", height: "100%", alignSelf: "center" }}
            source={{
              uri: gifUri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
    </BackUi>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F0F8F6",
  },
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#00A79D",
  },
  semicircle: {
    backgroundColor: "#F0F8F6",
    position: "absolute",
  },
  banner: {
    height: 184,
    width: "90%",
    borderRadius: 10,
  },
  userListContainer: {
    width: "100%",
    flexDirection: "row",

    flexWrap: "wrap",
    justifyContent:'center',

  },
});

export default SelectUser;
