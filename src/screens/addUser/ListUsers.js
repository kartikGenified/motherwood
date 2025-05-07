import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useListAddedUsersMutation } from '../../apiServices/listUsers/listAddedUsersApi';
import { useSelector, useDispatch } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import Plus from 'react-native-vector-icons/AntDesign';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import { useFetchUserMappingByAppUserIdAndMappedUserTypeMutation, useFetchUserMappingByUserTypeAndMappedUserTypeMutation } from '../../apiServices/userMapping/userMappingApi';
import DropDownRegistration from '../../components/atoms/dropdown/DropDownRegistration';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import FastImage from 'react-native-fast-image';
import { setCanMapUsers } from '../../../redux/slices/userMappingSlice';
import { useFetchAllQrScanedListMutation } from '../../apiServices/qrScan/AddQrApi';
import { useTranslation } from 'react-i18next';
import User from 'react-native-vector-icons/Entypo'
import Mobile from 'react-native-vector-icons/Entypo'
import Location from 'react-native-vector-icons/Entypo'

const ListUsers = ({ navigation }) => {

  const [selectedOption, setSelectedOption] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectUsers, setSelectUsers] = useState()
  const [userTypeList, setUserTypeList] = useState()
  const [active, setActive] = useState()
  const [inactive, setInactive] = useState()
  const {t} = useTranslation()
