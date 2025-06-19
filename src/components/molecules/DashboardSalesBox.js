//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// create a component
const DashboardSalesBox = ({backgroundColor, borderColor, icon, title,scoreOutOf, score}) => {
    console.log("Sales", scoreOutOf, score)
    return (
        <View style={{...styles.container, backgroundColor:backgroundColor, borderColor:borderColor}}>
            {icon &&
                <Image style={{height:40,width:40, marginTop:10}} source={icon}></Image>
            }
            <Text style={{fontSize:14, color:"black", marginTop:10,textAlign:'center', fontWeight:'600'}}>{title}</Text>
            <Text style={{fontSize:14, color:"#666666", marginTop:5,textAlign:'center',}}>{"Today / Total"}</Text>

            <Text style={{fontSize:14, color:"black", marginTop:5,textAlign:'center',fontWeight:'600'}}>{`${ (score == null || score== undefined) ? 0 : score} / ${ (scoreOutOf == null || scoreOutOf== undefined) ? 0 : scoreOutOf }`}</Text>




        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        marginHorizontal:10,
        height:150,
        borderWidth:1,
        borderRadius:10,
        alignItems:'center'
    },
});

//make this component available to the app
export default DashboardSalesBox;
