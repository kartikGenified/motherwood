import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
const RewardRectangular = (props) => {
    const image =props.image
    const amount =props.amount
    const title = props.title
    const color =props.color
    const imageHeight = title ==="Cashback" ? 60:40
    const imageWidth = title ==="Cashback" ? 60:40

    return (
        <View style={{height:100,width:180,borderRadius:10,alignItems:"center",justifyContent:"center",backgroundColor:color,margin:8, flexDirection:'row'}}>
            <Image style={{height:imageHeight,width:imageWidth,resizeMode:"contain",margin:10}} source={image}></Image>
            <View>
            <PoppinsText content ={amount} style={{fontSize:16,color:'black'}}></PoppinsText>
            <PoppinsTextMedium content={title} style={{fontSize:14,color:'black', fontWeight:'800'}}></PoppinsTextMedium>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({})

export default RewardRectangular;
