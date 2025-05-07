//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import Plus from 'react-native-vector-icons/AntDesign';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import { useFetchAllQrScanedListMutation } from '../../apiServices/qrScan/AddQrApi';
import { FlatList } from 'react-native';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useFetchGiftsRedemptionsOfUserMutation } from '../../apiServices/workflow/RedemptionApi';
import { useIsFocused } from '@react-navigation/native';
import { useGetRedeemedGiftsStatusMutation } from "../../apiServices/gifts/RedeemGifts";

// create a component
const AddedUserScanList = ({ navigation, route }) => {
  const [scannedListData, setScannedListData] = useState([]);
  const [status, setStatus] = useState("")

  const userData = useSelector(state => state.appusersdata.userData)

  const {t} = useTranslation()
  const focused = useIsFocused()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        

    const data = route.params.data;
      console.log("savhdgvghsvaghcvghvaghsvghcvghasvghcvghas",data)
    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation();

    const [redeemedGiftStatusFunc,{
      data:redeemedGiftStatusData,
      error:redeemedGiftStatusError,
      isLoading:redeemedGiftIsLoading,
      isError:redeemedGiftIsError
  }]= useGetRedeemedGiftsStatusMutation()

    const [
      FetchGiftsRedemptionsOfUser,
      {
        data: fetchGiftsRedemptionsOfUserData,
        isLoading: fetchGiftsRedemptionsOfUserIsLoading,
        isError: fetchGiftsRedemptionsOfUserIsError,
        error: fetchGiftsRedemptionsOfUserError,
      },
    ] = useFetchGiftsRedemptionsOfUserMutation();


    useEffect(() => {
      if (redeemedGiftStatusData) {
        console.log("redeemedGiftStatusData", redeemedGiftStatusData,data);
  
        const statArray = (redeemedGiftStatusData.body)
       
        
        setStatus(statArray)
      } else if (redeemedGiftStatusError) {
        console.log("redeemedGiftStatusError", redeemedGiftStatusError);
      }
    }, [redeemedGiftStatusData, redeemedGiftStatusError]);

    useEffect(()=>{
      const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          const params = {token:token}
          redeemedGiftStatusFunc(params)
        }
      }
      getToken()
    },[])

    useEffect(() => {
        console.log("AddedUserScanList", data)
        fetchPoints();
    }, [])

    useEffect(() => {
      const fetch=async()=>
       {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const userId = userData.id
        console.log("FetchGiftsRedemptionsOfUser", token, userId)
        FetchGiftsRedemptionsOfUser({
          token: token,
          userId: data?.mapped_app_user_id,
          type: "1",
  
        });
      }
      fetch()
    }, []);

    useEffect(() => {
      if (fetchGiftsRedemptionsOfUserData) {
        console.log("fetchGiftsRedemptionsOfUserData", JSON.stringify(fetchGiftsRedemptionsOfUserData))
        fetchDates(fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList)
     
      }
      else if (fetchGiftsRedemptionsOfUserError) {
        console.log("fetchGiftsRedemptionsOfUserIsLoading", fetchGiftsRedemptionsOfUserError)
      }
    }, [fetchGiftsRedemptionsOfUserData, fetchGiftsRedemptionsOfUserError])

    const fetchDates = (data) => {
      const dateArr = []
      let tempArr = []
      let tempData = []
      data.map((item, index) => {
        dateArr.push(dayjs(item.created_at).format("DD-MMM-YYYY"))
      })
      const distinctDates = Array.from(new Set(dateArr))
      console.log("distinctDates", distinctDates)
  
      distinctDates.map((item1, index) => {
        tempData = []
        data.map((item2, index) => {
          if (dayjs(item2.created_at).format("DD-MMM-YYYY") === item1) {
            tempData.push(item2)
          }
        })
        tempArr.push({
          "date": item1,
          "data": tempData
        })
      })
      setScannedListData(tempArr)
      console.log("tempArr", JSON.stringify(tempArr))
    }

    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        } else {
            console.log("userPointError", userPointError)
        }
    }, [userPointData, userPointError])

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
            userId: data.mapped_app_user_id,
            token: token
        }
        userPointFunc(params)
    }

    const ListItem = (props) => {
      const data = props.data
      const description = data.gift.gift[0].name
      const productCode = props.productCode
      const time = props.time
      const productStatus = status[props.data.gift.gift[0].status]
      const amount = props.data.gift.gift[0].points
      const image = data.gift.gift[0].images[0]
      console.log("data from listItem", data.gift.gift[0])
      return (
        <TouchableOpacity onPress={() => {
          navigation.navigate('RedeemedDetails', { data: data })
        }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, width: "100%", marginBottom: 10 }}>
          <View style={{ height: 70, width: 70, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD', right: 10 }}>
            <Image style={{ height: 50, width: 50, resizeMode: "contain" }} source={{ uri:image }}></Image>
          </View>
          <View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 0, width: 160 }}>
            <PoppinsTextMedium style={{ fontWeight: '600', fontSize: 16, color: 'black', textAlign: 'auto' }} content={description}></PoppinsTextMedium>
            <View style={{ backgroundColor: ternaryThemeColor, alignItems: 'center', justifyContent: "center", borderRadius: 4, padding: 3, paddingLeft: 5, paddingRight: 5 }}>
              <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'white' }} content={`${t("Product Status :")} ${productStatus}`}></PoppinsTextMedium>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
              <Image style={{ height: 14, width: 14, resizeMode: "contain" }} source={require('../../../assets/images/clock.png')}></Image>
              <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'grey', marginLeft: 4 }} content={time}></PoppinsTextMedium>
  
            </View>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 40 }}>
  
            <PoppinsTextMedium style={{ color: ternaryThemeColor, fontSize: 18, fontWeight: "700" }} content={` - ${amount}`}></PoppinsTextMedium>
            <PoppinsTextMedium style={{ color: "grey", fontSize: 14 }} content="PTS"></PoppinsTextMedium>
  
          </View>
        </TouchableOpacity>
      )
    }


   


    return (
        <View style={styles.container}>
            {/* Navigator */}
            <View
                style={{
                    height: '10%',
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems:'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, marginLeft:10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff',marginLeft:10}} content={t("Retailer Detail")}></PoppinsTextMedium>


            </View>
            {/* navigator */}

            <View style={{height:'90%',  width: '100%',alignItems:"flex-start", justifyContent: 'flex-start', paddingTop: 30 }}>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: 10, height:'20%'}}>
                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${userPointData?.body?.point_earned}`} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Earned Points`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>

                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={`${userPointData?.body?.point_redeemed}`}></PoppinsTextLeftMedium>
                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Point Redeemed`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>

                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            {/* <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${inactive}`}></PoppinsTextLeftMedium> */}

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${userPointData?.body?.point_balance}`} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Point Balance`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>


                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            {/* <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${inactive}`}></PoppinsTextLeftMedium> */}

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={String(Number(userPointData?.body?.point_reserved) + Number(userPointData?.body?.point_earned))} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Total Points`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>






                </ScrollView>

     
                    {/* {userList && userList?.body?.map((item, index) => {
                        return (
                            <UserListComponent userType={item.mapped_user_type} name={item.mapped_app_user_name} mobile={item.mapped_app_user_mobile} key={index} index={index} status={item.status} item={item}></UserListComponent>
                        )
                    })} */}
            

                
                {
                <FlatList
                    data={scannedListData}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    contentContainerStyle={{alignItems:'center',justifyContent:'center'}}
                    style={{height:'80%',width:'100%'}}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                // alignItems: "flex-start",
                                // justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <View
                                style={{
                                    // alignItems: "center",
                                    // justifyContent: "flex-start",
                                    paddingBottom: 10,
                                    marginTop: 20,
                                    marginLeft: 20,
                                }}
                            >
                                <PoppinsTextMedium
                                    style={{ color: "black", fontSize: 16 }}
                                    content={item.date}
                                ></PoppinsTextMedium>
                            </View>
                            <FlatList
                                data={item.data}
                                maxToRenderPerBatch={10}
                                initialNumToRender={10}
                                renderItem={({ item }) => (
                                    <ListItem
                                        data={item}
                                        description={item.product_name}
                                        productCode={item.product_code}
                                        time={dayjs(item.scanned_at).format("HH:mm a")}
                                    ></ListItem>
                                )}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => index}
                />
            }
            </View>
        </View>


    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:'100%',
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    box1: {
        height: 125,
        width: 140,
        alignItems: 'center',
        backgroundColor: "#FFF4DE",
        borderRadius: 10,
        // justifyContent: 'center'
        justifyContent: 'space-around',
        padding: 10,
        marginRight: 10
    },
    box2: {
        height: 125,
        width: 140,
        alignItems: 'center',
        backgroundColor: "#DCFCE7",
        borderRadius: 10,
        // justifyContent: 'center'
        justifyContent: 'space-around',
        padding: 10,
        marginRight: 10
    },
    box3: {
        height: 125,
        width: 140,
        alignItems: 'center',
        backgroundColor: "#FFE2E6",
        borderRadius: 10,
        // justifyContent: 'center'
        justifyContent: 'space-around',
        padding: 10,
        marginRight: 10
    },
    boxImage: {
        height: 51,
        width: 72
    },
    boxImage2: {
        height: 39,
        width: 38
    }
});

//make this component available to the app
export default AddedUserScanList;