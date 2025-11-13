import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { useSelector } from "react-redux";
import HyperlinkText from "@/components/electrons/customFonts/HyperlinkText";
import DataNotFound from "@/screens/data not found/DataNotFound";
import { useTranslation } from "react-i18next";
import { useMarkNotificationAsReadApiMutation, useFetchNotificationListMutation } from "./apis/notificationsApi";
import Bell from "react-native-vector-icons/FontAwesome";
import BackUi from "@/components/atoms/BackUi";

const Notification = ({ navigation }) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [getNotiFunc, {
    data: notifData,
    error: notifError,
    isLoading: isNotifLoading,
    isError: isNotifError
  }] = useFetchNotificationListMutation()



  const userData = useSelector(state => state.appusersdata.userData)
  const { t } = useTranslation()

  useEffect(() => {
    const data = {
      app_user_id: userData?.id,
      limit: 50,
      offset: 0,
      token: userData?.token
    }
    getNotiFunc(data);
  }, [])

  useEffect(() => {
    setRefreshing(false);
    if (notifData) {
      console.log("notifdata", JSON.stringify(notifData));
      setInitialLoadComplete(true);
    } else if (notifError) {
      console.log("notifError", notifError);
      setInitialLoadComplete(true);
    }
  }, [notifData, notifError]);

  const refetchNotifications = () => {
    const data = {
      app_user_id: userData?.id,
      limit: 50,
      offset: 0,
      token: userData?.token
    };
    getNotiFunc(data);
    setRefreshing(false);
  };

  const Notificationbar = (props) => {
    const [modalVisible, setModalVisible] = useState(false);

    const [markNotificationReadFunc, {
      data: markNotificationReadData,
      error: markNotificationReadError,
      isLoading: markNotificationReadIsLoading,
      isError: markNotificationReadIsError
    }] = useMarkNotificationAsReadApiMutation()


    useEffect(() => {
      if (markNotificationReadData) {
        console.log("markNotificationReadData", markNotificationReadData)
      } else if (markNotificationReadError) {
        console.log("markNotificationReadError", markNotificationReadError)
      }
    }, [markNotificationReadData, markNotificationReadError])

    function isHttpUrl(str) {
      if (typeof str !== 'string') return false;
      const s = str.trim();
      return s.startsWith('http://') || s.startsWith('https://');
    }


    const handlePress = () => {
      const body = { type: "single", message_id: props?.data?.id }
      markNotificationReadFunc(body)
      setModalVisible(true);
    };

    const handleClose = () => {
      setModalVisible(false);
    };

    return (
      <>
        <Pressable onPress={handlePress}>
          {/* <Text style={{top:10,left:10,color:props?.data?.read ? "green" : 'red',fontSize:14}}>{props?.data?.read ? "Read" : "Unread"}</Text> */}

          <View style={{ ...styles.container, backgroundColor: props?.data?.read ? '' : '#DDDDDD' }}>

            <View style={styles.iconWrapper}>

              {isHttpUrl(props?.imageUrl) ? (
                <Image
                  style={styles.icon}
                  source={{ uri: props?.imageUrl }}
                />
              ) : (
                <Bell name="bell" size={20} color="#333" />
              )}
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
                {isHttpUrl(props?.imageUrl) ? (
                  <Image
                    source={{ uri: props?.imageUrl }}
                    style={styles.modalImage}
                  />
                ) : (
                  <Bell name="bell" size={100} color="#999" />
                )}
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
    <BackUi
      title={t("Notification")}
      loading={isNotifLoading}
    >
      <FlatList
        data={notifData?.body?.data || []}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={{ paddingBottom: 120, backgroundColor: 'white', width: '100%' }}
        onRefresh={refetchNotifications}
        refreshing={refreshing}
        renderItem={({ item, index }) => (
          <Notificationbar
            imageUrl={item?.image}
            data={item}
            notification={item?.title}
            body={item?.body}
            key={item?.id ?? index}
          />
        )}
      />
      { (initialLoadComplete && !isNotifLoading) && !(notifData?.body?.data?.length >0) &&
          <DataNotFound></DataNotFound>
      }
    </BackUi>
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
  modalContent: {
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





