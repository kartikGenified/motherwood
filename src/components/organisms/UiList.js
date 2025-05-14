//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const UiList = ({ index, data, handleSearch, setSelected }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <View>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "bold" }}
            content={"Product/ SKU"}
          />
          <View style={{ width: 180 }}>
            <DropDownWithSearch
              handleSearchData={(t) => handleSearch(t)}
              handleData={(data) => setSelected(data)}
              placeholder={"Select Product"}
              data={data}
            />
          </View>
        </View>
  
        <View>
          <View
            style={{
              width: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PoppinsTextLeftMedium
              style={{ color: "black", fontWeight: "bold" }}
              content={"Thickness"}
            />
            <Text
              style={{
                marginTop: 15,
                backgroundColor: "#F1F1F1",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 7,
              }}
            >
              1.7
            </Text>
          </View>
        </View>
  
        <View>
          <PoppinsTextMedium
            style={{ color: "black", fontWeight: "bold" }}
            content={"Qty"}
          />
          <Text
            style={{
              marginTop: 15,
              backgroundColor: "#F1F1F1",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 7,
            }}
          >
            10
          </Text>
        </View>
      </View>
    );
  };
  

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default UiList;
