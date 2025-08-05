import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { useMarkNotificationAsReadApiMutation } from '../../apiServices/pushNotification/notificationsApi';
import * as Keychain from 'react-native-keychain';

const { width } = Dimensions.get('window');

const NotificationModal = ({
  visible,
  onClose,
  title = 'Notification',
  message,
  type = 'info',
  duration = 4000,
  imageUrl,
  notificationBody
}) => {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasClosed = useRef(false);

  const [detailVisible, setDetailVisible] = useState(false);

  const defaultImage = require('../../../assets/images/noti-small.png');


  console.log("details modal vissible", visible)

 

  useEffect(() => {
    if (visible) {
      hasClosed.current = false;

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Platform.OS === 'ios' ? 50 : 30,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    if (hasClosed.current) return;
    hasClosed.current = true;

    

   
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -80,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDetailVisible(false)
      onClose?.();
    });
  };

  function isHttpUrl(string) {
    console.log("string baskjbjbasjhbcjbas", string)
    try {
      if(string.includes('http'))
      return true
    } catch (err) {
      return false;
    }
  }

  const handleNotificationPress = () => {
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    onClose?.()
  };

  if (!visible) return null;

  return (
    <>
      {/* Toast Notification */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Pressable onPress={handleNotificationPress} style={styles.innerContainer}>
          <Image
            source={isHttpUrl(imageUrl) ? { uri: imageUrl } : defaultImage}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text numberOfLines={2} style={styles.message}>
              {message}
            </Text>
          </View>
          <Pressable onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </Pressable>
      </Animated.View>

      <Modal
  visible={detailVisible}
  transparent
  animationType="fade"
  onRequestClose={handleDetailClose}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.detailModalLight}>
      <ScrollView contentContainerStyle={styles.detailContentLight}>
        <Image
          source={isHttpUrl(imageUrl) ? { uri: imageUrl } : defaultImage}
          style={styles.detailImageLight}
        />
        <Text style={styles.detailTitleLight}>{title}</Text>
        <Text style={styles.detailMessageLight}>{message}</Text>
        <Pressable style={styles.dismissButtonLight} onPress={handleDetailClose}>
          <Text style={styles.dismissTextLight}>Close</Text>
        </Pressable>
      </ScrollView>
    </View>
  </View>
</Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 9999,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 6,
    resizeMode:'contain'
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: 'black',
  },
  closeText: {
    fontSize: 22,
    color: 'red',
    paddingHorizontal: 4,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailModal: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: '80%',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  detailContent: {
    padding: 16,
  },
  detailImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    color: '#F1F1F1',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailMessage: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 22,
  },
  dismissButton: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  dismissText: {
    color: '#FFF',
    fontSize: 15,
  },
  detailModalLight: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: '85%',
    paddingBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  detailContentLight: {
    padding: 20,
    alignItems: 'center',
  },
  detailImageLight: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  detailTitleLight: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  detailMessageLight: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  dismissButtonLight: {
    marginTop: 24,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  dismissTextLight: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationModal;
