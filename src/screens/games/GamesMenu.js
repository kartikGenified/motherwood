import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'
import PoppinsText from '../../components/electrons/customFonts/PoppinsText'
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium'
import TopHeader from '../../components/topBar/TopHeader'
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium'

const GamesMenu = ({ navigation }) => {
  const primaryThemeColor = useSelector(
    (state) => state.apptheme.primaryThemeColor
  )

  const gameData = [
    {
      id: 1,
      title: 'Flappy Bird',
      subtitle: 'Navigate through pipes',
      image: require('../../../assets/images/flappy-icon.png'),
      colors: ['#FF6B6B', '#FF8E53'],
      route: 'Flappy'
    },
    {
      id: 2,
      title: 'Tap The Dot',
      subtitle: 'Test your reflexes',
      image: require('../../../assets/images/target.png'),
      colors: ['#4ECDC4', '#44A08D'],
      route: 'TapTheDot'
    }
  ]

  const handleGamePress = (route) => {
    navigation.navigate(route)
  }

  const renderGameCard = (game) => (
    <TouchableOpacity
      key={game.id}
      style={styles.cardContainer}
      onPress={() => handleGamePress(game.route)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={game.colors}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={game.image} style={styles.gameImage} />
          </View>
          <View style={styles.textContainer}>
            <PoppinsText content={game.title} style={styles.gameTitle} />
            <PoppinsTextLeftMedium content={game.subtitle} style={styles.gameSubtitle} />
          </View>
          <View style={styles.playIconContainer}>
            <View style={styles.playIcon}>
              <PoppinsText content="▶" style={styles.playIconText} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopHeader title="Games" />
      <View style={styles.header}>
        <PoppinsText content="Choose Your Game" style={styles.headerTitle} />
        <PoppinsTextMedium content="Pick a game and start playing!" style={styles.headerSubtitle} />
      </View>
      
      <View style={styles.gamesGrid}>
        {gameData.map(game => renderGameCard(game))}
      </View>
      
      
    </ScrollView>
  )
}

export default GamesMenu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 25,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  gamesGrid: {
    paddingHorizontal: 20,
    gap: 20,
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 2,
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gameImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  gameTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  playIconContainer: {
    marginLeft: 10,
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playIconText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})