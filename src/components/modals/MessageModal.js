import React, {useState,useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View,BackHandler, Platform, Image} from 'react-native';
import { useSelector } from 'react-redux';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
const MessageModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
  const {t} = useTranslation()
    const buttonText = props.buttonText
    const navigation = useNavigation()
    const navigateTo = props.navigateTo
    const params = props.params
    console.log(navigateTo,params)
    useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }, [])
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
   


  return (
    <View style={styles.centeredView}>
      <Modal
      
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            props.modalClose()
          setModalVisible(!modalVisible);
          if(navigateTo)
   {
    Platform.OS=='android' ? navigation.replace(navigateTo,params) : navigation.navigate(navigateTo,params)

   }
        }}>
        <View style={styles.centeredView}>
          <View style={{...styles.modalView}}>
          {/* <Icon name="cloud-done" size={100} color="#2FBA7E"></Icon> */}
          <Image style={{height:100, width:100,resizeMode:'contain'}} source={require('../../../assets/images/greenTick.png')}></Image>
          <Text style={{color:'black',fontSize:24,fontWeight:'600'}}>{t("Success")}</Text>
          <Text style={{...styles.modalText,fontSize:18,fontWeight:'500', color:'black',marginTop:20}}>{props.message}</Text>
            <Pressable
              style={{...styles.button,backgroundColor:'black',width:100}}
              onPress={() => closeModal()}>
              <Text style={styles.textStyle}>{t(buttonText ? buttonText  : "Done")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'

  },
  modalView: {
  
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 60,
    paddingTop:10,
    paddingBottom:40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position:"absolute",
   
  },
  button: {
    borderRadius: 10,
    padding: 14,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'black'
  },
});

export default MessageModal;