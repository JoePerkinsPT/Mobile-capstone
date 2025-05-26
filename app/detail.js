import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, icons, SHADOWS, SIZES } from '../constants';

const DetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, description, duration, image, target, instructions } = params;

  const handleBackToHome = () => {
    router.push('/home');
  };

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
            // Here you can add logic to start the meditation
            Alert.alert('Meditation Started', 'Enjoy your session!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBackToHome}>
          <Image source={icons.left} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBackToHome}>
          <Image source={icons.menu} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image 
            source={image ? { uri: image } : icons.menu}
            style={styles.image}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          
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

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{instructions}</Text>

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