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

const DropDownWithSearchForms = (props) => {
  const [selected, setSelected] = useState(props.header);
  const [showList, setShowList] = useState(false);
  const [topMargin, setTopMargin] = useState(0);
  const [showOther, setShowOther] = useState(false);
const [listData, setListData] = useState(props.data)
  const { t } = useTranslation();
  const data = props.data;
  const required = props.required;
  console.log("datahgdfgasvdhasdasfasdasgsaa", props.jsonData);
  const name = props.title;
  console.log("Options", data);
  const handleSelect = (data) => {
    // console.log(data)
    if(data.city.toLowerCase()!='other')
    {
        setSelected(data.city);
        setShowList(false);
        let tempJsonData = { ...props.jsonData, value: data.city };
        console.log(tempJsonData);
        props.handleData(tempJsonData);
        let cityDataID = {"label": "CityID", "maxLength": "100", "name": "cityId", "options": ["Male", "Female"], "required": true, "type": "text", "value":data.id}
        props.handleData(cityDataID);

    }
    else{
        setSelected(data);
    }
    
  };

  useEffect(() => {
    if (selected.toLowerCase() == "other") {
      setShowOther(true);
    }
  }, [selected]);

  useEffect(()=>{
    setListData(props.data)
  },[props.data])

  const handleOpenList = () => {
    console.log("handling handleOpenList")
    setShowList(!showList);
    setShowOther(false)
    setSelected(props.header)
  };

  const handleSubmit=(data)=>{
    setSelected(data);
        setShowList(false);
        let tempJsonData = { ...props.jsonData, value: data };
        console.log(tempJsonData);
        props.handleData(tempJsonData);
  }

  const handleSearch = (text) => {
    if (!text) return []; // return empty if no search text
    
    const filteredCities = data.filter(city =>
      city?.city.toLowerCase().includes(text.toLowerCase())
    );
  
    setListData(filteredCities)
    
  };

  const SelectableDropDownComponent = (props) => {
    const title = props.title;
    const data = props.data
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelect(data);
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: "90%",
          height: 40,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
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
        backgroundColor: "white",
        width: "90%",
        borderBottomWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
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
            color: "black",
            textTransform: "capitalize",
          }}
        >{`${t(selected)} ${required ? "*" : ""}`}</Text>
        <Image
          style={{
            height: 14,
            width: 14,
            resizeMode: "contain",
            position: "absolute",
            right: 10,
            top: 10,
          }}
          source={require("../../../../assets/images/arrowDown.png")}
        ></Image>
      </TouchableOpacity>

      {showList && (
        <ScrollView style={{ width: "100%", minHeight: 100 }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TextInput onChangeText={(text)=>{
                handleSearch(text)
            }} style={{width:'92%',borderWidth:1, height:40,fontSize:14,marginTop:10,borderColor:'#DDDDDD',color:'black'}} placeholderTextColor="black" placeholder="Search City"></TextInput>
            {listData &&
              listData.map((item, index) => {
                // console.log(item)
                return (
                  <SelectableDropDownComponent
                    key={index}
                    data ={item}
                    title={item?.city}
                  ></SelectableDropDownComponent>
                );
              })}
            {showOther && (
                <View style={{ width:'100%',justifyContent:'center',marginTop:10,alignItems:'center'}}>
                <View style={{width:'90%',alignItems:'flex-start',justifyContent:'center'}}>
                <PoppinsTextMedium style={{color:"black"}} content={`Enter ${name}`}></PoppinsTextMedium>
              <TextInput
                style={{borderWidth:1,width:'90%',borderColor:'#DDDDDD',marginTop:4,color:'black'}}
                onChangeText={(text) => {
                  setSelected(text);
                }}
              ></TextInput>
              <TouchableOpacity style={{paddingLeft:8,paddingRight:8,padding:4,backgroundColor:"black",alignItems:'center', justifyContent:'center',marginLeft:30,marginTop:10,marginBottom:10,borderRadius:4,}} onPress={()=>{
                handleSubmit(selected)
              }}>
                <PoppinsTextMedium style={{color:"white"}} content={`Submit`}></PoppinsTextMedium>

              </TouchableOpacity>
              </View>
              </View>
            )}
            
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default DropDownWithSearchForms;
