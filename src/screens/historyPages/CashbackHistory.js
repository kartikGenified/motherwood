import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import * as Keychain from "react-native-keychain";
import {
  useFetchCashbackEnteriesOfUserMutation,
  useFetchUserCashbackByAppUserIdMutation,
} from "../../apiServices/workflow/rewards/GetCashbackApi";
import DataNotFound from "../data not found/DataNotFound";
import AnimatedDots from "../../components/animations/AnimatedDots";
import {
  useGetCashTransactionsMutation,
  useGetRedeemptionListMutation,
} from "../../apiServices/cashback/CashbackRedeemApi";
import dayjs from "dayjs";
import { useIsFocused } from "@react-navigation/native";
import { useGetWalletBalanceMutation } from "../../apiServices/cashback/CashbackRedeemApi";
import Wallet from "react-native-vector-icons/Entypo";
import { useTranslation } from "react-i18next";
import {
  useCashPerPointMutation,
  useFetchUserPointsMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import ErrorModal from "../../components/modals/ErrorModal";
import { useFetchGiftsRedemptionsOfUserMutation } from "../../apiServices/workflow/RedemptionApi";
import { useGetkycStatusMutation } from "../../apiServices/kyc/KycStatusApi";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

const CashbackHistory = ({ navigation }) => {
  const [showNoDataFound, setShowNoDataFound] = useState(false);
  const [totalCashbackEarned, setTotalCashbackEarned] = useState(0);
  const [displayData, setDisplayData] = useState(false);
  const [minRedemptionPoints, setMinRedemptionPoints] = useState();
  const [pointBalance, setPointBalance] = useState();
  const [redemptionStartData, setRedemptionStartDate] = useState();
  const [redemptionEndDate, setRedemptionEndDate] = useState();
  const [message, setMessage] = useState();
  const [redeemedListData, setRedeemedListData] = useState([]);
  const [error, setError] = useState(false);
  const [showKyc, setShowKyc] = useState(true);
  const [success, setSuccess] = useState(false);
  const [navigateTo, setNavigateTo] = useState();

  const focused = useIsFocused();

  const userId = useSelector((state) => state.appusersdata.userId);
  const userData = useSelector((state) => state.appusersdata.userData);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#FFB533";

  console.log(userId);

  const { t } = useTranslation();

  // const [fetchCashbackEnteriesFunc, {
  //     data: fetchCashbackEnteriesData,
  //     error: fetchCashbackEnteriesError,
  //     isLoading: fetchCashbackEnteriesIsLoading,
  //     isError: fetchCashbackEnteriesIsError
  // }] = useFetchCashbackEnteriesOfUserMutation()

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  const [
    cashPerPointFunc,
    {
      data: cashPerPointData,
      error: cashPerPointError,
      isLoading: cashPerPointIsLoading,
      isError: cashPerPointIsError,
    },
  ] = useCashPerPointMutation();

  const [
    getKycStatusFunc,
    {
      data: getKycStatusData,
      error: getKycStatusError,
      isLoading: getKycStatusIsLoading,
      isError: getKycStatusIsError,
    },
  ] = useGetkycStatusMutation();

  const [
    FetchGiftsRedemptionsOfUser,
    {
      data: fetchGiftsRedemptionsOfUserData,
      isLoading: fetchGiftsRedemptionsOfUserIsLoading,
      isError: fetchGiftsRedemptionsOfUserIsError,
      error: fetchGiftsRedemptionsOfUserError,
    },
  ] = useFetchGiftsRedemptionsOfUserMutation();

  const [
    getCashTransactionsFunc,
    {
      data: getCashTransactionsData,
      error: getCashTransactionsError,
      isLoading: getCashTransactionsIsLoading,
      isError: getCashTransactionsIsError,
    },
  ] = useFetchCashbackEnteriesOfUserMutation();

  const [
    getRedemptionListFunc,
    {
      data: getRedemptionListData,
      error: getRedemptionListError,
      isError: getRedemptionListIsError,
      isLoading: getRedemptionListIsLoading,
    },
  ] = useGetRedeemptionListMutation();

  const [
    fetchCashbackEnteriesFunc,
    {
      data: fetchCashbackEnteriesData,
      error: fetchCashbackEnteriesError,
      isLoading: fetchCashbackEnteriesIsLoading,
      isError: fetchCashbackEnteriesIsError,
    },
  ] = useGetCashTransactionsMutation();

  // useEffect(() => {
  //   const getData = async () => {
  //     const credentials = await Keychain.getGenericPassword();
  //     if (credentials) {
  //       console.log(
  //         "Credentials successfully loaded for user " + credentials.username
  //       );
  //       const token = credentials.username;
  //       // const params = { token: token, appUserId: userData.id };
  //       const params = { token: token, appUserId: userData.id };
  //       getCashTransactionsFunc(cashparams);
  //       fetchCashbackEnteriesFunc(params)
  //     }
  //   };
  //   getData();
  // }, []);

  useEffect(() => {
    fetchPoints();
  }, [focused]);

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData);
      if (getKycStatusData.success) {
        const tempStatus = Object.values(getKycStatusData.body);
        setShowKyc(tempStatus.includes(false));
      }
    } else if (getKycStatusError) {
      console.log("getKycStatusError", getKycStatusError);
    }
  }, [getKycStatusData, getKycStatusError]);

  useEffect(() => {
    if (fetchGiftsRedemptionsOfUserData) {
      console.log(
        "fetchGiftsRedemptionsOfUserData",
        JSON.stringify(fetchGiftsRedemptionsOfUserData)
      );
      console.log("fetchGiftsRedemptionsOfUserData asdgjhashgdhjgshga",fetchGiftsRedemptionsOfUserData?.body?.userPointsRedemptionList)

      fetchDates(fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList);
    } else if (fetchGiftsRedemptionsOfUserError) {
      console.log(
        "fetchGiftsRedemptionsOfUserIsLoading",
        fetchGiftsRedemptionsOfUserError
      );
    }
  }, [fetchGiftsRedemptionsOfUserData, fetchGiftsRedemptionsOfUserError]);

  useEffect(() => {
    if (cashPerPointData) {
      console.log("cashPerPointData", cashPerPointData);
      if (cashPerPointData.success) {
        const temp = cashPerPointData?.body;
        setRedemptionStartDate(temp?.redeem_start_date);
        setRedemptionEndDate(temp?.redeem_end_date);
        setMinRedemptionPoints(temp?.min_point_redeem);
      }
    } else if (cashPerPointError) {
      console.log("cashPerPointError", cashPerPointError);
    }
  }, [cashPerPointData, cashPerPointError]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
      if (userPointData.success) {
        setPointBalance(userPointData?.body?.point_balance);
      }
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);
  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        // const params = { token: token, appUserId: userData.id };
        const cashparams = { token: token, userId: userData.id };

        const params = { token: token, appUserId: userData.id };

        getRedemptionListFunc(cashparams);
        fetchCashbackEnteriesFunc(params);
      }
    };
    getData();
  }, [focused]);

  useEffect(() => {
    if (getRedemptionListData) {
      console.log(
        "getRedemptionListData",
        JSON.stringify(getRedemptionListData)
      );
    } else if (getRedemptionListError) {
      console.log("getRedemptionListError", getRedemptionListError);
    }
  }, [getRedemptionListData, getRedemptionListError]);

  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const userId = userData.id;
      cashPerPointFunc(token);
      getKycStatusFunc(token);
      FetchGiftsRedemptionsOfUser({
        token: token,
        userId: userId,
        type: "1",
      });
    })();
  }, [focused]);

  useEffect(() => {
    if (fetchCashbackEnteriesData) {
      let cashback = 0;
      console.log(
        "fetchCashbackEnteriesData",
        JSON.stringify(fetchCashbackEnteriesData)
      );
      if (fetchCashbackEnteriesData.body) {
        for (var i = 0; i < fetchCashbackEnteriesData.body?.data?.length; i++) {
          if (fetchCashbackEnteriesData.body.data[i].approval_status === "1") {
            cashback =
              cashback + Number(fetchCashbackEnteriesData.body.data[i].cash);
            console.log(
              "fetchCashbackEnteriesData",
              fetchCashbackEnteriesData.body.data[i].cash
            );
          }
        }
        setTotalCashbackEarned(cashback);
      }
    } else if (fetchCashbackEnteriesError) {
      console.log("fetchCashbackEnteriesError", fetchCashbackEnteriesError);
    }
  }, [fetchCashbackEnteriesData, fetchCashbackEnteriesError]);

  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: userData.id,
      token: token,
    };
    userPointFunc(params);
    cashPerPointFunc(token);
  };

  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  const fetchDates = (data) => {
    const dateArr = [];
    let tempArr = [];
    let tempData = [];
    data.map((item, index) => {
      dateArr.push(dayjs(item.created_at).format("DD-MMM-YYYY"));
    });
    const distinctDates = Array.from(new Set(dateArr));
    console.log("distinctDates", distinctDates);

    distinctDates.map((item1, index) => {
      tempData = [];
      data.map((item2, index) => {
        if (dayjs(item2.created_at).format("DD-MMM-YYYY") === item1) {
          tempData.push(item2);
        }
      });
      tempArr.push({
        date: item1,
        data: tempData,
      });
    });
    setRedeemedListData(tempArr);
    console.log("tempArr", JSON.stringify(tempArr));
  };

  const handleRedeemButtonPress = () => {
    if (
      Number(new Date(redemptionStartData).getTime()) <=
        Number(new Date().getTime()) &&
      Number(new Date().getTime()) <=
        Number(new Date(redemptionEndDate).getTime())
    ) {
      console.log(
        "correct redemption date",
        new Date().getTime(),
        new Date(redemptionStartData).getTime(),
        new Date(redemptionEndDate).getTime()
      );

      console.log("cashPerPointData", cashPerPointData);
      navigation.navigate("RewardMenu");
    } else {

      console.log(
        "correct redemption date",
        new Date().getTime(),
        new Date(redemptionStartData).getTime(),
        new Date(redemptionEndDate).getTime()
      );
      setError(true);
      setMessage(
        "Redemption window starts from " +
          dayjs(redemptionStartData).format("DD-MMM-YYYY") +
          " and ends on " +
          dayjs(redemptionEndDate).format("DD-MMM-YYYY")
      );
      setNavigateTo("CashbackHistory");
    }
  };

  const Header = () => {
    return (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#DDDDDD",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <PoppinsTextMedium
          style={{
            marginLeft: 20,
            fontSize: 16,
            position: "absolute",
            left: 10,
            color: "black",
          }}
          content="Cashback Ledger"
        ></PoppinsTextMedium>
        {/* <View style={{ position: "absolute", right: 20 }}>
          <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>
          <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/list.png")}
          ></Image>
        </View> */}
      </View>
    );
  };

  const ListItem = (props) => {
    const {
      dataValue,
      data,            // This is now a single giftItem (not the whole redemption object)
      productCode,
      time,
      productStatus,
      amount,
    } = props;
  
    const description = data?.name ?? "No Description";
    const image = data?.images?.[0] ?? "";
  
    console.log("ListItem Gift Data:", dataValue);
  
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RedeemedDetails', { data:data, dataValue:dataValue });  // Only the gift item data
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          width: "100%",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            height: 70,
            width: 70,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#DDDDDD',
            right: 10,
          }}
        >
          <Image
            style={{ height: 50, width: 50, resizeMode: "contain" }}
            source={{ uri: image }}
          />
        </View>
  
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 0,
            width: 160,
          }}
        >
          <PoppinsTextMedium
            style={{ fontWeight: '600', fontSize: 16, color: 'black', textAlign: 'auto' }}
            content={description}
          />
  
          <View
            style={{
              backgroundColor: ternaryThemeColor,
              alignItems: 'center',
              justifyContent: "center",
              borderRadius: 4,
              padding: 3,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <PoppinsTextMedium
              style={{ fontWeight: '400', fontSize: 12, color: 'white' }}
              content={`${t("Product Status :")} ${productStatus}`}
            />
          </View>
  
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Image
              style={{ height: 14, width: 14, resizeMode: "contain" }}
              source={require('../../../assets/images/clock.png')}
            />
            <PoppinsTextMedium
              style={{ fontWeight: '200', fontSize: 12, color: 'grey', marginLeft: 4 }}
              content={time}
            />
          </View>
        </View>
  
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 40,
          }}
        >
          <PoppinsTextMedium
            style={{ color: ternaryThemeColor, fontSize: 18, fontWeight: "700" }}
            content={` - ${amount}`}
          />
          <PoppinsTextMedium
            style={{ color: "grey", fontSize: 14 }}
            content="PTS"
          />
        </View>
      </TouchableOpacity>
    );
  };
  const CashbackListItem = (props) => {
    const amount = props.items.cash;
    console.log("amount details", props);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CashbackDetails", { data: props.items });
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
          padding: 4,
          height: 150,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "80%",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 8,
          }}
        >
          {console.log("item of item", props)}
          <PoppinsTextMedium
            style={{
              color:
                props.items.approval_status === "2"
                  ? "red"
                  : props.items.approval_status === "3"
                  ? "orange"
                  : "green",
              fontWeight: "600",
              fontSize: 16,
            }}
            content={
              props.items.approval_status === "2"
                ? "Declined from the panel"
                : props.items.approval_status === "3"
                ? "Pending from the panel"
                : "Accepted from panel"
            }
          ></PoppinsTextMedium>
          {props.items.approval_status != "2" && (
            <PoppinsTextMedium
              style={{
                color:
                  props.items.status === "0"
                    ? "red"
                    : props.items.tatus === "2"
                    ? "orange"
                    : props.items.status === "0" && "green",
                fontWeight: "600",
                fontSize: 16,
              }}
              content={
                props.items.status === "0"
                  ? "Declined from the Bank"
                  : props.items.status === "2"
                  ? "Pending at the Bank"
                  : props.items.status == 1 && "Accepted by Bank"
              }
            ></PoppinsTextMedium>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/greenRupee.png")}
            ></Image>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`To :  ${props.items?.bene_details?.name} `}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`Transfer mode : ${props.items?.transfer_mode} `}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={` ${props.items?.transfer_mode} :  ${
                  props.items?.transfer_mode == "upi"
                    ? props.items?.bene_details?.vpa
                    : props.items?.bene_details?.bankAccount
                }  `}
              ></PoppinsTextMedium>

              {props.items?.bene_details?.ifsc && (
                <PoppinsTextMedium
                  style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                  content={`IFSC :  ${
                    props.items?.transfer_mode !== "upi" &&
                    props.items?.bene_details?.ifsc
                  }  `}
                ></PoppinsTextMedium>
              )}

              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={
                  dayjs(props.items.transaction_on).format("DD-MMM-YYYY") +
                  " " +
                  dayjs(props.items.transaction_on).format("HH:mm a")
                }
              ></PoppinsTextMedium>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "20%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black" }}
            content={"₹ " + props.items.cash}
          ></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    );
  };

  const WalletBar = (props) => {
    const amount = props.items.cash;
    console.log("amount details", props);
    return (
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
          padding: 4,
          borderWidth: 1,
          height: 100,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 8,
          }}
        >
          {console.log("item of item", props)}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/greenRupee.png")}
            ></Image>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`Points Consumed :  ${props.items?.points} `}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`Cashback amount : ₹ ${props.items?.cashbacks} `}
              ></PoppinsTextMedium>

              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={
                  dayjs(props.items.created_at).format("DD-MMM-YYYY") +
                  " " +
                  dayjs(props.items.created_at).format("HH:mm a")
                }
              ></PoppinsTextMedium>
            </View>
          </View>
        </View>
        {/* <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <PoppinsTextMedium style={{ color: 'black' }} content={"₹ " + props.items?.cashbacks}></PoppinsTextMedium>
        </View> */}
      </View>
    );
  };

  
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          
          height: "6%",
          backgroundColor:'#FFF8E7'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Passbook");
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
        <PoppinsTextMedium
          content={t("Redemption Summary")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "800",
            color: "black",
          }}
        ></PoppinsTextMedium>
        {/* <TouchableOpacity style={{ marginLeft: 160 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
      </View>
      <View
        style={{
          padding: 14,
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          flexDirection: "row",
          backgroundColor:'#FFF8E7',
          height:80
        }}
      >
        <Image
          style={{ width: 40, height: 40, marginTop: 10 }}
          source={require("../../../assets/images/coin.png")}
        ></Image>

        <View style={{ alignItems: "flex-start", justifyContent: "center" }}>
          {pointBalance && (
            <PoppinsText
              style={{
                marginLeft: 10,
                fontSize: 14,
                fontWeight: "600",
                color: "#373737",
              }}
              content={Math.trunc(pointBalance)}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{
              marginLeft: 10,
              fontSize: 14,
              fontWeight: "700",
              color: "black",
            }}
            content={t("Wallet Points")}
          ></PoppinsTextMedium>
        </View>
        <View
            style={{
              width: "40%",
              alignItems: "center",
              justifyContent: "flex-start",
              marginLeft:80
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleRedeemButtonPress();
              }}
              style={{
                height: 36,
                width: 100,
                backgroundColor: ternaryThemeColor,
                alignItems: "center",
                justifyContent: 'space-around',
                borderRadius: 18,
                flexDirection:'row',
                padding:4,
                margin:4
              }}
            >
          <Image style={{ height: 16, width: 16, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>

              <PoppinsTextMedium
                style={{ fontSize: 16, fontWeight: "600", color: "white" }}
                content={t("redeem")}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
      </View>
      {/* <Header></Header> */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          height: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setDisplayData(true);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            borderColor: ternaryThemeColor,
            borderBottomWidth: displayData ? 2 : 0,
            height: "100%",
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black" }}
            content={t("Bank/UPI Transfers")}
          ></PoppinsTextMedium>
        </TouchableOpacity>
        <View
          style={{ height: "100%", width: 2, backgroundColor: "#DDDDDD" }}
        ></View>
        <TouchableOpacity
          onPress={() => {
            setDisplayData(false);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            borderColor: ternaryThemeColor,
            borderBottomWidth: !displayData ? 2 : 0,
            height: "100%",
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black" }}
            content={t("Gifts")}
          ></PoppinsTextMedium>
        </TouchableOpacity>
      </View>
      {fetchCashbackEnteriesData?.body?.count === 0 &&
        fetchGiftsRedemptionsOfUserData?.body?.total === 0 && (
          <View style={{ width: "100%", height: "80%" }}>
            <DataNotFound></DataNotFound>
          </View>
        )}

      {displayData && fetchCashbackEnteriesData && (
        <FlatList
          initialNumToRender={20}
          contentContainerStyle={{
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          style={{ width: "100%" }}
          data={fetchCashbackEnteriesData?.body?.data}
          renderItem={({ item, index }) => (
            <CashbackListItem items={item}></CashbackListItem>
          )}
          keyExtractor={(item, index) => index}
        />
      )}
      {!displayData && fetchGiftsRedemptionsOfUserData && (
  <FlatList
    data={fetchGiftsRedemptionsOfUserData?.body?.userPointsRedemptionList}
    maxToRenderPerBatch={10}
    initialNumToRender={10}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => {
      const formattedDate = dayjs(item.created_at).format("DD MMM YYYY");

      return (
        <View
          key={index}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: 20,
              width: "100%",
            }}
          >
            <PoppinsTextMedium
              style={{ color: "black", fontSize: 16 }}
              content={formattedDate}
            />
          </View>

          {item.gift?.gift?.map((giftItem, idx) => (
            <View key={idx}>
              <ListItem
                dataValue = {item}
                data={giftItem}
                productStatus={item?.gift_status}
                description={giftItem?.name}
                productCode={item?.product_code}
                amount={giftItem?.points}
                time={dayjs(item?.created_at).format("hh:mm A")}
              />
            </View>
          ))}
        </View>
      );
    }}
  />
)}

      {error && navigateTo && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          navigateTo={navigateTo}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
        ></MessageModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default CashbackHistory;
