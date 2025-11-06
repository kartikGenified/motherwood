import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";
import { useSelector } from "react-redux";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useTranslation } from "react-i18next";
import ButtonProceed from "../../components/atoms/buttons/ButtonProceed";
import { useListAssignApiMutation } from "../../apiServices/assignTo/ListAssignedToApi";
import * as Keychain from 'react-native-keychain';
import TopBar from "../../components/topBar/TopBar";
import Icon from "react-native-vector-icons/Entypo";
import TopHeader from "@/components/topBar/TopHeader";

const ListAssignedUsers = ({navigation}) => {
  const [showData, setShowData] = useState([])
  const [search, setSearch] = useState()
    const [listAssignedFunc, {
        data:listAssignedData,
        error:listAssignedError,
        isLoading:listAssignedIsLoading,
        isError:listAssignedIsError
    }] = useListAssignApiMutation()
    const userData = useSelector(state => state.appusersdata.userData);
  const { t } = useTranslation();

    useEffect(()=>{
        fetchList()
    },[])

    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      );

    const fetchList=async()=>{
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params={
            token:token,
            userId:userData.id,
            listType:1
        }
        listAssignedFunc(params)

    }

    useEffect(()=>{
        if(listAssignedData)
        {
            console.log("listAssignedData", listAssignedData)
            setShowData(listAssignedData?.body)
        }
        else if(listAssignedError)
        {
            console.log("listAssignedError", listAssignedError)
        }
    },[listAssignedData,listAssignedError])


      const handleSearch=(data)=>{
        const searchResult = listAssignedData?.body.filter((item, index)=>{
          return item.sell_to_mobile == data
        })
        console.log("searchResult",searchResult)
        setShowData(searchResult)
      }

    const AssignedUserComp=(props)=>{
        return(
            <View style={{alignItems:'center', justifyContent:'center',width:'94%',padding:15,marginTop:10,flexDirection:'row', backgroundColor:'white', borderRadius:10,alignSelf:'center'}}>
                {/* <View style={{width:'20%',alignItems:'center',justifyContent:'center'}}>
                    {
                    props?.data?.images!=null ? <Image style={{height:40,width:40,resizeMode:'contain'}} source={{uri:props?.data?.images[0]}}></Image>
                    :
                    <Image style={{height:40,width:40,resizeMode:'contain'}} source={require('../../../assets/images/box.png')}></Image>
                    }
                </View> */}
                <View style={{width:'100%',alignItems:'flex-start',justifyContent:'flex-start',flexWrap:'wrap'}}>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',width:'100%'}}>
                    <PoppinsTextLeftMedium style={{color:ternaryThemeColor,fontSize:14}} content="Name : "></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{color:'black',fontSize:14,marginLeft:10}} content={props?.data?.sell_to_app_user_name}></PoppinsTextLeftMedium>
                </View>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',marginTop:4,width:'100%'}}>
                    <PoppinsTextLeftMedium style={{color:ternaryThemeColor,fontSize:14}} content="Phone : "></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{color:'black',fontSize:14,marginLeft:10}} content={props?.data?.sell_to_mobile}></PoppinsTextLeftMedium>
                </View>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',marginTop:4,width:'100%'}}>
                    <PoppinsTextLeftMedium style={{color:ternaryThemeColor,fontSize:14}} content="User Type : "></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{color:'black',fontSize:14,marginLeft:10}} content={props?.data?.sell_to_user_type}></PoppinsTextLeftMedium>
                </View>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',marginTop:4,width:'100%'}}>
                    <PoppinsTextLeftMedium style={{color:ternaryThemeColor,fontSize:14}} content="Product Code : "></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{color:'black',fontSize:14,marginLeft:10}} content={props?.data?.product_code}></PoppinsTextLeftMedium>
                </View>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',marginTop:4,width:'100%'}}>
                    <PoppinsTextLeftMedium style={{color:ternaryThemeColor,fontSize:14}} content="Batch Running Code : "></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{color:'black',fontSize:14,marginLeft:10}} content={props?.data?.batch_running_code}></PoppinsTextLeftMedium>
                </View>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',marginTop:4,width:'100%'}}>
                    <PoppinsTextLeftMedium style={{color:ternaryThemeColor,fontSize:14}} content="Product Name : "></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{color:'black',fontSize:14,marginLeft:10}} content={props?.data?.product_name}></PoppinsTextLeftMedium>
                </View>
                </View>
            </View>
        )
    }


    return (
        <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",

      }}
    >
      {/* <View
        style={{
          height: "8%",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",

          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ height: 20, width: 20, marginLeft: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextLeftMedium
          style={{ fontSize: 20, color: "#ffffff", marginLeft: 10 }}
          content={t("Assigned User List")}
        ></PoppinsTextLeftMedium>

      </View> */}
      <TopHeader title={t("Assigned Product List")} />

      <View style={{alignItems:'center', flexDirection:'row',width:'80%',height:60,borderBottomWidth:1,borderColor:'#DDDDDD',margin:4,padding:6, backgroundColor:'white',borderRadius:10, marginTop:20 }}>
      {/* <PoppinsTextLeftMedium
          style={{ fontSize: 16, color: "black", marginLeft: 0,fontWeight:'700' }}
          content={t("Search Users")}
        ></PoppinsTextLeftMedium> */}
        <TextInput placeholder="Search Users" placeholderTextColor={"#888888"}  keyboardType="numeric" value={search} onChangeText={(val)=>{setSearch(val)}} style={{width:'90%',height:'100%',alignItems:"center",justifyContent:'center',borderColor:'#DDDDDD',borderRadius:20,paddingLeft:40,marginLeft:30,backgroundColor:"#F9F9F9",color:'black' }}></TextInput>
        <Icon
                style={{ position: "absolute", left: 45 }}
                name="magnifying-glass"
                size={25}
                color={ternaryThemeColor}
              ></Icon>
 
      </View>
      <TouchableOpacity onPress={()=>{
        handleSearch(search)
      }} style={{height:40,width:140,borderRadius:10,backgroundColor:ternaryThemeColor,alignItems:"center",justifyContent:'center',marginTop:10,marginBottom:10}}>
      <PoppinsTextLeftMedium
          style={{ fontSize: 16, color: "white", marginLeft: 0 }}
          content={t("Search")}
        ></PoppinsTextLeftMedium>
      </TouchableOpacity>

      {/* <View style={{width:'100%',height:'90%',alignItems:'center',justifyContent:'center'}}> */}
      <FlatList
      initialNumToRender={10}
          contentContainerStyle={{
          }}
          style={{width:'90%',marginBottom:20}}
          data={showData}
          renderItem={({ item, index }) => (
            <AssignedUserComp data = {item}></AssignedUserComp>
          )}
          keyExtractor={(item) => item.id}
          />
      {/* </View> */}
      
        </View>
    );
}

const styles = StyleSheet.create({})

export default ListAssignedUsers;
