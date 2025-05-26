import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants';

const DailyQuote = ({ isDarkMode }) => {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
      } else {
        console.error('Error fetching quote:', response.status);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.white,
        borderColor: isDarkMode ? COLORS.gray2 : COLORS.gray
      }
    ]}>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <>
          <Text style={[
            styles.quoteText,
            { color: isDarkMode ? COLORS.white : COLORS.gray }
          ]}>"{quote}"</Text>
        </>
      )}
    </View>
  );
};

export default DailyQuote;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    ...SHADOWS.small,
  },
  quoteText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.italic,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
}); 