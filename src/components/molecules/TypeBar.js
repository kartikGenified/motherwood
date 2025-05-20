//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const TypeBar = ({placeholder,style, typeData, value}) => {
    const[selected, setSelected] = useState()
    return (
        <View style={styles.container}>
            
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height:50,
        width:'90%',

    },
});

//make this component available to the app
export default TypeBar;
