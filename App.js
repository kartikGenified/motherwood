import React,{useEffect,useState} from 'react';
import {View, StyleSheet,Alert,Linking, Platform} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import messaging from '@react-native-firebase/messaging';    
import VersionCheck from 'react-native-version-check';
import Close from 'react-native-vector-icons/Ionicons';
import ModalWithBorder from './src/components/modals/ModalWithBorder';
import NetInfo from "@react-native-community/netinfo";
import { PaperProvider } from 'react-native-paper';
import { InternetSpeedProvider } from './src/Contexts/useInternetSpeedContext';
import GlobalErrorHandler from './src/utils/GlobalErrorHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationModal from './src/components/modals/NotificationModal';
import notifee from '@notifee/react-native';
import { navigate } from './src/utils/notifications/navigationService';
import Toast from 'react-native-toast-message';
const App = () => {
  const [notifModal, setNotifModal] = useState(false)
  const [notifData, setNotifData] = useState(null)
  const [notificationBody, setNotificationBody] = useState()


  console.log("Version check",JSON.stringify(VersionCheck.getPlayStoreUrl({ packageName: 'com.genefied.motherwood' })))
  useEffect(() => {
    console.log("inside onmessage use effect")
      const unsubscribe = messaging().onMessage(async remoteMessage => {
       setNotifModal(true)
        setNotifData(remoteMessage?.notification)
        setNotificationBody(remoteMessage)
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
     
    

      useEffect(() => {
        const checkAppVersion = async () => {
          try {
    const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=com.genefied.motherwood`)
                    .then(r => r.json())
                    .then((res) => { return res?.results[0]?.version })
                    : await VersionCheck.getLatestVersion({
                        provider: 'playStore',
                        forceUpdate: true,
                       
                    });
    
            const currentVersion = VersionCheck.getCurrentVersion();
    
            console.log("current verison and new version,",currentVersion, latestVersion)
            if (latestVersion > currentVersion) {
              Alert.alert(
                'Update Required',
    'A new version of the app is available. Please update to continue using the app.',
                [
                  {
                    text: 'Update Now',
                    onPress: () => {
                      Linking.openURL(
                        Platform.OS === 'ios'
                          ? 'https://apps.apple.com/in/app/com.genefied.motherwood'
                          : "https://play.google.com/store/apps/details?id=com.genefied.motherwood"
                      );
                    },
                  },
                ],
                { cancelable: false }
              );
            } else {
              // App is up-to-date; proceed with the app
            }
          } catch (error) {
            // Handle error while checking app version
            console.error('Error checking app version:', error);
          }
        };
    
        checkAppVersion();
      }, []);
        
      
      

      const notifModalFunc = () => {
        return (
          <View style={{height:130  }}>
            <View style={{ height: '100%', width:'100%', alignItems:'center',}}>
              <View>
              {/* <Bell name="bell" size={18} style={{marginTop:5}} color={ternaryThemeColor}></Bell> */}
    
              </View>
              <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : ""} style={{ color: ternaryThemeColor, fontWeight:'800', fontSize:20, marginTop:8 }}></PoppinsTextLeftMedium>
          
              <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : ""} style={{ color: '#000000', marginTop:10, padding:10, fontSize:15, fontWeight:'600' }}></PoppinsTextLeftMedium>
            </View>
    
            <TouchableOpacity style={[{
              backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
            }]} onPress={() => setNotifModal(false)} >
              <Close name="close" size={17} color="#ffffff" />
            </TouchableOpacity>
    
    
    
          </View>
        )
      }
        
    return (
        <Provider store={store}>
          <PaperProvider>
            <InternetSpeedProvider>
             
        <SafeAreaView style={{flex:1}}>
        <NotificationModal
  visible={notifModal}
  onClose={() => setNotifModal(false)}
  title={notifData?.title}
  message={notifData?.body}
  notificationBody = {notificationBody}
  imageUrl={Platform.OS=='android'? notifData?.android?.imageUrl : notifData?.ios?.imageUrl} 
  type="info"
/>
            <StackNavigator>
            <GlobalErrorHandler>
            
           </GlobalErrorHandler>
            </StackNavigator>
        </SafeAreaView>
        
        </InternetSpeedProvider>
        <Toast position='bottom' />
        </PaperProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({})

export default App;
