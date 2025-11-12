import React,{useEffect,useState} from 'react';
import {View, StyleSheet,Alert,Linking, Platform} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import VersionCheck from 'react-native-version-check';
import { PaperProvider } from 'react-native-paper';
import { InternetSpeedProvider } from './src/Contexts/useInternetSpeedContext';
import GlobalErrorHandler from './src/utils/GlobalErrorHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
const App = () => {

  const { t } = useTranslation();
  console.log("Version check",JSON.stringify(VersionCheck.getPlayStoreUrl({ packageName: 'com.genefied.motherwood' })))

      const compareVersions = (v1, v2) => {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
          const part1 = parts1[i] || 0;
          const part2 = parts2[i] || 0;
          
          if (part1 > part2) return 1;
          if (part1 < part2) return -1;
        }
        return 0;
      };


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
            if (compareVersions(latestVersion, currentVersion) > 0) {
              Alert.alert(
                t('Update Required'),
                t('A new version of the app is available. Please update to continue using the app.'),
                [
                  {
                    text: t('Update Now'),
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
        
      
      


        
    return (
        <Provider store={store}>
          <PaperProvider>
            <InternetSpeedProvider>
             
        <SafeAreaView style={{flex:1}}>
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
