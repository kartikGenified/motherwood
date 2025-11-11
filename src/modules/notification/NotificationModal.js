import React, {useState, useEffect, useRef} from 'react';
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
import useNotification from './useNotification';
import Bell from "react-native-vector-icons/FontAwesome";


const { width } = Dimensions.get('window');

const NotificationModal = ({
  duration = 4000,
}) => {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasClosed = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {newNotification} = useNotification();

  const [detailVisible, setDetailVisible] = useState(false);

  // Using a vector icon as the default/fallback instead of a local image

  // Compute image URL from the incoming message; avoid keeping a separate state to prevent race conditions
  const getImageUrlFromNotification = (msg) => {
    if (!msg) return null;
    // RN Firebase RemoteMessage shape:
    // msg.notification?.android?.imageUrl or msg.notification?.ios?.imageUrl or msg.notification?.imageUrl
    // Some providers send in data payload: msg.data?.image or msg.data?.imageUrl
    return (
      msg?.notification?.android?.imageUrl ||
      msg?.notification?.ios?.imageUrl ||
      msg?.notification?.imageUrl ||
      msg?.data?.image ||
      msg?.data?.imageUrl ||
      null
    );
  };

  useEffect(() => {
    if (newNotification) {
      setModalVisible(true);
      const url = getImageUrlFromNotification(newNotification);
      // Prefetch image to improve likelihood of immediate render
      if (url && typeof url === 'string' && url.startsWith('http')) {
        Image.prefetch(url).catch(() => {});
      }
    }
  }, [newNotification]);

 

  useEffect(() => {
    if (modalVisible) {
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
  }, [modalVisible]);

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
      setModalVisible(false);
    });
  };

  const renderNotificationImage = (variant = 'toast') => {
    const imageUrl = getImageUrlFromNotification(newNotification);
    const isValid = typeof imageUrl === 'string' && /^(https?:)\/\//.test(imageUrl.trim());
    if (isValid) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={variant === 'toast' ? styles.image : styles.detailImageLight}
        />
      );
    }
    return (
      <Bell
        name="bell"
        size={variant === 'toast' ? 20 : 64}
        color={variant === 'toast' ? '#333' : '#999'}
        style={variant === 'toast' ? styles.bellIcon : styles.bellIconLarge}
      />
    );
  };

  const titleText = newNotification?.notification?.title || newNotification?.data?.title || 'Notification';
  const bodyText = newNotification?.notification?.body || newNotification?.data?.body || '';

  const handleNotificationPress = () => {
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setModalVisible(false);
  };

  if (!modalVisible) return null;

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
          {renderNotificationImage('toast')}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{titleText}</Text>
            <Text numberOfLines={2} style={styles.message}>
              {bodyText}
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
        {renderNotificationImage('detail')}
        <Text style={styles.detailTitleLight}>{titleText}</Text>
        <Text style={styles.detailMessageLight}>{bodyText}</Text>
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
  bellIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  bellIconLarge: {
    marginBottom: 16,
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
