import { useEffect, useState} from "react";
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { navigate } from '@/utils/notifications/navigationService';

const useNotification = ()=>{
  const [newNotification, setNewNotification] = useState(null);
    useEffect(() => {
    console.log("inside onmessage use effect")
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        setNewNotification(remoteMessage)
        await notifee.displayNotification({
          title: remoteMessage.data?.title ?? 'No title',
          body: remoteMessage.data?.body ?? 'No body',
          ios: { sound: 'default' },
        });
    console.log("remote message",remoteMessage)
      });
      
      return unsubscribe;
    }, []);
    useEffect(() => {
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage);
        navigate('Notification')
      });
    
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage);
            navigate('Notification')
          }
        });
    
      return unsubscribe;
    }, []);

    return {newNotification};
}
export default useNotification;