const dispatch = useDispatch()

  const pointSharingData = useSelector(state => state.pointSharing.pointSharing)


  const userData = useSelector(state => state.appusersdata.userData)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

  const allUsers = useSelector(state => state.appusers.value)
  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loaderNew.gif')).uri;

  var allUsersData = []
  var allUsersList = []

  const [listAddedUserFunc, {
    data: listAddedUserData,
    error: listAddedUserError,
    isLoading: listAddedUserIsLoading,
    isError: listAddedUserIsError
  }] = useFetchUserMappingByUserTypeAndMappedUserTypeMutation();

  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        const userId = userData.id
        const type = selectUsers
        const params = {
          token: token,
          app_user_id: userId,
          type: "retailer"
        }
        console.log("params",params)
        listAddedUserFunc(params);
      }
    }
    getData()
  }, [])

  useEffect(()=>{
    const userType = userData?.user_type;

    let options = ["influencer", "dealer", "consumer", "sales"];
  
    const keys = Object.keys(pointSharingData?.point_sharing_bw_user?.user)
  
    const values = Object.values(pointSharingData?.point_sharing_bw_user?.user)
  
    console.log("Keys values", keys, values)
  
    if (keys.includes(userData.user_type))
    {
        const index = keys.indexOf(userData.user_type)
        const tempuser = values[index]
        console.log("temp users", tempuser)
        setSelectedOption(tempuser)
        dispatch(setCanMapUsers(tempuser))
    }
  },[])

  


  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        const userId = userData.id
        const type = selectUsers
        const params = {
          token: token,
          app_user_id: userId,
          type: "retailer"
        }
        listAddedUserFunc(params);
      }
    }
    getData()


  }, [])

  useEffect(() => {
    if (listAddedUserData) {
      console.log("listAddedUserData", JSON.stringify(listAddedUserData));

      setUserList(listAddedUserData?.body)

      setTotalCount(listAddedUserData?.body.length)

      let activeArr = listAddedUserData.body?.filter((itm) => {
        return itm.user_status == "1"

      })

      let inactiveArr = listAddedUserData.body?.filter((itm) => {
        return itm.user_status !== "1"

      })
      // console.log("active", activeArr)

      // let inactiveArr = listAddedUserData.body?.map((itm)=>{
      //   if(itm.status !== 1){
      //     return itm.status
      //   }
      //   else{
      //     return []
      //   }

      // })

      // console.log("inactive arr", inactive)





      setActive(activeArr.length);

      setInactive(inactiveArr.length);

      // let tempArr = listAddedUserData.map((itm)=>{
      //     return itm.mapped_user_type
      // })
    }
    else if (listAddedUserError) {
      console.log("listAddedUserError", listAddedUserError)
    }
  }, [listAddedUserData, listAddedUserError])


  const handleData = (data) => {
    console.log("handle data", data)
    setSelectUsers(data?.value)



  }

  const searchUsers=(mobile)=>{
    const result = listAddedUserData.body.filter(user => user?.mapped_app_user_mobile.includes(mobile));
  console.log("searchUsers",mobile, result)
    // Return the result
    setUserList(result)
  }


  const UserListComponent = (props) => {
   
    const name = props.name
    const index = props.index + 1
    const userType = props.userType
    const mobile = props.mobile
    const status = props.status
    const data = props.item
    const state = data.state
    const city = data.city
    const pincode = data.pincode
    return (
      <TouchableOpacity style={{backgroundColor:"white", marginTop: 20,borderRadius:20,padding:4,width:'90%',elevation:4}} onPress={()=>{
        navigation.navigate("AddedUserScanList",{data:data})
      }}>
        <View style={{width: '100%', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* <View style={{ justifyContent: 'center', }}>
            <View style={{ height: 60, width: 60, borderRadius: 100, backgroundColor: '#80808019', alignItems: 'center', justifyContent: 'center' }}>
              <Image style={{ height: 30, width: 30, }} source={require('../../../assets/images/userGrey.png')}></Image>
            </View>
          </View> */}
          <View style={{ width: '90%', alignItems: "flex-start", justifyContent: 'center', padding: 4}}>
            <View style={{flexDirection:'row', marginBottom:8}}>
              <User size={20} color={"grey"} name='user'></User>
            <PoppinsTextMedium style={{ color: '#413E3E', fontWeight: "700", marginLeft:4,letterSpacing:1 }} content={`Name : ${name}`}></PoppinsTextMedium>

            </View>
            <View style={{flexDirection:'row', marginBottom:8}}>
              <User size={20} color={"grey"} name='user'></User>
            <PoppinsTextMedium style={{ color: '#413E3E', fontWeight: "700", marginLeft:4,letterSpacing:1 }} content={`User Type : ${userType}`}></PoppinsTextMedium>

            </View>
            <View style={{flexDirection:'row', marginBottom:8}}>
              <Mobile size={20} color={"grey"} name='mobile'></Mobile>
            <PoppinsTextMedium style={{ color: '#413E3E', fontWeight: "700", marginLeft:4,letterSpacing:1 }} content={`Mobile : ${mobile}`}></PoppinsTextMedium>

            </View>
            <View style={{flexDirection:'row', marginBottom:8}}>
              <User size={20} color={"grey"} name='location-pin'></User>
            <PoppinsTextMedium style={{ color: '#413E3E', fontWeight: "700", marginLeft:4,letterSpacing:1 }} content={`State : ${state}`}></PoppinsTextMedium>

            </View>
            <View style={{flexDirection:'row', marginBottom:8}}>
              <User size={20} color={"grey"} name='location-pin'></User>
            <PoppinsTextMedium style={{ color: '#413E3E', fontWeight: "700", marginLeft:4,letterSpacing:1 }} content={`City : ${city}`}></PoppinsTextMedium>

            </View>
            <View style={{flexDirection:'row', marginBottom:8}}>
              <User size={20} color={"grey"} name='location-pin'></User>
            <PoppinsTextMedium style={{ color: '#413E3E', fontWeight: "700", marginLeft:4,letterSpacing:1 }} content={`Pincode : ${pincode}`}></PoppinsTextMedium>

            </View>
            {/* <PoppinsTextMedium style={{ color: 'grey', fontWeight: "700" }} content={`Status : ${status == 1 ? "Active" : "Inactive"}`}></PoppinsTextMedium> */}


          </View>
        </View>
        <View style={{ backgroundColor: ternaryThemeColor, height: 50, justifyContent: 'center',borderRadius:10,elevation:4 }}>
          <PoppinsTextMedium style={{ color: 'white', fontWeight: "700",letterSpacing:2 }} content={`View Details`}></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ alignItems: "center", justifyContent: 'flex-start', width: '100%', backgroundColor: 'white', flex: 1 }}>
      {/* Navigator */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          backgroundColor: ternaryThemeColor,
          width: '100%',
          // marginTop: 10,
          height: '10%',
          // marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("Retailer List")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            // height:60,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>

      <View style={{ height: '90%', width: '100%', justifyContent: 'flex-start', paddingTop: 10 }}>
      {selectedOption.length===0 && <PoppinsTextMedium style={{color:'black',fontSize:16,margin:10}} content={t("There are no users to select")}></PoppinsTextMedium>}
          <View style={{width:'100%',flexDirection:"row",alignItems:"center",justifyContent:'center'}}>
        {/* <View style={{ width: '50%', justifyContent: 'flex-start', marginLeft: 10 }}>
          {
            selectedOption.length!==0 &&
            <DropDownRegistration
              title={selectedOption?.[0]}
              header={selectedOption?.[0] ? t("Select Type") :  selectUsers ? selectUsers : t("Select Type")}
              jsonData={{ "label": "UserType", "maxLength": "100", "name": "user_type", "options": [], "required": true, "type": "text" }}
              data={selectedOption}
              handleData={handleData}
            ></DropDownRegistration>
          }
          </View> */}
        
        
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:'100%'}}>
      
          <View style={{height:40,padding:8,borderRadius:10,backgroundColor:'grey',flexDirection:'row'}}>
          <PoppinsTextMedium
          content={t("Total Retailers : ")}
          style={{
            
            fontSize: 16,
            // height:60,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
          <PoppinsTextMedium
          content={totalCount}
          style={{
            
            fontSize: 16,
            // height:60,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
          </View>
         
          {listAddedUserData &&  <TextInput maxLength={10} onChangeText={(text)=>{
            searchUsers(text)
          }} placeholderTextColor={ternaryThemeColor} placeholder={t('Search mobile')} style={{alignItems:'center',justifyContent:'center',borderWidth:2,borderRadius:10,height:40,color:'grey',width:'50%',borderColor:ternaryThemeColor,fontSize:16,padding:4,marginLeft:20,paddingLeft:10}}>

          </TextInput>}
        </View>
       

     

        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 30 }}>
          {userList && userList?.map((item, index) => {
            return (
              <UserListComponent userType={item.mapped_user_type} name={item.mapped_app_user_name} mobile={item.mapped_app_user_mobile} key={index} index={index} status={item.user_status} item={item}></UserListComponent>
            )
          })}
        </ScrollView>


     
      </View>

      {
        listAddedUserIsLoading && <FastImage
          style={{ width: 100, height: 100, position:'absolute', marginTop: '70%' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      }

    </View>
  );
}

const styles = StyleSheet.create({
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
})

export default ListUsers;