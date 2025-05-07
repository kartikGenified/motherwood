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
import { useFetchDistributorBySearchMutation } from "../../../apiServices/qrScan/AddQrApi";
import * as Keychain from "react-native-keychain";

const DropDownForDistributor = (props) => {
  const [selected, setSelected] = useState(props.header);
  const [showList, setShowList] = useState(true);
  const [data, setData] = useState(props.data);
  const [searchQuery, setSearchQuery] = useState("");
  const [otherName, setOtherName] = useState("");

  const [showDistributorInput, setShowDistributorInput] = useState(false);

  let enableSearch = props.searchEnable ? props.searchEnable : false;
  const type = props.type
  const state = props.state
  const header = props.header
  console.log("jhhjshdhjcvhjvshjavchsvhavghcvghavvscjvhjasbcb",header)
  const [
    fetchDistributorList,
    {
      data: fetchDistributorListData,
      error: fetchDistributorListError,
      isLoading: fetchDistributorListIsLoading,
      isError: fetchDistributorListIsError,
    },
  ] = useFetchDistributorBySearchMutation();

  useEffect(() => {
    if (fetchDistributorListData) {
      console.log("fetchDistributorListData", fetchDistributorListData);
    } else {
      if (fetchDistributorListError) {
        console.log("fetchDistributorListError", fetchDistributorListError);
      }
    }
  }, [fetchDistributorListData, fetchDistributorListError]);

  useEffect(()=>{
    setSelected(type)
  },[type])

  const handleSelect = (data, mobile, id,jsonData) => {
    console.log("dataaaaaa selecteddddd", data,mobile,id);
    if (data == "Other") {
      setShowDistributorInput(true);
    } else {
      setSelected(data);
      setShowList(false);
      let tempJsonData = {
        ...props.jsonData,
        value: data,
        mobile: mobile,
        data:jsonData,
        id: id,
      };
      props.handleData(tempJsonData);
    }
  };

  const handleOpenList = () => {
    setShowList(!showList);
  };

  const handleSearchChange = async (text) => {
    setSearchQuery(text); // Update the search query state
    if (text.trim() === "") {
      setData(props.data); // Reset to original data if input is empty
      return;
    }
    try {
      const credentials = await Keychain.getGenericPassword();
      let response = [];
      if (text.length > 2) {
        response = await fetchDistributorList({
          user_type:type.toLowerCase(),
          state:state,
          mobile: text,
          name:text,
          token: credentials.username,
        }); // Call the API with the text
      }
      console.log("Responseeee", response);
      if (response?.data) {
        setData([...response.data?.body, { distributor_name: "Other" }]); // Update the dropdown list with API response
        console.log("responseData appr", data);
      }
    } catch (error) {
      console.error("Error fetching distributor list:", error);
    }
  };

  const SelectableDropDownComponent = (props) => {
    const title = props.title;
    const mobile = props.mobile;
    const id = props.id;
    const data = props.data
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelect(title, mobile, id,data);
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: 'space-around',
          width: "90%",
          height: 50,
          borderBottomWidth: 0.5,
          borderColor: "#808080",
          flexDirection:'row'
        }}
      >
        <Text
          style={{ color: "black", fontSize: 14, textTransform: "capitalize" ,color:'black'}}
        >
          {title}
        </Text>
        {id && <Text
          style={{ color: "black", fontSize: 14, textTransform: "capitalize" ,color:'black',marginLeft:20}}
        >
          {`User ID : ${id}`}
        </Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        width: "95%",
        borderBottomWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        paddingVertical: 10,
        borderWidth: 1,
      }}
    >
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
          {selected}
        </Text>
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
        />
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
            {enableSearch && (
              <TextInput
                style={{
                  width: "90%",
                  height: 60,
                  borderColor: "#808080",
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  color:'black'
                }}
                
                placeholderTextColor={'#808080'}
                placeholder={`Type ${selected} Name`}
                value={searchQuery}
                onChangeText={handleSearchChange} // Call handleSearchChange on text change
              />
            )}

            {data &&
              data.map((item, index) => {
                return (
                  <SelectableDropDownComponent
                    key={index}
                    mobile={item.mobile}
                    id={item.user_id}
                    title={item.name}
                    data = {item}
                  />
                );
              })}

            {showDistributorInput && (
              <TextInput
                style={{
                  width: "90%",
                  height: 50,
                  borderColor: "#DDDDDD",
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  color:'black'
                }}
                placeholderTextColor={'#808080'}
                placeholder="Please Enter The User Name To Map"
                value={otherName}
                onChangeText={(text) => {
                  setOtherName(text.toUpperCase());
                }}
                onEndEditing={(text) => {
                  handleSelect(otherName);
                }}
              />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default DropDownForDistributor;
