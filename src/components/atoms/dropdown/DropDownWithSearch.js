import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const DropDownWithSearch = (props) => {
  const [showList, setShowList] = useState(false);
  const { t } = useTranslation();
  const data = props.data;
  const placeholder = props.placeholder;
  const value = props.value;

  // Find the label to display from value (for array of objects)
  let displayLabel = placeholder;
  if (value) {
    if (typeof value === 'object') {
      displayLabel = value.name || value.label || placeholder;
    } else {
      // value is primitive, find object in data
      const found = Array.isArray(data) ? data.find(item => (item.value || item.name) === value) : null;
      displayLabel = found?.name || found?.label || value;
    }
  }

  const handleSelect = (data, item) => {
    setShowList(false);
    // Call parent handler with the selected item (object or primitive)
    props.handleData(item ? item : data);
  };
  
  const handleOpenList = () => {
    setShowList(!showList);
  };
  const handleSearch = (s)=>{
    console.log("searching", s)
    props.handleSearchData(s)
  }
  const SelectableDropDownComponent = (props) => {
    const title = props.title;
    const item = props.item
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelect(title, item);
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: "90%",
          height: 40,
        }}
      >
        <Text
          style={{ color: "black", fontSize: 14, textTransform: "capitalize" }}
        >
          {t(title)}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: "#F1F1F1",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 7,
      }}
    >
      {/* <View style={{width:'100%',alignItems:'flex-start',justifyContent:'center'}}>
            <PoppinsTextMedium style={{color:'black',fontSize:16,marginLeft:10}} content={name}></PoppinsTextMedium>

            </View> */}
      <TouchableOpacity
        onPress={() => {
          handleOpenList();
        }}
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 14,
            position: "absolute",
            left: 10,
            top: 10,
            textTransform: "capitalize",
          }}
        >
          {t(displayLabel)}
        </Text>
        <Image
          style={{
            height: 14,
            width: 14,
            resizeMode: "contain",
            position: "absolute",
            right: 10,
            top: 15,
          }}
          source={require("../../../../assets/images/arrowDown.png")}
        ></Image>
      </TouchableOpacity>

      {showList && (
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TextInput
              style={{
                backgroundColor: "white",
                width: "100%",
                color:'black',
                borderColor: "grey",
              }}

              onChangeText={(s) => {
                handleSearch(s);
              }}
              placeholderTextColor="grey"
              placeholder="Search"
            ></TextInput>
            {data &&
              data.map((item, index) => {
                return (
                  <SelectableDropDownComponent
                    key={index}
                    title={item?.name ? item?.name : item}
                    item = {item}
                  ></SelectableDropDownComponent>
                );
              })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default DropDownWithSearch;
