import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  FlatList,
  Vibration,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ScannedListItem from "../../components/atoms/ScannedListItem";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import ButtonProceed from "../../components/atoms/buttons/ButtonProceed";
import { useSelector, useDispatch } from "react-redux";
import { slug } from "../../utils/Slug";
import MessageModal from "../../components/modals/MessageModal";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import { scannerType } from "../../utils/ScannerType";
import PrefilledTextInput from "../../components/atoms/input/PrefilledTextInput";
import { useTranslation } from "react-i18next";
import { useGetProductDataFromScanMutation } from "../../apiServices/assignTo/GetProductDataFromQR";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";

const AssignmentScanner = ({navigation,route}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [showButton, setShowButton] = useState(false)
  const [message, setMessage] = useState("");
  const [addedQrList, setAddedQrList] = useState([]);
  const [zoom, setZoom] = useState(0);
  const [zoomText, setZoomText] = useState("1");
  const [flash, setFlash] = useState(false);
  const [isReportable, setIsReportable] = useState(false)

  const height = Dimensions.get("window").height;
  const platform = Platform.OS === "ios" ? "1" : "2";
  const platformMargin = Platform.OS === "ios" ? -60 : -160;

  const userData = route.params.userData
  console.log("UserDATA", userData)
  const[getProductDataFromScanFunc,{
    data:getProductData,
    error:getProductError,
    isLoading:getProductDataIsLoading,
    isError: getProductDataIsError
  }] = useGetProductDataFromScanMutation()

  useEffect(()=>{
    if(getProductData)
    {
        console.log("getProductData",getProductData)

        const isExisting = addedQrList.some(item => item.id === getProductData?.body?.qr?.id);
      const qrData = getProductData?.body?.qr

    if (!isExisting) {
        let tempAddedQr = addedQrList
        tempAddedQr.push(qrData)
        setAddedQrList(tempAddedQr)
        console.log('QR code added:', qrData);
       
          setShowButton(true)
        
    } else {
        console.log('QR code already exists:', qrData);
    }
    }
    else if(getProductError)
    {
        console.log("getProductError",getProductError)
        setError(true)
        setMessage(getProductError?.data?.message)
    }
  },[getProductData,getProductError])

  const deleteQrFromList = code => {
    const removedList = addedQrList.filter((item, index) => {
      return item.unique_code !== code;
    });
    setAddedQrList(removedList);

  };

  const handleAddQr = () => {   
    navigation.navigate("PostAssignmentScreen",{addedQrList:addedQrList, userData:userData})
  };

  const onSuccess = async(e) => {
    console.log("Assignment Scanner", e.data);
    if (e.data === undefined) {
        setError(true)
        setMessage("Please scan a valid QR")
      }
      else {
        const tempVerifiedArray = [...addedQrList]
        const qrData = e.data.split('=')[1];
        console.log("qrData", qrData);
        const body = { unique_code: qrData, user_type: userData.user_type };
        const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log(
                'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username;
            const params = {token:token,body:body}
            getProductDataFromScanFunc(params)

            }
  };
}
const modalClose = () => {
  setError(false);
  setSuccess(false)
};

  return (
   
      <QRCodeScanner
        onRead={onSuccess}
        reactivate={true}
        vibrate={true}
        reactivateTimeout={2000}
        fadeIn={true}
        flashMode={
          !flash
            ? RNCamera.Constants.FlashMode.off
            : RNCamera.Constants.FlashMode.torch
        }
        customMarker={
          <View style={{ height: '100%', width: '100%', flexDirection: 'row' }}>
            <View
              style={{
                height: '36%',
                width: '80%',
                position: 'absolute',
                top: 70,
                alignItems: 'center',
                justifyContent: 'center',
                left: 0,
              }}>
              <PoppinsTextLeftMedium
                style={{
                  fontSize: 19,
                  color: 'white',
                  position: 'absolute',
                  left:130,
                  fontWeight:'800',
                  top: 0,
                  marginTop:-7,
                  
                  marginBottom:30,

            
                }}
                content="Scan Product QR Code"></PoppinsTextLeftMedium> 
              <View
                style={{
                  backgroundColor: 'transparent',
                  // borderWidth: 4,
                  // borderColor: '#1C45AB',
                  height: 240,
                  width: 240,
                  borderRadius: 5,
                  position: 'absolute',
                  right: 0,
                  top: 130,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                  <Image style={{height:246, width:260, }} source={require("../../../assets/images/frame.png")}></Image>
                <View
                  style={{
                    height: 40,
                    width: 80,
                    // backgroundColor: '#58585A',
                    borderRadius: 20,
                    marginBottom: 8,
                    flexDirection: 'row',
                  }}>
                  {/* <TouchableOpacity
                    onPress={() => {
                      setHelpModal(true)
                    }}
                    style={{
                      backgroundColor: 'black',
                      height: 34,
                      width: 34,
                      borderRadius: 17,
                      position: 'absolute',
                      left: 5,
                      top: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{ height: 16, width: 16, resizeMode: 'contain' }}
                      source={require('../../../assets/images/qrQuestionMark.png')}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleZoom();
                    }}
                    style={{
                      backgroundColor: 'black',
                      height: 34,
                      width: 34,
                      borderRadius: 17,
                      position: 'absolute',
                      right: 5,
                      top: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ fontSize: 14, color: '#FB774F' }}>
                      {zoomText}X
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
            <TouchableOpacity
                onPress={() => {
                  handleFlash();
                }}
                style={{ height: 54, width: 44, margin: 20 , position:'absolute', right:0, top:390}}>
                <Image
                  style={{ height: 54, width: 44, resizeMode: 'contain' }}
                  source={require('../../../assets/images/qrTourch2.png')}></Image>
              </TouchableOpacity>
            <View
              style={{
                width: '20%',
                height: '36%',
                position: 'absolute',
                // right: 0,
                top:50,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Dashboard');
                }}
                style={{ height: 34, width: 34, margin: 10, left: 20 }}>
                <Image
                  style={{ height: 34, width: 34, resizeMode: 'contain' }}
                  source={require('../../../assets/images/backIcon.png')}></Image>
              </TouchableOpacity>
           
              {/* <TouchableOpacity
                onPress={() => {
                  handleOpenImageGallery();
                }}
                style={{ height: 44, width: 44, margin: 20 }}>
                <Image
                  style={{ height: 44, width: 44, resizeMode: 'contain' }}
                  source={require('../../../assets/images/qrGallery.png')}></Image>
              </TouchableOpacity> */}
            </View>
          

          </View>
        }
        showMarker={true}
        cameraStyle={{ height: "100%" }}
        cameraProps={{ zoom: zoom }}
        bottomContent={
          <View
            style={{
              height: height - 440,
              backgroundColor: 'white',
              width: '100%',
              top: platformMargin,
              // borderRadius: 30,
              borderTopColor:"#1C45AB",
              borderWidth:1,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {error && (
              <ErrorModal
                modalClose={modalClose}
                isReportable={isReportable}
                message={message}
                openModal={error}
              ></ErrorModal>
            )}
            {success && (
              <MessageModal
                modalClose={modalClose}
                title="Success"
                message={message}
                openModal={success}
              ></MessageModal>
            )}
            {addedQrList?.length === 0 ? (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <ScrollView
                  contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                    marginTop: 60,
                  }}
                >
                  <Image
                    style={{ height: 100, width: 100, resizeMode: "contain" }}
                    source={require("../../../assets/images/qrIcon.png")}
                  ></Image>

                  <PoppinsTextLeftMedium
                    style={{ color: "#242424", fontWeight: "700", fontSize: 16, textAlign:'center', marginTop:30 }}
                    content="Please start scanning by pointing the camera towards the QR code"
                  ></PoppinsTextLeftMedium>
                </ScrollView>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FlatList
                  style={{ width: "100%", height: '56%' }}
                  data={addedQrList}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ScannedListItem
                        handleDelete={deleteQrFromList}
                        unique_code={item.unique_code}
                        index={index}
                        serialNo={item.batch_running_code}
                        productName={item.created_by_name}
                        productCode={item.product_code}
                        batchCode={item.batch_code}
                      ></ScannedListItem>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
                {showButton &&<ButtonProceed
                handleOperation={handleAddQr }
                style={{ color: 'white' }}
                content="Proceed"
                navigateTo={'AssignUser'}></ButtonProceed>}
              </View>
            )}
          </View>
        }
      />
   
  );
};

const styles = StyleSheet.create({});

export default AssignmentScanner;
