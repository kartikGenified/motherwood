import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform
} from 'react-native';
import Sound from 'react-native-sound';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { incrementScore, resetScore } from '@redux/slices/tapGameSlice';
import { useShowPointsApiMutation } from './api';
import * as Keychain from 'react-native-keychain';

const DOT_SIZE = 60;
const GAME_DURATION = 30;

const TapTheDot = ({navigation}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const score = useSelector((state) => state.tapGame.score);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameAreaSize, setGameAreaSize] = useState({ width: 0, height: 0 });
  const [count, setCount] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const countdownScale = useRef(new Animated.Value(1)).current;
  // Animated values for dot position
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const scoreRef = useRef(score);
  const animatedScale = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  const [showPointsFunc,{
    data:showPointsData,
    error:showPointsError,
    isLoading:showPointsIsLoading,
    isError:showPointsIsError
  }] = useShowPointsApiMutation()

  useEffect(()=>{

  },[])


  useEffect(()=>{
    if(showPointsData)
    {
      console.log("showPointsData", showPointsData)
      // Alert.alert('Game Over', `Your Score: ${scoreRef.current}`); 

    }
    else if(showPointsError)
    {
      console.log("showPointsError",showPointsError)
    }
  },[showPointsData,showPointsError])

  useEffect(() => {
    Sound.setCategory('Playback');
  
    const sound = new Sound('sound1.wav', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('Failed to load sound', error);
        return;
      }
      soundRef.current = sound;
    });
  
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);


  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Calculate dot animation duration based on time left
  const getAnimationDuration = () => {
    if (timeLeft > 20) return 400;
    if (timeLeft > 10) return 250;
    return 150;
  };

  // Animate dot to a new position
  const animateDotTo = (x, y) => {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: x,
          duration: getAnimationDuration(),
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animatedY, {
          toValue: y,
          duration: getAnimationDuration(),
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };
  const previousPosition = useRef({ x: 0, y: 0 });
  // Generate a new random position inside the game area
  const generateRandomPosition = () => {
    if (!gameAreaSize.width || !gameAreaSize.height) {
      return Promise.resolve();
    }
  
    const maxX = gameAreaSize.width - DOT_SIZE;
    const maxY = gameAreaSize.height - DOT_SIZE;
  
    let newX, newY;
    const minDistance = Math.min(gameAreaSize.width, gameAreaSize.height) * 0.4; // 40% of area size
  
    // Keep generating positions until far enough from previous one
    let attempts = 0;
    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
  
      const dx = newX - previousPosition.current.x;
      const dy = newY - previousPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      attempts++;
      if (attempts > 10) break; // avoid infinite loop
    } while (
      Math.sqrt(
        Math.pow(newX - previousPosition.current.x, 2) +
        Math.pow(newY - previousPosition.current.y, 2)
      ) < minDistance
    );
  
    // Save new position
    previousPosition.current = { x: newX, y: newY };
  
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: newX,
          duration: getAnimationDuration(),
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(animatedY, {
          toValue: newY,
          duration: getAnimationDuration(),
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  const countdownSequence = () => {
    setShowCountdown(true);
    let current = 3;
  
    const animate = () => {
      setCount(current);
      countdownScale.setValue(0.5); // start smaller
  
      Animated.timing(countdownScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start(() => {
        if (current > 1) {
          current -= 1;
          animate(); // next number
        } else {
          // Countdown finished
          setShowCountdown(false);
          setGameRunning(true);
        }
      });
    };
  
    animate();
  };


  

  // Handle pressing the dot
  const handleDotPress = async () => {
  // Play sound
  if (soundRef.current) {
    soundRef.current.stop(() => {
      soundRef.current.play((success) => {
        if (!success) {
          console.warn('Sound playback failed');
        }
      });
    });
  }

  dispatch(incrementScore());

  // Animate scale
  Animated.sequence([
    Animated.timing(animatedScale, {
      toValue: 0.7,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedScale, {
      toValue: 1,
      duration: 200,
      easing: Easing.bounce,
      useNativeDriver: true,
    }),
  ]).start();

  await generateRandomPosition();
};

  // Start the game: reset score, timer, and position
  const startGame = () => {
    dispatch(resetScore());
    setTimeLeft(GAME_DURATION);
  
    if (gameAreaSize.width && gameAreaSize.height) {
      const initialX = Math.random() * (gameAreaSize.width - DOT_SIZE);
      const initialY = Math.random() * (gameAreaSize.height - DOT_SIZE);
      animatedX.setValue(initialX);
      animatedY.setValue(initialY);
    }
  
    countdownSequence(); // 👈 countdown before actual game starts
  };

  // Timer effect
  useEffect(() => {
    if (!gameRunning) return;
  
    setTimeLeft(GAME_DURATION); // ensure it resets cleanly
  
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameRunning(false);
          // const callApi=async()=>{
          //   const credentials = await Keychain.getGenericPassword();
          //   if (credentials) {
          //     console.log(
          //       'Credentials successfully loaded for user ' + credentials.username
          //     );
          //     const token = credentials.username
          //     const params = {
          //       token :token, 
          //       data :{
          //         score:scoreRef.current,
          //         platform:Platform.OS,
          //         lat:1,
          //         log:2
          //     }
          //     }
          //           showPointsFunc(params)
          //     }
          // }
          // callApi()
          
      Alert.alert(t('Game Over'), `${t('Your Score')}: ${scoreRef.current}`); 

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timerRef.current);
  }, [gameRunning]);

  // On layout, save game area size
  const onGameAreaLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setGameAreaSize({ width, height });
  };

  // On game start or area size change, reset position
  useEffect(() => {
    if (gameRunning && gameAreaSize.width && gameAreaSize.height) {
      const initialX = Math.random() * (gameAreaSize.width - DOT_SIZE);
      const initialY = Math.random() * (gameAreaSize.height - DOT_SIZE);
      animatedX.setValue(initialX);
      animatedY.setValue(initialY);
    }
  }, [gameRunning, gameAreaSize]);

  return (
    <ImageBackground
    source={require('../../../assets/images/34804_Four_Season.jpg')} 
    style={styles.background}
    imageStyle={{ borderRadius: 16 }}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          height: 20,
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={{ marginLeft: 160 }}>
          <Image
            style={{ height: 30, width: 30, resizeMode: "contain" }}
            source={require("../../../assets/images/notificationOn.png")}
          ></Image>
        </TouchableOpacity> */}
      </View>
      <View style={{alignItems:"center",justifyContent:'center',width:'100%',flexDirection:'row',marginBottom:10}}>
      <Image style={{height:100,width:100,resizeMode:"contain",marginRight:10}} source={require('../../../assets/images/saathi.png')}></Image>
      <Text style={styles.title}>{t('Tap the Dot')}</Text>
      </View>
      

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{t('Time')}: {timeLeft}s</Text>
        <Text style={styles.infoText}>{t('Score')}: {score}</Text>
      </View>
      {showCountdown && (
  <View style={styles.countdownOverlay}>
    <Animated.Text
      style={[
        styles.countdownText,
        {
          transform: [{ scale: countdownScale }],
        },
      ]}
    >
      {count === 1 ? t('Go!') : count}
    </Animated.Text>
  </View>
)}

      {!gameRunning && (
        <Pressable
        onPress={startGame}
        style={({ pressed }) => [
          styles.startButton,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Text style={styles.startButtonText}>{t('Start Game')}</Text>
      </Pressable>
      )}

      <View style={styles.gameArea} onLayout={onGameAreaLayout}>
      <ImageBackground
    // source={require('../../../assets/images/34801_Four_Season.jpg')}
    style={styles.imageBackground}
    imageStyle={{ borderRadius: 16 }}
    resizeMode="cover"
  >
        {gameRunning && (
          <Animated.View
  style={[
    styles.dot,
    {
      transform: [
        { translateX: animatedX },
        { translateY: animatedY },
        { scale: animatedScale }, // Add this
      ],
    },
  ]}
>
            <Pressable
              onPress={handleDotPress}
              style={styles.dotPressable}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: DOT_SIZE / 2 }}
            />
          </Animated.View>
        )}
        
    </ImageBackground>
      </View>

    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    justifyContent:'flex-start',
    height:'100%'
    
  },
    title: {
      fontSize: 30,
      fontWeight: '800',
      // color: '#2c3e50',
      color:'#FFFFF0'
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      marginBottom: 15,
    },
    infoText: {
      fontSize: 18,
      fontWeight: '600',
      backgroundColor: '#FFFFF0',
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 12,
      elevation: 2,
      color: '#2d3436',
      textAlign: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    startButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      backgroundColor: '#6c5ce7',
      borderRadius: 50,
      marginBottom: 10,
      elevation: 3,
      shadowColor: '#6c5ce7',
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    startButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 18,
      letterSpacing: 1,
    },
    imageBackground: {
      flex: 1,
      width: '100%',
      height: '100%',
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor:'#FFFFF0'
    },
    gameArea: {
      width: '95%',
      height: '65%',
      maxWidth: 500,
      maxHeight: 600,
      borderWidth: 4,
      borderColor: '#0984e3',
      borderRadius: 16,
      position: 'relative',
      overflow: 'hidden',
      elevation: 5,
    },
    dot: {
      position: 'absolute',
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      backgroundColor: '#e17055',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#e17055',
      shadowOpacity: 0.8,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 10,
      elevation: 10,
    },
    dotPressable: {
      width: '100%',
      height: '100%',
      borderRadius: DOT_SIZE / 2,
    },
    countdownOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    countdownText: {
      fontSize: 100,
      fontWeight: '900',
      color: '#ffffff',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
    },
  });
  

export default TapTheDot;
