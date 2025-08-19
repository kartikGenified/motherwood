import notifee, { AuthorizationStatus } from '@notifee/react-native';


export  async function checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();
    console.log("settings notifee", settings,AuthorizationStatus)
    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions has been authorized');
    } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
      console.log('Notification permissions has been denied');
      requestUserPermission()
    }
  }

  export async function requestUserPermission() {
    try {
      const settings = await notifee.requestPermission();
      console.log("notifee permison request result", settings)
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission granted ✅');
      } else {
        console.log('Permission denied ❌');
      }
    } catch (error) {
      console.error('Permission request error: ', error);
    }
  }