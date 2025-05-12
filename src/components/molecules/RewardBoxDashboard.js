//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const RewardBoxDashboard = ({name, points}) => {
    return (
        <View style={styles.container}>
            
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height:61,
        width:127,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default RewardBoxDashboard;
