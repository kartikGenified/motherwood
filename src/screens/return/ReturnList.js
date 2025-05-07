import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import { useReturnInfoMutation, useReturnListMutation } from "../../apiServices/return/returnApi";
import * as Keychain from "react-native-keychain";
import { setError } from "../../../redux/slices/errorSlice";

const ReturnList = ({navigation}) => {
  const [data, setData] = useState();
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const { t } = useTranslation();

  const [
    returnListFunc,
    {
      data: returnListData,
      error: returnListError,
      isLoading: returnListIsLoading,
      isError: returnListIsError,
    },
  ] = useReturnListMutation();

  useEffect(() => {
    const fetchData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials?.username;
        const params = { token: token };
        returnListFunc(params);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (returnListData) {
      console.log("returnListData", returnListData);
      setData(returnListData?.data);
    } else if (returnListError) {
      console.log("returnListError", returnListError);
      setError(true)
      setMessage("Error in fetching return list")
    }
  }, [returnListData, returnListError]);


  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };
  const ListItem = (props) => {
    const [listData, setlistData] = useState()
    const [modalVisible, setModalVisible] = useState(false);
    const data = props.data;
    const index = props.index
    
    const [returnInfoFunc,{
      data:returnInfoData,
      error: retrunInfoError,
      isError:returnIsError,
      isLoading:returnIsLoading
    }] = useReturnInfoMutation()

    useEffect(()=>{
      if(modalVisible)
      {
        const getdata =async()=>{
          const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials?.username;
          const dta = {id:data?.id}
          const params = { token: token, data:dta};
          returnInfoFunc(params)
  
        }
      }
      getdata()
      }
      
    },[modalVisible])
    useEffect(()=>{
      if(returnInfoData)
      {
        console.log("returnInfoData",returnInfoData)
        if(returnInfoData.success)
        {
          setlistData(returnInfoData)
        }
      }

      else if(retrunInfoError)
      {
        console.log("retrunInfoError", retrunInfoError)
        setError(true)
        setMessage("A problem occured in fetching product return information")
        
      }
    },[returnInfoData,retrunInfoError])

    return (
      <>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
           
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',height:60}}>
              <PoppinsTextMedium
            style={{
              width:'50%',
              textAlign:'center',
              fontSize: 18,
              color: ternaryThemeColor,
              fontWeight:'700'

            }}
            content={`Product Name :`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              width:'50%',
              textAlign:'center',
              fontSize: 14,
              color: ternaryThemeColor,
            }}
            content={`${listData?.data[0]?.name}`}
          ></PoppinsTextMedium>
              </View>
              <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',height:60}}>
            
          <PoppinsTextMedium
            style={{
              width:'50%',
              textAlign:'center',
              fontSize: 18,
              color: ternaryThemeColor,
              fontWeight:'700'
            }}
            content={`Product Code :`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              width:'50%',
              textAlign:'center',
              fontSize: 14,
              color: ternaryThemeColor,
            }}
            content={`${listData?.data[0]?.product_code}`}
          ></PoppinsTextMedium>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',height:60}}>
            
          <PoppinsTextMedium
            style={{
              width:'50%',
              textAlign:'center',
              fontSize: 18,
              color: ternaryThemeColor,
              fontWeight:'700'

            }}
            content={`Batch Running Code :`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              width:'50%',
              textAlign:'center',
              fontSize: 14,
              color: ternaryThemeColor,
            }}
            content={`${listData?.data[0]?.batch_running_code}`}
          ></PoppinsTextMedium>
            </View>
            <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10}}>
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
            </View>

          
          </View>
        </Modal>
        <TouchableOpacity
        onPress={()=>{
          setModalVisible(!modalVisible)
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 80,
          borderRadius: 10,
          backgroundColor: "grey",
          elevation: 5,
          padding: 10,
          margin: 10,
          flexDirection: "row",
          gap:30
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor:'white'
          }}
        >
          <PoppinsTextMedium
            style={{
              fontSize: 20,
              color: ternaryThemeColor,
            }}
            content={index+1}
          ></PoppinsTextMedium>
        </View>
        <View style={{ alignItems: "flex-start", justifyContent: "center" }}>
          <PoppinsTextMedium
            style={{
              fontSize: 16,
              color: "white",
            }}
            content={`Received by name : ${data.received_by_name}`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              fontSize: 16,
              color: "white",
            }}
            content={`Ref ID: ${data.ref}`}
          ></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
      </>
      
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height: "100%",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: "10%",
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("Return List")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "white",
          }}
        ></PoppinsTextMedium>
      </View>
      <View
        style={{
          height: "90%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 30,
        }}
      >
        <FlatList
          initialNumToRender={20}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          style={{ width: "100%" }}
          data={data}
          renderItem={({ item, index }) => (
            <ListItem key={index} data={item} index = {index}></ListItem>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      {error && (
        <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={"Thanks"}
          message={message}
          openModal={success}
          navigateTo="ListAddress"
        ></MessageModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height:300,
    width:'100%',
    
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ReturnList;
