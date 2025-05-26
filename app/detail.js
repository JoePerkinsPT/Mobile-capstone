import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, icons, SHADOWS, SIZES } from '../constants';
import { favoritesStorage, recentMeditationsStorage } from '../utils/storage';

// DetailScreen component displays comprehensive information about a selected meditation
const DetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, description, duration, image, target, instructions } = params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
    // Add to recent meditations
    recentMeditationsStorage.addRecentMeditation({
      title,
      description,
      duration,
      image,
      target,
      instructions,
      timestamp: new Date().toISOString()
    });
  }, []);

  const checkIfFavorite = async () => {
    const favorites = await favoritesStorage.getFavorites();
    const isItemFavorite = favorites.some(item => item.title === title);
    setIsFavorite(isItemFavorite);
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoritesStorage.removeFromFavorites(title);
        Alert.alert('Removed from Favorites', 'Item has been removed from your favorites.');
      } else {
        await favoritesStorage.addToFavorites({ title, description, duration, image, target, instructions });
        Alert.alert('Added to Favorites', 'Item has been added to your favorites!');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'Failed to update favorites.');
    }
  };

  // Navigation handler to return to home screen
  const handleBackToHome = () => {
    router.push('/home');
  };

  // Handler for starting meditation session with confirmation dialog
  const handleStartMeditation = () => {
    Alert.alert(
      'Start Meditation',
      'Would you like to begin your meditation session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start',
          onPress: () => {
            Alert.alert('Meditation Started', 'Enjoy your session!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header with navigation buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBackToHome}>
          <Image source={icons.left} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={toggleFavorite}>
          <Image 
            source={isFavorite ? icons.heartFilled : icons.heartOutline} 
            style={styles.headerIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable content area */}
      <ScrollView style={styles.scrollView}>
        {/* Meditation image section */}
        <View style={styles.imageContainer}>
          <Image 
            source={image ? { uri: image } : icons.menu}
            style={styles.image}
          />
        </View>
        
        {/* Content container with meditation details */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          
          {/* Info section with duration and target */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Image source={icons.heart} style={styles.icon} />
              <Text style={styles.infoText}>{duration} minutes</Text>
            </View>
            <View style={styles.infoItem}>
              <Image source={icons.menu} style={styles.icon} />
              <Text style={styles.infoText}>{target}</Text>
            </View>
          </View>

          {/* Description section */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Instructions section */}
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{instructions}</Text>

          {/* Start meditation button */}
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartMeditation}
          >
            <Text style={styles.startButtonText}>Start Meditation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the detail screen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.lightWhite,
    ...SHADOWS.medium,
  },
  headerBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: COLORS.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.gray,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.gray,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    ...SHADOWS.medium,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailScreen; 