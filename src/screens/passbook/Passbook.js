import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import RewardBox from "../../components/molecules/RewardBox";
import {
  useGetActiveMembershipMutation,
  useGetMembershipMutation,
  useGetSavedMembershipMutation,
} from "../../apiServices/membership/AppMembershipApi";
import * as Keychain from "react-native-keychain";
import PlatinumModal from "../../components/platinum/PlatinumModal";
import { useGetPointSharingDataMutation } from "../../apiServices/pointSharing/pointSharingApi";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useTranslation } from "react-i18next";
import { neededHistory } from "../../utils/HandleClientSetup";
import PointsCard from "../../components/passbook/PointsCard";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import TopHeader from "@/components/topBar/TopHeader";

const Passbook = ({ navigation }) => {
  const [warrantyOptionEnabled, setWarrantyOptionEnabled] = useState(false);
  const [couponOptionEnabled, setCouponOptionEnabled] = useState(false);
  const [cashbackOptionEnabled, setCashbackOptionEnabled] = useState(false);
  const [wheelOptionEnabled, setWheelOptionEnabled] = useState(false);
  const [pointsOptionEnabled, setPointsOptionEnabled] = useState(false);
  const [PlatinumModalOpen, setPlatinumModal] = useState(false);
  const [listView, setListView] = useState(true);
  const [isTertiary, setIsTertiary] = useState()

  const [membershipModal, setMemberShipModal] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const shouldSharePoints = useSelector(
    (state) => state.pointSharing.shouldSharePoints
  );

  const { t } = useTranslation();

  const [
    getPointSharingFunc,
    {
      data: getPointSharingData,
      error: getPointSharingError,
      isLoading: getPointSharingIsLoading,
      isError: getPointSharingIsError,
    },
  ] = useGetPointSharingDataMutation();

  const [
    getMemberShipFunc,
    {
      data: getMemberShipData,
      error: getMemberShipError,
      isLoading: getMemberShipIsLoading,
      isError: getMemberShipIsError,
    },
  ] = useGetMembershipMutation();

  const [
    getActiveMembershipFunc,
    {
      data: getActiveMembershipData,
      error: getActiveMembershipError,
      isLoading: getActiveMembershipIsLoading,
      isError: getActiveMembershipIsError,
    },
  ] = useGetSavedMembershipMutation();

  const [pointSharing, setPointSharing] = useState(false);
  const colors = ["blue", "red", "green"];

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const userData = useSelector((state) => state.appusersdata.userData);

  console.log("userdata", userData);
  const workflowProgram = useSelector((state) => state.appWorkflow.program);
  const pointSharingData = useSelector(
    (state) => state.pointSharing.pointSharing
  );
  console.log(
    "pointSharingData",
    JSON.stringify(pointSharingData),
    workflowProgram
  );
  const name = userData.name;
  const membership =
    getActiveMembershipData && getActiveMembershipData.body?.tier?.name;

  const getOptionsAccordingToWorkflow = () => {
    if (workflowProgram?.includes("Warranty")) {
      setWarrantyOptionEnabled(true);
    }
    if (workflowProgram?.includes("Static Coupon")) {
      setCouponOptionEnabled(true);
    }
    if (workflowProgram?.includes("Points On Product")) {
      setPointsOptionEnabled(true);
    }
    if (workflowProgram?.includes("Cashback")) {
      setCashbackOptionEnabled(true);
    }
    if (workflowProgram?.includes("Wheel")) {
      setWheelOptionEnabled(true);
    }
  };
  useEffect(() => {
    getOptionsAccordingToWorkflow();
    getMembership();
  }, []);
  useEffect(() => {
    if( (userData?.user_type)?.toLowerCase() != 'carpenter' ||  (userData?.user_type)?.toLowerCase() != 'contractor' ||  (userData?.user_type)?.toLowerCase() != 'oem' ||  (userData?.user_type)?.toLowerCase() != 'directoem')
   {
    setIsTertiary(false)
   }
   else{
    setIsTertiary(true)
   }
  }, []);

  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const params = {
        token: token,
        id: String(userData.id),
        cause: "registration_bonus",
      };
      getPointSharingFunc(params);
    })();
  }, []);

  useEffect(() => {
    if (getMemberShipData) {
      console.log("getMemberShipData", JSON.stringify(getMemberShipData));
      if (getMemberShipData?.success) {
      }
    } else if (getMemberShipError) {
      if (getMemberShipError.status == 401) {
        const handleLogout = async () => {
          try {
            await AsyncStorage.removeItem("loginData");
            navigation.navigate("Splash");
            navigation.reset({ index: 0, routes: [{ name: "Splash" }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      } else {
        // setError(true);
        // setMessage("problem in fetching membership, kindly retry.");
        console.log("getMemberShipError", getMemberShipError);
      }
    }
  }, [getMemberShipData, getMemberShipError]);

  useEffect(() => {
    if (getPointSharingData) {
      console.log("getPointSharingData", JSON.stringify(getPointSharingData));
    } else if (getPointSharingError) {
      console.log("getPointSharingError", getPointSharingError);
    }
  }, [getPointSharingData, getPointSharingError]);

  const checkForPointSharing = () => {
    if (pointSharingData.is_point_sharing_bw_user) {
      setPointSharing(
        Object.keys(pointSharingData.point_sharing_bw_user.user).includes(
          userData.user_type
        )
      );
      console.log(
        "pointSharingData list",
        pointSharingData.point_sharing_bw_user.user
      );
    }
  };
  const getMembership = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      getMemberShipFunc(token);
      getActiveMembershipFunc(token);
    }
  };

  const closePlatinumModal = () => {
    setPlatinumModal(false);
  };

  useEffect(() => {
    checkForPointSharing();
  }, []);

  useEffect(() => {
    if (getActiveMembershipData) {
      console.log(
        "getActiveMembershipData",
        JSON.stringify(getActiveMembershipData)
      );
    } else if (getActiveMembershipError) {
      console.log("getActiveMembershipError", getActiveMembershipError);
    }
  }, [getActiveMembershipData, getActiveMembershipError]);

  const NavigateTO = (props) => {
    const title = props.title;
    const visibleTitle = props.visibleTitle;
    const discription = props.discription;
    const image = props.image;
    const navigateToPages = (data) => {
      console.log("navigateToPages", data);
      if (data === "Scanned History") {
        navigation.navigate("ScannedHistory");
      } else if (data === "Points History Extra") {
        navigation.navigate("ExtraPointHistory");
      } else if (data === "Points History Transferred") {
        navigation.navigate("TransferredPointHistory");
      } else if (data === "Points History") {
        navigation.navigate("PointHistory");
      } else if (data === "Redeemed History") {
        navigation.navigate("RedeemedHistory");
      } else if (data === "Cashback History") {
        navigation.navigate("CashbackHistory");
      } else if (data === "Coupon History") {
        navigation.navigate("CouponHistory");
      } else if (data === "Wheel History") {
        navigation.navigate("WheelHistory");
      } else if (data === "Warranty History") {
        navigation.navigate("WarrantyHistory");
      } else if (data === "Previous Transaction History") {
        console.log("PreviousTransactionHistory");
        navigation.navigate("PreviousTransactionHistory");
      } else if (data === "Shared Point History") {
        navigation.navigate("SharedPointsHistory");
      }
    };

    return (
      <TouchableOpacity
        onPress={() => {
          navigateToPages(title);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          width: "100%",
          borderColor: "#EEEEEE",
          padding: 6,
          
          height:60
        }}
      >
        <View
          style={{
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            borderColor: ternaryThemeColor,
            borderWidth: 1,
            // marginLeft: 10,
          }}
        >
          <Image
            style={{ height: 26, width: 26, resizeMode: "contain" }}
            source={image}
          ></Image>
        </View>
        <View
          style={{
            width: 190,
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 20,
            height:'100%',
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 12, fontWeight:"700" }}
            content={visibleTitle}
          ></PoppinsTextMedium>
         {discription && <PoppinsTextMedium
            style={{ color: "grey", fontSize: 12, textAlign: "left" }}
            content={discription}
          ></PoppinsTextMedium>}
        </View>
        <View
          
          style={{
            marginLeft: 10,
            borderWidth: 1,
            padding: 4,
            borderRadius: 20,
            borderColor: ternaryThemeColor,
          }}
        >
          <Image
            style={{ height: 12, width: 12, resizeMode: "contain" }}
            source={require("../../../assets/images/blackArrowRight.png")}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };

  const GridVIew = (props) => {
    const title = props.title;
    const discription = props.discription;
    const image = props.image;
    const navigateToPages = (data) => {
      console.log("navigateToPages", data);

      if (data === "Scanned History") {
        navigation.navigate("ScannedHistory");
      } else if (data === "Points History") {
        navigation.navigate("PointHistory");
      } else if (data === "Redeemed History") {
        navigation.navigate("CashbackHistory");
      } else if (data === "Cashback History") {
        navigation.navigate("CashbackHistory");
      } else if (data === "Coupon History") {
        navigation.navigate("CouponHistory");
      } else if (data === "Wheel History") {
        navigation.navigate("WheelHistory");
      }
      else if (data === "Transferred Points Summary") {
        navigation.navigate("TransferredPointHistory");
      }
      else if (data === "Warranty History") {
        navigation.navigate("WarrantyHistory");
      }
      else if (data === "Bonus Points Summary") {
        navigation.navigate("ExtraPointHistory");
      } else if (data === "Shared Point History") {
        navigation.navigate("SharedPointsHistory");
      } else if (data === "Previous Transaction History") {
        navigation.navigate("PreviousTransactionHistory");
      }
    };

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigateToPages(title);
          }}
          style={{
            flexDirection: "column",
            borderWidth: 2,
            width: 50,
            height: 50,
            borderColor: ternaryThemeColor,
            padding: 6,
            marginTop: 15,
            marginHorizontal: 22,
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={image}
            ></Image>
          </View>
        </TouchableOpacity>

        <View style={{ width: 80, marginTop: 6, alignSelf: "center" }}>
          <PoppinsTextMedium
            style={{
              color: "black",
              fontWeight: "800",
              fontSize: 14,
              textAlign: "center",
            }}
            content={title}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };


  return (
    <ScrollView contentContainerStyle={{flex:1}} style={{ width: "100%" }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View
        style={{
          alignItems: "center",
          height: "93%",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <PlatinumModal
          memberShip={getActiveMembershipData?.body?.tier?.name}
          isVisible={membershipModal}
          onClose={() => {
            setMemberShipModal(false);
          }}
          getActiveMembershipData={getMemberShipData}
        />
        {/* coloured header */}
          <TopHeader title={t("Passbook")} onBackPress={() => navigation.navigate("Dashboard")} />
        <View style={{ width: "100%", backgroundColor: secondaryThemeColor }}>
         {isTertiary!=undefined &&  <View style={{ width: "100%", marginTop: 20 }}>
            <PointsCard
              memberShip={getActiveMembershipData?.body?.tier?.name}
              refreshing={refreshing}
              setModalVisible={() => {
                setMemberShipModal(true);
              }}
            />
          </View>}
        </View>

        {listView && (
          <View
            style={{
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              borderRadius: 20,
              marginTop: 10,
              marginBottom:20
            }}
          >
            <View
              style={{
                width: "100%",
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderColor: "#EEEEEE",
              }}
            >
              <View
                style={{
                  width: "70%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getPointSharingData?.body?.total !== "0" ? (
                  <PoppinsTextMedium
                    style={{
                      color: ternaryThemeColor,
                      fontWeight: "bold",
                      position: "absolute",
                      left: 10,
                    }}
                    content={`${t("registration bonus")}: ${
                      getPointSharingData?.body?.data?.[0]?.points
                        ? getPointSharingData?.body?.data?.[0]?.points +
                          "Points"
                        : "loading"
                    } `}
                  ></PoppinsTextMedium>
                ) : (
                  <PoppinsTextMedium
                    style={{
                      fontWeight: "bold",
                      position: "absolute",
                      left: 10,
                      color:'black'
                    }}
                    content={t("Overview")}
                  ></PoppinsTextMedium>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  right: 10,
                  width: "10%",
                }}
              >
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: listView ? ternaryThemeColor : "white",
                    marginRight: 0,
                    paddingHorizontal: 7,
                    paddingVertical: 4,
                  }}
                  
                >
                  <Image
                    style={{ height: 15, width: 15, resizeMode: "contain" }}
                    source={require("../../../assets/images/listwhite.png")}
                  ></Image>
                </TouchableOpacity> */}

                
              </View>
            </View>

            {
              <NavigateTO
                visibleTitle={
                  userData?.user_type.toLowerCase() === "contractor" ||
                  userData?.user_type.toLowerCase() === "carpenter"
                    ? "Point History"
                    : t("Received Points Summary")
                }
                title={"Points History"}
                // discription={t("list of points redeemed by you")}
                image={require("../../../assets/images/rps.png")}
              ></NavigateTO>
            }

            {userData?.user_type?.toLowerCase() != "carpenter" &&
              userData?.user_type?.toLowerCase() != "contractor" &&
              userData?.user_type?.toLowerCase() != "oem" &&
              userData?.user_type?.toLowerCase() != "directoem" && (
                <NavigateTO
                  visibleTitle={t("Transferred Points Summary")}
                  title={"Points History Transferred"}
                  // discription={t("list of points redeemed by you")}
                  image={require("../../../assets/images/transferable.png")}
                ></NavigateTO>
              )}

            
              <NavigateTO
                visibleTitle={t("Bonus Points Summary")}
                title={"Points History Extra"}
                // discription={t("list of points redeemed by you")}
                image={require("../../../assets/images/rp.png")}
              ></NavigateTO>
            

            {/* ozone change */}
            {/* {userData.user_type !== "dealer" && neededHistory.includes("scanned") &&  <NavigateTO visibleTitle={t("scanned history")} title={"Scanned History"} discription={t('list of products scanned by you')} image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>} */}

            {/* {neededHistory.includes("redeemed") && (
              <NavigateTO
                visibleTitle={t("redeemed history")}
                title="Redeemed History"
                // discription={t("list of products redeemed by you")}
                image={require("../../../assets/images/redeemed_icon.png")}
              ></NavigateTO>
            )} */}
            {neededHistory.includes("cashback") && (
              <NavigateTO
                visibleTitle={t("redeemed history")}
                title="Cashback History"
                // discription={t("list of cashback claimed by you")}
                image={require("../../../assets/images/redeemedHistory.png")}
              ></NavigateTO>
            )}
            {/* {
                            // couponOptionEnabled &&
                            neededHistory.includes("coupon") &&
                            <NavigateTO visibleTitle={t("coupon history")} title="Coupon History" discription={t("list of coupons redeemed by you")} image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                        } */}
            {/* {
                warrantyOptionEnabled &&  */}
            {neededHistory.includes("warranty") && (
              <NavigateTO
                visibleTitle={t("warranty history")}
                title={"Warranty History"}
                // discription={t("list of warranty claimed by you")}
                image={require("../../../assets/images/warranty_icon.png")}
              ></NavigateTO>
            )}
            {/* } */}

            {cashbackOptionEnabled && neededHistory.includes("cashback") && (
              <NavigateTO
                visibleTitle={t("cashback history")}
                title="Cashback History"
                // discription={t("list of cashback claimed by you")}
                image={require("../../../assets/images/cashbackBlack.png")}
              ></NavigateTO>
            )}

            {wheelOptionEnabled && neededHistory.includes("wheel") && (
              <NavigateTO
                visibleTitle={t("wheel history")}
                title="Wheel History"
                discription=""
                image={require("../../../assets/images/scannedHistory.png")}
              ></NavigateTO>
            )}
            {(userData?.user_type).toLowerCase() == "distributor" &&
              pointSharing && (
                <NavigateTO
                  visibleTitle={t("shared point history")}
                  title="Shared Point History"
                  // discription=" list of shared points recieved by you"
                  image={require("../../../assets/images/shared_point.png")}
                ></NavigateTO>
              )}
            {/* <NavigateTO visibleTitle={t("previous transaction history")} title="Previous Transaction History" discription=" Previous transaction done by you" image={require('../../../assets/images/coinStack.png')}></NavigateTO> */}
          </View>
        )}

        {/* GridVIew */}
        {!listView && (
          <View
            style={{
              width: "90%",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              borderRadius: 20,
              marginTop: 10,
              alignItems: "center",
              marginBottom:10
            }}
          >
            <View
              style={{
                width: "100%",
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderColor: "#EEEEEE",
              }}
            >
              {getPointSharingData?.body?.total !== "0" ? (
                <PoppinsTextMedium
                  style={{
                    color: ternaryThemeColor,
                    fontWeight: "bold",
                    position: "absolute",
                    left: 20,
                  }}
                  content={`Registration Bonus : ${
                    getPointSharingData?.body?.data?.[0]?.points
                      ? getPointSharingData?.body?.data?.[0]?.points + "Points"
                      : t("Loading")
                  } `}
                ></PoppinsTextMedium>
              ) : (
                <PoppinsTextMedium
                  style={{ fontWeight: "bold", position: "absolute", left: 20 }}
                  content={t("Overview")}
                ></PoppinsTextMedium>
              )}
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  right: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: listView ? ternaryThemeColor : "white",
                    marginRight: 10,
                  }}
                  onPress={() => {
                    setListView(true);
                  }}
                >
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      paddingHorizontal: 10,
                    }}
                    source={require("../../../assets/images/list.png")}
                  ></Image>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: ternaryThemeColor,
                    borderWidth: 1,
                    borderColor: ternaryThemeColor,
                  }}
                >
                  <Image
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                    source={
                      listView
                        ? require("../../../assets/images/grid.png")
                        : require("../../../assets/images/gridwhite.png")
                    }
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View
              style={{
                flexDirection: "row",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                marginBottom:20
              }}
            >
              {
                <GridVIew
                  title={t("Points History")}
                  discription=" list of points redeemed by you"
                  image={require("../../../assets/images/coinStack.png")}
                ></GridVIew>
              }
              {userData?.user_type?.toLowerCase() != "carpenter" &&
                userData?.user_type?.toLowerCase() != "contractor" &&
                userData?.user_type?.toLowerCase() != "oem" &&
                userData?.user_type?.toLowerCase() != "directoem" && (
                  <GridVIew
                    title={t("Transferred Points Summary")}
                    discription=" list of points redeemed by you"
                    image={require("../../../assets/images/transferable.png")}
                  ></GridVIew>
                )}
              {
                <GridVIew
                  title={t("Bonus Points Summary")}
                  discription=" list of points redeemed by you"
                  image={require("../../../assets/images/rp.png")}
                ></GridVIew>
              }
                  {
                <GridVIew
                  title={t("redeemed history")}
                  discription=" list of products redeemed by you"
                  image={require("../../../assets/images/redeemed_icon.png")}
                ></GridVIew>
              }
            
              {(userData?.user_type).toLowerCase() == "distributor" &&
                pointSharing && (
                  <GridVIew
                    title="Shared Point History"
                    discription=" list of shared points received by you"
                    image={require("../../../assets/images/shared_point.png")}
                  ></GridVIew>
                )}
            </View> */}
          </View>
        )}

        {/* ----------------------------------- */}
      </View>
      {/* modals */}
      {PlatinumModalOpen && (
        <PlatinumModal
          isVisible={PlatinumModalOpen}
          onClose={closePlatinumModal}
          getActiveMembershipData={getActiveMembershipData}
        />
      )}
      
      <SocialBottomBar />
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Passbook;
