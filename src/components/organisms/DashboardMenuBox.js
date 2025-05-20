import React from 'react';
import {View, StyleSheet,ScrollView,Dimensions,Platform} from 'react-native';
import MenuItems from '../atoms/MenuItems';
import { BaseUrl } from '../../utils/BaseUrl';
import QrCodeScanner from '../../screens/camera/QrCodeScanner';
import { useSelector } from 'react-redux';

const DashboardMenuBox=(props)=>{
    const data = props?.data
    console.log("dahsjfjd", data)
    const navigation = props.navigation
    const width = Dimensions.get('window').width
    const requiresLocation = props.requiresLocation
    const handleMenuItemPress=(data)=>{
        if(data.substring(0,4).toLowerCase()==="scan" )
        {
           Platform.OS == 'android' ? navigation.navigate('EnableCameraScreen') : requiresLocation ? navigation.navigate('EnableLocationScreen',{navigateTo:"QrCodeScanner"}) : navigation.navigate('EnableLocationScreen',{navigateTo:"QrCodeScanner"})
        }
        else if(data.toLowerCase()==="passbook")
        {
            navigation.navigate("Passbook")
        }
        else if(data.toLowerCase()==="return goods")
        {
            Platform.OS =='android' ?  navigation.navigate("EnableCameraScreen",{navigateTo:"ScanReturn"}) : navigation.navigate("ScanReturn")
        }
        else if(data.toLowerCase()==="return list")
        {
            navigation.navigate("ReturnList")
        }
        else if(data.toLowerCase()==="Points Calculator")
            {
                // navigation.navigate("ReturnList")
            }
        
        else if(data.toLowerCase()==="checkout" || data.toLowerCase()==="assign" || data.toLowerCase()== "assign product")
        {
            navigation.navigate("AssignUser")
        }
        else if(data.toLowerCase() === "rewards"){
            navigation.navigate('RedeemRewardHistory')
        }
        else if(data.toLowerCase() === "profile"){
            navigation.navigate('Profile')
        }
        else if (data.toLowerCase() === "query list") {
            navigation.navigate('QueryList')
          }
        else if(data.toLowerCase() === "warranty list"){
            navigation.navigate('WarrantyHistory')
        }
        else if(data.toLowerCase() === "faqs" || data.toLowerCase() === "faq" ){
            navigation.navigate('FAQ')
        }
        else if(data.toLowerCase() === "scheme"){
            navigation.navigate("EnableLocationScreen",{navigateTo:"Scheme"})
        }
        else if(data.toLowerCase() === "kyc"){
            navigation.navigate("KycMotherhood")
        }
        else if(data.toLowerCase() === "bank details" || data.toLowerCase() === "bank account"){
            navigation.navigate('BankAccounts')
        }
        else if(data.toLowerCase().substring(0,5) === "check"){
            if(data?.toLowerCase().split(" ")[1]==="genuinity")
            navigation.navigate('ScanAndRedirectToGenuinity')

            else if(data?.toLowerCase().split(" ")[1]==="warranty")
            navigation.navigate('ScanAndRedirectToWarranty')
        }
        else if(data?.toLowerCase().substring(0,8) === "activate"){
            if(data?.toLowerCase().split(" ")[1]==="genuinity")
            navigation.navigate('ScanAndRedirectToGenuinity')
            else if(data?.toLowerCase().split(" ")[1]==="warranty")
            navigation.navigate('ScanAndRedirectToWarranty')
        }
        else if(data.toLowerCase() === "product catalogue"){
            navigation.navigate('ProductCatalogue')
        }
        else if(data.toLowerCase() === "add user" || data.toLowerCase() === "retailer list"){
            navigation.navigate('ListUsers')
        }
        else if(data.toLowerCase() === "customer support" || data.toLowerCase() === "help and support"){
            navigation.navigate('HelpAndSupport')
        }
        else if(data.toLowerCase() === "report an issue"){
            navigation.navigate('QueryList')
        }
        else if(data.toLowerCase() === "point calculator"){
            navigation.navigate('PointsCalculator')
        }
        else if(data.toLowerCase() === "point transfer"){
            navigation.navigate('PointsTransfer')
        }
    }

    return(
        <View style={{borderColor:'#DDDDDD',borderWidth:1.2,width:width,alignItems:"center",justifyContent:"center",backgroundColor:'white',padding:4}}>
        <View style={{width:'100%',flexWrap:"wrap",flexDirection:"row",alignItems:"center",justifyContent:'center'}}>
        {
            data.map((item,index)=>{
                return(
                   
                    <MenuItems handlePress={handleMenuItemPress} index ={index} key={index} image={item?.icon} content={item?.name}></MenuItems>
                   
                )
            })
            
        }
                    {/* <MenuItems handlePress={handleMenuItemPress} index ={data.length+1} key={data.length+1} image={"https://picsum.photos/200/300"} content={"Return Goods"}></MenuItems>
                    <MenuItems handlePress={handleMenuItemPress} index ={data.length+2} key={data.length+2} image={"https://picsum.photos/300/300"} content={"Return List"}></MenuItems> */}
                    {/* <MenuItems handlePress={handleMenuItemPress} key={data.length+3} image={`https://picsum.photos/200/200`} content={"Assign"}></MenuItems> */}


        </View>
        </View>
    )
}

export default DashboardMenuBox;
