import { useEffect, useState } from "react";
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { navigate } from '@/utils/notifications/navigationService';
import { useNavigation } from "@react-navigation/native";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const useNotification = () => {
  const [newNotification, setNewNotification] = useState(null);
  const navigation = useNavigation();

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };
  const requestNotificationPermissions = async () => {
    const checkPermission = await checkNotificationPermission();
    console.log("notification permission status usenotification", checkPermission);
    if (checkPermission !== RESULTS.GRANTED) {
      const requestResult = await requestNotificationPermission();
      if (requestResult !== RESULTS.GRANTED) {
        console.log("Notification permission not granted");
        return false;
      }
    }
    return true;
  };
  useEffect(() => {
    requestNotificationPermissions();
  }, []);
  useEffect(() => {
    console.log("inside onmessage use effect")
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNewNotification(remoteMessage)
      await notifee.displayNotification({
        title: remoteMessage.data?.title ?? 'No title',
        body: remoteMessage.data?.body ?? 'No body',
        ios: { sound: 'default' },
      });
      console.log("remote message", remoteMessage)
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      navigation.navigate('Notification')
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          navigation.navigate('Notification')
        }
      });

    return unsubscribe;
  }, []);

  return { newNotification };
}
export default useNotification;