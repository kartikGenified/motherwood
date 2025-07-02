import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import {
  useFetchUserPointsMutation,
  useFetchUserPointsHistoryMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import FastImage from "react-native-fast-image";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import FilterModal from "../../components/modals/FilterModal";
import { useGetPointSharingDataMutation } from "../../apiServices/pointSharing/pointSharingApi";
import { dispatchCommand } from "react-native-reanimated";
import InputDate from "../../components/atoms/input/InputDate";
import { useTranslation } from "react-i18next";
import TopHeader from "../../components/topBar/TopHeader";
import { useGetOrderDetailsByTypeMutation } from "../../apiServices/order/orderApi";

const TransferredPointHistory = ({ navigation }) => {
  const [displayList, setDisplayList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const points = 100;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const addonfeatures = useSelector((state) => state.apptheme.extraFeatures);
  const registrationRequired = useSelector(
    (state) => state.appusers.registrationRequired
  );
  const userData = useSelector((state) => state.appusersdata.userData);
  const userId = useSelector((state) => state.appusersdata.id);

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
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  const [
    fetchUserPointsHistoryFunc,
    {
      data: fetchUserPointsHistoryData,
      error: fetchUserPointsHistoryError,
      isLoading: fetchUserPointsHistoryLoading,
      isError: fetchUserPointsHistoryIsError,
    },
  ] = useFetchUserPointsHistoryMutation();

  const [
    getOrderDetailsByTypeFunc,
    {
      data: getOrderDetailsByTypeData,
      error: getOrderDetailsByTypeError,
      isLoading: getOrderDetailsByTypeIsLoading,
      isError: getOrderDetailsByTypeIsError,
    },
  ] = useGetOrderDetailsByTypeMutation();

  

  const { t } = useTranslation();

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;
  const noData = Image.resolveAssetSource(
    require("../../../assets/gif/noData.gif")
  ).uri;
  let startDate, endDate;
  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      //   const startDate = dayjs(start).format(
      //     "YYYY-MM-DD"
      //   )
      //   const endDate = dayjs(end).format("YYYY-MM-DD")
      const data = {
        token:token,
        type:"transfer_point"
      }

      getOrderDetailsByTypeFunc(data);
    })();
  }, []);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPointHistoryData = (start, end) => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      //   const startDate = dayjs(start).format(
      //     "YYYY-MM-DD"
      //   )
      //   const endDate = dayjs(end).format("YYYY-MM-DD")
      const data = {
        token:token,
        type:"transfer_point",
        start_date:start,
        end_date:end
      
      }

      getOrderDetailsByTypeFunc(data);
    })();
  };
  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    console.log("userId", userId);
    const params = {
      userId: String(userId),
      token: token,
    };
    userPointFunc(params);
  };
  useEffect(() => {
    console.log("DisplayList", displayList);
  }, [displayList]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  useEffect(() => {
    if (getPointSharingData) {
      console.log("getPointSharingData", JSON.stringify(getPointSharingData));
      if (getPointSharingData.success) {
        setIsLoading(false);

        // setDisplayList(getPointSharingData.body.orders);
      }
    } else if (getPointSharingError) {
      console.log("getPointSharingError", getPointSharingError);
    } else if (getPointSharingIsLoading) {
      setIsLoading(true);
    }
  }, [getPointSharingData, getPointSharingError]);

  useEffect(() => {
    if (getOrderDetailsByTypeData) {
      console.log(
        "getOrderDetailsByTypeData",
        JSON.stringify(getOrderDetailsByTypeData)
      );

      if (getOrderDetailsByTypeData.success) {
        setIsLoading(false);
        setDisplayList(getOrderDetailsByTypeData.body.orders);
      }
    } else if (getOrderDetailsByTypeError) {
      console.log("getOrderDetailsByTypeError", getOrderDetailsByTypeError);
    }
  }, [getOrderDetailsByTypeData, getOrderDetailsByTypeError]);

  useEffect(() => {
    if (getPointSharingIsLoading || getOrderDetailsByTypeIsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [getPointSharingIsLoading, getOrderDetailsByTypeIsLoading]);

  const fetchDataAccToFilter = () => {
    console.log("fetchDataAccToFilter", startDate, endDate);
    if (startDate && endDate) {
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        alert(t("Kindly enter proper end date"));
        startDate = undefined;
        endDate = undefined;
      } else {
        fetchPointHistoryData(startDate, endDate);
      }
    } else {
      alert(t("Kindly enter a valid date"));
      startDate = undefined;
      endDate = undefined;
    }
  };

  const getRegistrationPoints = async (cause) => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      id: String(userData.id),
      cause: cause,
    };
    getPointSharingFunc(params);
  };

  //Point category tab
  const PointCategoryTab = () => {
    const [type, setType] = useState("");
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        style={{
          backgroundColor: "white",
          height: 70,
          elevation: 1,
          opacity: 0.8,
          borderWidth: 1,
          borderColor: "grey",
        }}
      >
        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              (async () => {
                const credentials = await Keychain.getGenericPassword();
                const token = credentials.username;

                const params = {
                  token: token,
                  userId: userId,
                };
                fetchUserPointsHistoryFunc(params);
              })();
              fetchPoints();
              setType("regular");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: type === "regular" ? "#DDDDDD" : "white",
            }}
          >
            {/* <PoppinsTextMedium content="Regular Points" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("regular points")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              getRegistrationPoints("points_sharing");
              setType("extra");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
              backgroundColor: type === "extra" ? "#DDDDDD" : "white",
            }}
          >
            <PoppinsTextMedium
              content={t("extra points")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              getRegistrationPoints("registration_bonus");
              setType("registration_bonus");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: type === "registration" ? "#DDDDDD" : "white",
            }}
          >
            {/* <PoppinsTextMedium content="Registration Bonus" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("Registration Bonus")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}

        {/* {registrationRequired.includes(userData.user_type) && 
                <TouchableOpacity onPress={()=>{
                    getRegistrationPoints("annual_kitty_2024_25")
                    setType("Annual Kitty")
                }} style={{height:'100%',width:120,alignItems:"center",justifyContent:'center',backgroundColor:type==="Annual Kitty" ? "#DDDDDD":"white"}}>
                    <PoppinsTextMedium content={t("Annual Kitty")} style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium>

                </TouchableOpacity>    
                } */}

        <TouchableOpacity
          onPress={() => {
            getRegistrationPoints("tds_deducted_2024_25");
            setType("TDS Deducted");
          }}
          style={{
            height: "100%",
            width: 120,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: type === "TDS Deducted" ? "#DDDDDD" : "white",
            borderLeftWidth: 1,
            borderColor: "#DDDDDD",
          }}
        >
          {/* <PoppinsTextMedium content="Registration Bonus" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
          <PoppinsTextMedium
            content={t("TDS Deducted")}
            style={{ color: "black", fontWeight: "700", fontSize: 14 }}
          ></PoppinsTextMedium>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  //header
  const Header = () => {
    const [openBottomModal, setOpenBottomModal] = useState(false);
    const [message, setMessage] = useState();
    const modalClose = () => {
      setOpenBottomModal(false);
    };

    const onFilter = (data, type) => {
      console.log("submitted", data, type);

      if (type === "start") {
        startDate = data;
      }
      if (type === "end") {
        endDate = data;
      }
    };

    const ModalContent = (props) => {
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");

      const handleStartDate = (startdate) => {
        // console.log("start date", startdate)
        setStartDate(startdate?.value);
        props.handleFilter(startdate?.value, "start");
      };

      const handleEndDate = (enddate) => {
        // console.log("end date", enddate?.value)
        setEndDate(enddate?.value);
        props.handleFilter(enddate?.value, "end");
      };
      return (
        <View
          style={{
            height: 320,
            backgroundColor: "white",
            width: "100%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          {/* {openBottomModal && <FilterModal
                        modalClose={modalClose}
                        message={message}
                        openModal={openBottomModal}
                        handleFilter={onFilter}
                        comp={ModalContent}></FilterModal>} */}

          <PoppinsTextMedium
            style={{
              marginLeft: 20,
              fontSize: 16,
              color: "black",
              marginTop: 20,
            }}
            content={t("Orders Filter")}
          ></PoppinsTextMedium>
          <TouchableOpacity
            onPress={() => {
              setOpenBottomModal(false);
            }}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/cancel.png")}
            ></Image>
          </TouchableOpacity>
          <View>
            <InputDate data={t("Start Date")} handleData={handleStartDate} />
          </View>
          <View>
            <InputDate data={t("End Date")} handleData={handleEndDate} />
          </View>
          <TouchableOpacity
            onPress={() => {
              fetchDataAccToFilter();
            }}
            style={{
              backgroundColor: ternaryThemeColor,
              marginHorizontal: 50,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 10,
            }}
          >
            <PoppinsTextMedium
              content="SUBMIT"
              style={{ color: "white", fontSize: 20, borderRadius: 10 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#DDDDDD",
          alignItems: "center",
          flexDirection: "row",

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
          content="Transfers Overview"
        ></PoppinsTextMedium>

        <TouchableOpacity
          onPress={() => {
            setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL");
          }}
          style={{ position: "absolute", right: 20 }}
        >
          <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/settings.png")}
          ></Image>
        </TouchableOpacity>

        {openBottomModal && (
          <FilterModal
            modalClose={modalClose}
            message={message}
            openModal={openBottomModal}
            handleFilter={onFilter}
            comp={ModalContent}
          ></FilterModal>
        )}
      </View>
    );
  };

  const DisplayEarnings = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_earned}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14, color: "black" }}
            content={t("Lifetime Earnings".toLowerCase())}
          ></PoppinsTextMedium>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_redeemed}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14, color: "black" }}
            content={t("Lifetime Burns".toLowerCase())}
          ></PoppinsTextMedium>
        </View>
        {/* <TouchableOpacity style={{ borderRadius: 2, height: 40, width: 100, backgroundColor: "#FFD11E", alignItems: "center", justifyContent: "center", marginLeft: 20, color: 'black' }}>
                    <PoppinsTextMedium style={{ color: 'black' }} content="Redeem"></PoppinsTextMedium>
                </TouchableOpacity> */}
      </View>
    );
  };

  const ListItem = (props) => {
   const orderNumber = props.orderNumber
   const sku = props.sku
   const quantity = props.quantity
   const date = props.date
   const points = props.points
   const item = props.item
    return (
      <TouchableOpacity
      onPress={()=>{
        navigation.navigate("OrderDetails",{
          item:item
        })
      }}
      style={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width:'90%',
        borderBottomWidth:1,
        paddingBottom:10,
        flexDirection:'row',
        paddingTop:10
      }}
    >
      
     
        <View style={{width:'80%', alignItems:'flex-start' ,justifyContent:'flex-start'}}>
        <PoppinsTextLeftMedium
          style={{ fontWeight: "800", fontSize: 13, color: "black" }}
          content={`${t("Order No")} : ${orderNumber}`}
        ></PoppinsTextLeftMedium>
        <View style={{flexDirection :'row', marginTop:3}}>
                 <PoppinsTextMedium
          style={{ fontWeight: "400", fontSize: 12, color: "black" }}
          content={`${t("Total SKU")} : ${sku}`}
        ></PoppinsTextMedium>
             <PoppinsTextMedium
          style={{ fontWeight: "400", fontSize: 12, color: "black" }}
          content={`${t(" | Quantity")} : ${quantity}`}
        ></PoppinsTextMedium>

        </View>
        <PoppinsTextMedium
          style={{ fontWeight: "400", fontSize: 12, color: "black" }}
          content={`${t("Date")} : ${date}`}
        ></PoppinsTextMedium>
        </View>
        
      <View style={{width:'20%',flexDirection:'row', alignItems:'center', justifyContent:'center', height:'100%'}}>
        <Image style={{height:25,width:25,resizeMode:'contain'}} source={require('../../../assets/images/coin.png')}></Image>
      <PoppinsTextMedium
        style={{ fontWeight: "700", fontSize: 15, color: "#91B406" , marginLeft:6}}
        content={`${Math.trunc(points)}`}
      ></PoppinsTextMedium>
      </View>
      
    </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <TopHeader title={"Transferred Points Summary"} />

      <View
        style={{
          backgroundColor: secondaryThemeColor,
          height: 70,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
         {getOrderDetailsByTypeData &&<View style={{ margin: 10, flexDirection: "row" }}>
          <Image source={require("../../../assets/images/coin.png")}></Image>
           <View style={{ marginLeft: 10 }}>
            <PoppinsTextLeftMedium
              style={{ fontSize: 18, color: "black", fontWeight: "800" }}
              content={getOrderDetailsByTypeData?.body?.totalPoints}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
              content={"Transferable Points"}
            ></PoppinsTextLeftMedium>
          </View>
          {
            (userData?.user_type)?.toLowerCase()!='carpenter' && (userData?.user_type)?.toLowerCase()!='contractor' && (userData?.user_type)?.toLowerCase()!='oem' && (userData?.user_type)?.toLowerCase()!='directoem' && 
            <TouchableOpacity style={{ backgroundColor:ternaryThemeColor, alignItems:'center', justifyContent:'center', borderRadius:30,height:45,width:150,marginLeft:10,flexDirection:'row'}} onPress={()=>{
              navigation.navigate('PointsTransfer')
  
          }}>
                       <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/gg.png')}></Image>

              <PoppinsTextMedium style={{color:'white', fontSize:14, fontWeight:'600',marginLeft:8}} content={"Points Transfer"}></PoppinsTextMedium>
          </TouchableOpacity>
          }
        
        </View>
}
      </View>

      <Header></Header>

      {displayList.length == 0 && !isLoading && (
        <View style={{ justifyContent:'center',marginTop:'40%'}}>
          <FastImage
            style={{ width: 180, height: 180, }}
            source={{
              uri: noData, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <PoppinsTextMedium
            style={{ color: "#808080", marginTop: -20, fontWeight: "bold" }}
            content="NO DATA"
          ></PoppinsTextMedium>
        </View>
      )}

      {isLoading && (
        <View style={{ backgroundColor: "white" }}>
          <FastImage
            style={{
              width: 100,
              height: 100,
              alignSelf: "center",
              marginTop: "50%",
            }}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
      {displayList && !isLoading && (
        <FlatList
          style={{ width: "100%", height: "60%" }}
          data={displayList}
          contentContainerStyle={{
            backgroundColor: "white",
            paddingBottom: 200,
            alignItems:'center',
            justifyContent:'center'
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            console.log(index + 1, item);
            return (
              <ListItem
              item= {item}
              orderNumber={item.order_no}
              sku = {item.total_sku}
              quantity = {item.qty}
              points={item.points}
                date={dayjs(item.created_at).format("DD-MMM-YYYY")}
                time={dayjs(item.created_at).format("HH:mm a")}
              />
            );
          }}
          keyExtractor={(item, index) => index}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default TransferredPointHistory;
