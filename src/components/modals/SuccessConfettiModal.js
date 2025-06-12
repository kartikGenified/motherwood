import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native-paper";
import { useSelector } from "react-redux";

const SuccessConfettiModal = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const {t} = useTranslation()
  const [isTertiary, setIsTertiary] = useState()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
  const userData = useSelector(state => state.appusersdata.userData)
  const title = props.title
  const header = props.header
  const message = props.message
  const buttonTitle = props.buttonTitle
  const navigateTo = props.navigateTo
  const params = props.params
  const navigation = props.navigation


  useEffect(()=>{
    if(props.openModal===true)
    {
        setModalVisible(true)
    }
    else{
        setModalVisible(false)
    }
  },[])

  const closeModal=()=>{
    setModalVisible(false)
    props.modalClose()
    if(navigateTo)
   {
    Platform.OS=='android' ? navigation.replace(navigateTo,params) : navigation.navigate(navigateTo,params)

   }
  }

  useEffect(()=>{
    if(
    (userData?.user_type)?.toLowerCase() == "contractor" ||
    (userData?.user_type)?.toLowerCase() == "carpenter" ||
    (userData?.user_type)?.toLowerCase() == "oem" ||
    (userData?.user_type)?.toLowerCase() == "directoem")
    {
      setIsTertiary(true)
    }
    else
    {
      setIsTertiary(false)
    }
    
  },[userData])


  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        props.modalClose();
        setModalVisible(!modalVisible);
        if (navigateTo) {
          Platform.OS == "android"
            ? navigation.replace(navigateTo, params)
            : navigation.navigate(navigateTo, params);
        }
      }}
    >
      <View style={styles.centeredView}>
      <ImageBackground style={{height:'100%',width:'100%'}} resizeMode="contain" source={isTertiary ? require('../../../assets/images/transparentBackgroundBlue.png') : require('../../../assets/images/transparentBackgroundred.png')}>
      <Image style={{height:100, width:100, resizeMode:'contain'}} source={require('../../../assets/images/checkedWhite.png')}></Image>
      <View style={{width:'60%',alignItems:'center', justifyContent:'center'}}>
      <PoppinsTextMedium
                  style={{
                    fontSize: 16,
                    color: "#000",
                  }}
                  content={title}
                ></PoppinsTextMedium>
      </View>
      <View style={{width:'60%',alignItems:'center', justifyContent:'center'}}>
      <PoppinsTextMedium
                  style={{
                    fontSize: 16,
                    color: "#000",
                  }}
                  content={header}
                ></PoppinsTextMedium>
      </View>
      <View style={{width:'80%',alignItems:'center', justifyContent:'center'}}>
      <PoppinsTextMedium
                  style={{
                    fontSize: 16,
                    color: "#000",
                  }}
                  content={message}
                ></PoppinsTextMedium>
      </View>

      <TouchableOpacity onPress={()=>{
        closeModal()
      }} style={{height:50,width:120,backgroundColor:'white',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
      <PoppinsTextMedium
                  style={{
                    fontSize: 16,
                    color: "#000",
                  }}
                  content={buttonTitle}
                ></PoppinsTextMedium>
      </TouchableOpacity>
      </ImageBackground>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 60,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "absolute",
  },
  button: {
    borderRadius: 10,
    padding: 14,
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
    color: "black",
  },
});

export default SuccessConfettiModal;
