import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,TextInput, FlatList } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Down from 'react-native-vector-icons/Entypo'
import * as Keychain from "react-native-keychain";
import { useGetZoneWiseEmployeeUserMutation } from '../../apiServices/userMapping/userMappingApi';
import TopHeader from '../../components/topBar/TopHeader';


const SearchInfluencer = () => {
    const secondaryThemeColor = useSelector(
        (state) => state.apptheme.secondaryThemeColor
      );

    const Input =(props)=>{
        const image  = props.image
        const placeholder = props.placeholder
        
        return(
            <View style={{width:'100%',flexDirection:'row',height:50, borderRadius:26, borderWidth:1,borderColor:"#DDDDDD",alignItems:'center',justifyContent:'center',marginTop:10,backgroundColor:'white'}}>
                <Image style={{height:20,width:20,resizeMode:'contain'}} source={image}></Image>
                <TextInput onChangeText={()=>{props.handleChange}} placeholderTextColor={"#717171"} placeholder={placeholder} style={{height:'100%',width:'80%'}}></TextInput>
            </View>
        )
    }

    const handleSearchByMobile=(data)=>{
        console.log(data)
    }

    const handleSearchByID=(data)=>{
        console.log(data)
    }
    return (
        <View>
        <TopHeader title={"Search Influencer"} />
        <View style={{height:'60%',width:'100%',backgroundColor:secondaryThemeColor,alignItems:'center', justifyContent:'flex-start'}}>
        <View style={{width:'90%',alignItems:'flex-start',justifyContent:'center',marginTop:20}}>
        <PoppinsTextMedium content={"Mobile No"} style={{color:'#1A1818',marginLeft:15,fontSize:16}}></PoppinsTextMedium>
        <Input handleChange={handleSearchByMobile} placeholder="Mobile No" image ={require('../../../assets/images/phoneoutline.png')}></Input>
        </View>

        <View style={{width:'90%',alignItems:'flex-start',justifyContent:'center',marginTop:10}}>
        <PoppinsTextMedium content={"Search by User ID"} style={{color:'#1A1818',marginLeft:15,fontSize:16}}></PoppinsTextMedium>
        <Input handleChange={handleSearchByID} placeholder="Search by User ID" image ={require('../../../assets/images/phoneoutline.png')}></Input>
        </View>
        <TouchableOpacity style={{height:50,width:'90%',backgroundColor:"black", marginTop:20, borderRadius:10,alignItems:'center', justifyContent:'center'}}>
        <PoppinsTextMedium content={"SUBMIT"} style={{color:'white',fontSize:18, fontWeight:'700'}}></PoppinsTextMedium>

        </TouchableOpacity>

        </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default SearchInfluencer;
