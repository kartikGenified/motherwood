//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as Keychain from "react-native-keychain";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import {
  useAddDreamGiftMutation,
  useDreamGiftListMutation,
  useSelectedDreamGiftMutation,
} from "../../apiServices/dreamGift/DreamGiftApi";
import moment from "moment";
import ErrorModal from "../../components/modals/ErrorModal";

// create a component
const DreamGift = () => {
  const [giftList, setGiftList] = useState([]);
  const [itemSelected, setitemSelected] = useState([]);
  const [selectedItem, setSelecteditem] = useState("");
  const [selecteditemId, setSelecteditemId] = useState("");
  const [addResponse, setAddResponse] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [isTertiary, setIsTertiary] = useState(false)
  // const [selected, setSelected] = useState(false);
  const navigation = useNavigation();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const userData = useSelector(state => state.appusersdata.userData)

  const [
    dreamListFunc,
    {
      data: dreamListData,
      error: dreamListError,
      isLoading: dreamListLoading,
      isError: dreamListIsError,
    },
  ] = useDreamGiftListMutation();

  const [
    dreamAddFunc,
    {
      data: dreamGiftAddData,
      error: dreamGiftAddError,
      isLoading: dreamGiftAddisLoading,
      isError: dreamGiftAddIsError,
    },
  ] = useAddDreamGiftMutation();

  useEffect(()=>{
    if((userData?.user_type)?.toLowerCase() == "contractor" ||
    (userData?.user_type)?.toLowerCase() == "carpenter" ||
    (userData?.user_type)?.toLowerCase() == "oem" ||
    (userData?.user_type)?.toLowerCase() == "directoem")
    {
      setIsTertiary(true)
    }
    else{
      setIsTertiary(false)
    }
    
  },[userData])


  console.log("dakshjdghjgjhwqgbcnqwkjjkwqghjg", isTertiary)
  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        let parmas = {
          token: token,
        };
        setToken(token);
        dreamListFunc(parmas);
      }
    };
    getToken();
    //   fetchFAQ();
  }, []);

  useEffect(() => {
    if (dreamListData) {
      console.log("dreamListData", dreamListData);
      setGiftList(dreamListData?.body);
    } else {
      console.log("DreamListError", dreamListError);
    }
  }, [dreamListData, dreamListError]);

  useEffect(() => {
    if (dreamGiftAddData) {
      console.log("dreamGiftAddData", dreamGiftAddData);

      navigation.navigate("DreamGiftDetails", {
        gift: dreamGiftAddData?.body,
        item: selectedItem,
      });
    } else {
      console.log("dreamGiftAddError", dreamGiftAddError);
      if (dreamGiftAddError) {
        setError(true);
        setMessage(
          dreamGiftAddError?.data?.message
            ? dreamGiftAddError?.data?.message
            : "Something went wrong"
        );
      }
    }
  }, [dreamGiftAddData, dreamGiftAddError]);

  useEffect(() => {
    console.log("addResponse", addResponse);
  }, [addResponse]);

  const addDreamGift = () => {
    let parmas = {
      token: token,
      body: {
        catalogue_id: selectedItem?.catalogue_id,
        gift_id: selectedItem?.gift_id,
        tenure: "365",
        start_date: moment(new Date()).format("YYYY-MM-DD"),
      },
    };

    console.log("json biody", JSON.stringify(parmas));
    if (selectedItem?.gift_id) {
      dreamAddFunc(parmas);
    } else {
      setError(true);
      setMessage("Please select a gift");
    }
  };

  const GiftCard = (props) => {
    let gift = props.gift.item;
    console.log("gift item", gift.gift_id);

    return (
      <View
        style={{
          width: "45%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          height: 240,
          borderRadius: 20,
          backgroundColor: "white",
          elevation: 5,
          shadowRadius: 10,
          shadowOffset: { width: 5, height: 5 },
          shadowColor: "black",
          margin: 10,
        }}
      >
        <Image
          source={{ uri: gift.images[0] }}
          style={{
            height: "56%",
            width: "90%",
            resizeMode: "cover",
            borderRadius: 20,
            marginTop: 20,
          }}
        ></Image>

        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            width: "90%",
            height: "30%",
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              color: "black",
              fontWeight: "600",
              fontSize: 15,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {gift.name.length > 30
              ? `${gift.name.substring(0, 30)}...`
              : `${gift.name.substring(0, 30)}`}
          </Text>
          <Text
            style={{
              color: ternaryThemeColor,
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 5,
              //   marginBottom: 5,
              justifyContent: "center",
              textAlign: "center",
              letterSpacing: 1.5,
            }}
          >
            {"Points " + gift.points}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onSelectItem(gift)}
          style={{
            borderWidth: 1,
            borderColor: ternaryThemeColor,
            height: 24,
            width: 24,
            backgroundColor:
              gift.gift_id == selecteditemId ? ternaryThemeColor : "white",
            borderRadius: 12,
            position: "absolute",
            top: 10,
            left: 20,
          }}
        ></TouchableOpacity>
      </View>
    );
  };

  const modalClose = () => {
    setError(false);
  };

  const onSelectItem = (item) => {
    console.log("gift item id", item);
    // setSelected(!selected);
    setSelecteditem(item);
    setSelecteditemId(item.gift_id);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 10, backgroundColor: ternaryThemeColor }}></View>

      <View style={{ height: "42%", width: "100%", alignItems: "center" }}>
         <Image
          source={isTertiary ? require("../../../assets/images/DreamGiftImageBlue.png") : require("../../../assets/images/DreamGiftImageRed.png")}
          style={{ height: "100%", width: "100%", resizeMode: "cover" }}
        ></Image>
      </View>
      <View style={{ height: "57%", width: "100%" }}>
        <FlatList
          data={giftList}
          keyExtractor={(item) => item.gift_id}
          numColumns={2}
          style={{ width: "100%" }}
          ListFooterComponentStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          // ListFooterComponent={() => {
          //   return (

          //   );
          // }}
          renderItem={(item, index) => {
            return <GiftCard id={item.gift_id} gift={item} />;
          }}
        ></FlatList>

        <TouchableOpacity
          style={{
            height: 50,
            width: "70%",
            alignSelf:'center',
            backgroundColor: "#D5B60B",
            marginBottom: 20,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            flexDirection: "row",
          }}
          onPress={() => {
            addDreamGift();
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
            NEXT
          </Text>
          <Image
            style={{
              marginLeft: 10,
              height: 20,
              width: 20,
              resizeMode: "contain",
            }}
            source={require("../../../assets/images/whiteArrowRight.png")}
          ></Image>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ position: "absolute", top: 10, left: 10 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          style={{
            marginLeft: 10,
            height: 30,
            width: 30,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/whiteBack2x.png")}
        ></Image>
      </TouchableOpacity>

      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

//make this component available to the app
export default DreamGift;
