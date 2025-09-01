import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import Close from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
const BottomModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const type = props.type;
  const navigation = useNavigation();
  const navigateTo = props.navigateTo;
  const CompAadhaar = props.compAadhaar;
  const CompPan = props.compPan;
  const CompGstin = props.compGstin;
  const CompBankAccount = props.compBankAccount;
  const CompUpiAccount = props.compUpiAccount
  const Comps = props.comp
  const canGoBack = props.canGoBack;
  console.log("canGoBack", canGoBack, props.openModal, type, CompAadhaar);

  let Comp = null;
  if (type === "aadhaar") {
    Comp = CompAadhaar;
  } else if (type === "pan") {
    Comp = CompPan;
  } else if (type === "gstin") {
    Comp = CompGstin;
  }
  else if (type === "bank"){
    Comp = CompBankAccount
  }
  else if (type === "upi"){
    Comp = CompUpiAccount
  }
  else{
    Comp = Comps
  }

  const handleCompResp=(data)=>{
    props.handleCompResp(data)
  }

  useEffect(() => {
    if (props.openModal === true) {
      console.log("Trying to close the modal");
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [props.openModal]);

  const handleFilter = (data, type) => {
    console.log("filter", data, type);
    props.handleFilter(data, type);
  };

  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (canGoBack) {
            props.modalClose();
            setModalVisible(!modalVisible);
          } else {
            console.log("back action disbled");
          }
        }}
      >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={{position:'absolute', right:10,top:10}} onPress={()=>{
            console.log("cross button pressed")
          setModalVisible(false)
        }}>
        <Close  name="close" size={30} color="red" />
        </TouchableOpacity>
  <ScrollView
  style={{width:'100%', paddingTop:0,paddingBottom:160}}
    contentContainerStyle={{ flexGrow: 1}}
    keyboardShouldPersistTaps="handled"
  >
    {Comp && <Comp handleCompResp={handleCompResp} handleFilter={handleFilter} />}
  </ScrollView>
</View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    maxHeight: "70%", // ✅ LIMIT height so ScrollView inside can scroll
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    paddingBottom: 40,
    minHeight:400,
    padding:20
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default BottomModal;
