import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
const RewardRectangular = (props) => {
    const image =props.image
    const amount =props.amount
    const title = props.title
    const color =props.color
    const imageHeight = title ==="Cashback" ? 40:30
    const imageWidth = title ==="Cashback" ? 30:20

    return (
        <View style={{width:110,borderRadius:8,alignItems:"center",justifyContent:"center",backgroundColor:color,margin:4, flexDirection:'row',padding:4,height:70}}>
            <Image style={{height:imageHeight,width:'25%',resizeMode:"contain",margin:2}} source={image}></Image>
            <View style={{marginLeft:4,alignItems:'center',justifyContent:'center',width:'70%'}}>
            <PoppinsTextMedium content ={amount} style={{fontSize:12,color:'black'}}></PoppinsTextMedium>
            <PoppinsTextMedium content={title} style={{fontSize:11,color:'black', fontWeight:'600'}}></PoppinsTextMedium>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default RewardRectangular;
