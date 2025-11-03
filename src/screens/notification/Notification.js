import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
  } from 'react-native';
import { useSelector } from "react-redux";
import { useFetchNotificationListMutation } from "../../apiServices/pushNotification/fetchAllPushNotificationDumpListByAppUserId";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import HyperlinkText from "../../components/electrons/customFonts/HyperlinkText";
import DataNotFound from "../data not found/DataNotFound";
import { useTranslation } from "react-i18next";
import { useMarkNotificationAsReadApiMutation } from "../../apiServices/pushNotification/notificationsApi";
import * as Keychain from 'react-native-keychain';
import { useIsFocused } from "@react-navigation/native";

const Notification = ({ navigation }) => {
    const [notificationData, setNotificationData] = useState()

    const [getNotiFunc, {
      data: notifData,
      error: notifError,
      isLoading: isNotifLoading,
      isError: isNotifError
  }] = useFetchNotificationListMutation()



    const focused = useIsFocused()

    const userData = useSelector(state => state.appusersdata.userData)

    console.log("userData", userData)

    const {t} = useTranslation()

    useEffect(() => {
        const data = {
            app_user_id: userData?.id,
            limit: 50,
            offset: 0,
            token: userData?.token
        }
        getNotiFunc(data);
    }, [focused, navigation])

    useEffect(() => {
        if (notifData) {
            console.log("notifdata", JSON.stringify(notifData))
            
            // const reversedData = notifData?.body?.data?.slice().reverse();
            setNotificationData(notifData?.body?.data)
        } else if(notifError) {
            console.log("notifError", notifError)
            }
        
    }, [notifData, notifError])

    const refetchNotifications = () => {
      const data = {
          app_user_id: userData?.id,
          limit: 50,
          offset: 0,
          token: userData?.token
      };
      getNotiFunc(data);
  };

    const buttonThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#ef6110';
    const height = Dimensions.get('window').height
    const width = Dimensions.get('window').width;
    
    const Notificationbar = (props) => {
        const [modalVisible, setModalVisible] = useState(false);

        const [markNotificationReadFunc,{
          data:markNotificationReadData,
          error:markNotificationReadError,
          isLoading:markNotificationReadIsLoading,
          isError:markNotificationReadIsError
        }]  = useMarkNotificationAsReadApiMutation()
        
      
        useEffect(()=>{
          if(markNotificationReadData)
          {
            console.log("markNotificationReadData",markNotificationReadData)
          } else if(markNotificationReadError)
          {
            console.log("markNotificationReadError",markNotificationReadError)
          }
        },[markNotificationReadData,markNotificationReadError])

        function isHttpUrl(string) {
          console.log("string baskjbjbasjhbcjbas", string)
          try {
            if(string.includes('http'))
            return true
          } catch (err) {
            return false;
          }
        }

      
        const handlePress = () => {
            const markRead = async () => {
                const credentials = await Keychain.getGenericPassword();
                const token = credentials.username;
                const data = {type : "single" , message_id : props?.data?.id}
                const params ={
                  token:token,
                  body : data
                }
                markNotificationReadFunc(params)
              };
          
              markRead();
          setModalVisible(true);
        };
      
        const handleClose = () => {
          props.refetch();
          setModalVisible(false);
        };
      
        return (
          <>
            <Pressable onPress={handlePress}>
              {/* <Text style={{top:10,left:10,color:props?.data?.read ? "green" : 'red',fontSize:14}}>{props?.data?.read ? "Read" : "Unread"}</Text> */}

              <View style={{...styles.container,backgroundColor:props?.data?.read ? '':'#DDDDDD'}}>

                <View style={styles.iconWrapper}>

                  <Image
                    style={styles.icon}
                    source={
                         isHttpUrl( props?.imageUrl)? { uri: props?.imageUrl }
                        : require('../../../assets/images/noti-small.png')
                    }
                  />
                </View>
      
                <View style={styles.textWrapper}>
                  <Text style={styles.title}>{props.notification}</Text>
                  <HyperlinkText text={props?.body} />
                </View>
              </View>
            </Pressable>
      
            {/* Modal */}
            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={handleClose}
            >
              <View style={styles.backdrop}>
                <View style={styles.modalContent}>
                  <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Image
                      source={
                        isHttpUrl( props?.imageUrl)? { uri: props?.imageUrl }
                        : require('../../../assets/images/noti-small.png')
                      }
                      style={styles.modalImage}
                    />
                    <Text style={styles.modalTitle}>{props.notification}</Text>
                    <Text style={styles.modalBody}>{props.body}</Text>
                    <Pressable onPress={handleClose} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </>
        );
      };

    return (
       <View style={{width:'100%',alignItems:'flex-start',backgroundColor: buttonThemeColor,height:'100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 10,height:'10%',paddingTop:10 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 8 }} source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', marginLeft: 10, fontWeight: '500' }}>{t("Notification")}</Text>
            </View>
            {notificationData &&<ScrollView style={{  backgroundColor: buttonThemeColor, width:'100%' }}>
            
             <View style={{ paddingBottom: 120,  backgroundColor: 'white', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: 20 }}>
                {
                    notificationData.map((item, index) => {
                        console.log("notificationData",item)
                        return <Notificationbar
                        imageUrl={item.image}
                        data={item}
                        notification={item?.title}
                        body={item?.body}
                        key={index}
                        refetch={refetchNotifications}
                      />

                    })
                }
                 
            </View>
        </ScrollView>}
        {
                  notifData?.body?.count == "0"  &&
                     <View style={{height:'90%', backgroundColor:'white', width:'100%'}}>
                     <DataNotFound></DataNotFound>
                     </View>
                }
        
       </View>


    )
}
const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapper: {
      height: 40,
      width: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFE7E7',
      marginLeft: 20,
    },
    icon: {
      width: 20,
      height: 20,
    },
    textWrapper: {
      width: '80%',
      margin: 10,
      padding: 10,
    },
    title: {
      fontWeight: '600',
      color: 'black',
    },
    modalContent:{
    backgroundColor: '#FFFFFF',
    width: '92%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxHeight: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
    // Modal styles
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      scrollContent: {
        alignItems: 'center',
      },
      modalImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 12,
      },
      modalBody: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
        
      },
      closeButton: {
        marginTop: 28,
        backgroundColor: '#f2f2f2',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
      },
      closeButtonText: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
      },
  });
export default Notification





