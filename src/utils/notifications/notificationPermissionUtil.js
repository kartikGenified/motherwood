import notifee, { AuthorizationStatus } from '@notifee/react-native';


export  async function checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();
    console.log("settings notifee", settings,AuthorizationStatus)
    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions has been authorized');
    } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
      console.log('Notification permissions has been denied');
    }
  }

  export  async function requestUserPermission() {
    const settings = await notifee.requestPermission();
  
    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission granted ✅');
    } else {
      console.log('Permission denied ❌');
    }
  }