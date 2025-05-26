import React, { useState, useEffect } from "react";
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform,
  Alert, TextInput, StyleSheet, Modal
} from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, SIZES } from "../../constants";
import { useTheme } from "../../context/ThemeProvider";

const DailyReminders = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [manualTime, setManualTime] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);
  const [repeatOption, setRepeatOption] = useState("none");
  const [showRepeatModal, setShowRepeatModal] = useState(false);

  // Request notification permissions
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Please allow notifications to receive reminders."
      );
    }
  };

  // Load user details and reminders on component mount
  useEffect(() => {
    requestPermissions();
    loadUserDetails();
    loadReminders();
  }, []);

  // Load user details from AsyncStorage
  const loadUserDetails = async () => {
    const user = await AsyncStorage.getItem("userDetails");
    setUserDetails(user ? JSON.parse(user) : {});
  };

  // Load reminders from AsyncStorage
  const loadReminders = async () => {
    const storedReminders = await AsyncStorage.getItem("reminders");
    const allReminders = storedReminders ? JSON.parse(storedReminders) : [];
    const futureReminders = allReminders.filter(
      (reminder) => new Date(reminder.triggerDate) > new Date()
    );
    setReminders(futureReminders);
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setSelectedDate(reminder.date);
    setManualTime(reminder.time);
    setRepeatOption(reminder.repeat || "none");
  };

  const handleUpdateReminder = async () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date.");
      return;
    }

    const [inputHours, inputMinutes] = manualTime.split(":").map((item) => parseInt(item, 10));
    const triggerDate = new Date(selectedDate);

    if (!isNaN(inputHours) && !isNaN(inputMinutes)) {
      triggerDate.setHours(inputHours, inputMinutes, 0, 0);
    } else {
      triggerDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    }

    if (triggerDate <= new Date()) {
      Alert.alert("Error", "Please select a future time.");
      return;
    }

    try {
      const updatedReminder = {
        ...editingReminder,
        date: selectedDate,
        time: manualTime || triggerDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        triggerDate: triggerDate.toISOString(),
        repeat: repeatOption
      };

      const updatedReminders = reminders.map(reminder => 
        reminder.id === editingReminder.id ? updatedReminder : reminder
      );

      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      await scheduleNotification(updatedReminder);
      setEditingReminder(null);
      Alert.alert("Success", "Reminder updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update reminder.");
    }
  };

  const handleAddReminder = async () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date.");
      return;
    }

    const [inputHours, inputMinutes] = manualTime.split(":").map((item) => parseInt(item, 10));
    const triggerDate = new Date(selectedDate);

    if (!isNaN(inputHours) && !isNaN(inputMinutes)) {
      triggerDate.setHours(inputHours, inputMinutes, 0, 0);
    } else {
      triggerDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    }

    if (triggerDate <= new Date()) {
      Alert.alert("Error", "Please select a future time.");
      return;
    }

    const newReminder = {
      id: Date.now(),
      date: selectedDate,
      time: manualTime || triggerDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      description: `Reminder: Time for your daily task!`,
      triggerDate: triggerDate.toISOString(),
      repeat: repeatOption
    };

    try {
      const updatedReminders = [...reminders, newReminder];
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      await scheduleNotification(newReminder);
      Alert.alert("Success", "Reminder added successfully!");
      setManualTime("");
      setSelectedDate(null);
      setRepeatOption("none");
    } catch (error) {
      Alert.alert("Error", "Failed to add reminder.");
    }
  };

  const scheduleNotification = async (reminder) => {
    const triggerDate = new Date(reminder.triggerDate);
    if (Platform.OS === "web") {
      setTimeout(() => {
        new Notification("Reminder", { body: reminder.description });
      }, triggerDate - new Date());
    } else {
      await Notifications.scheduleNotificationAsync({
        content: { title: "Reminder", body: reminder.description },
        trigger: { date: triggerDate },
      });
    }
  };

  const deleteReminder = async (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const RepeatModal = () => (
    <Modal
      visible={showRepeatModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite }]}>
          <Text style={[styles.modalTitle, { color: isDarkMode ? COLORS.lightWhite : COLORS.darkText }]}>
            Repeat Options
          </Text>
          {["none", "daily", "weekly", "monthly"].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.repeatOption}
              onPress={() => {
                setRepeatOption(option);
                setShowRepeatModal(false);
              }}
            >
              <Text style={[styles.repeatOptionText, { color: isDarkMode ? COLORS.lightWhite : COLORS.darkText }]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowRepeatModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const Reminder = ({ item }) => (
    <View style={[styles.reminderContainer, { backgroundColor: isDarkMode ? COLORS.secondary : COLORS.primary }]}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{item.date} - {item.time}</Text>
      {item.repeat !== "none" && (
        <Text style={styles.repeatText}>Repeats: {item.repeat}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEditReminder(item)} style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite }}>
      <Stack.Screen options={{ headerTitle: "Daily Reminders" }} />
      <ScrollView contentContainerStyle={{ padding: SIZES.medium }}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true, selectedColor: COLORS.primary } }}
          theme={{
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite,
            calendarBackground: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite,
            textSectionTitleColor: isDarkMode ? COLORS.lightWhite : COLORS.darkText,
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: COLORS.lightWhite,
            todayTextColor: COLORS.primary,
            dayTextColor: isDarkMode ? COLORS.lightWhite : COLORS.darkText,
            textDisabledColor: COLORS.gray,
          }}
        />
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            onChange={(event, selected) => {
              setSelectedTime(selected || selectedTime);
              setShowTimePicker(false);
            }}
          />
        )}
        <TextInput
          placeholder="Enter Time (HH:mm)"
          value={manualTime}
          onChangeText={setManualTime}
          keyboardType="numeric"
          maxLength={5}
          style={[styles.input, { 
            borderColor: isDarkMode ? COLORS.lightWhite : COLORS.primary,
            color: isDarkMode ? COLORS.lightWhite : COLORS.darkText
          }]}
          placeholderTextColor={isDarkMode ? COLORS.gray : COLORS.gray2}
        />
        <TouchableOpacity 
          style={styles.repeatButton} 
          onPress={() => setShowRepeatModal(true)}
        >
          <Text style={styles.repeatButtonText}>
            Repeat: {repeatOption.charAt(0).toUpperCase() + repeatOption.slice(1)}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.selected, { color: isDarkMode ? COLORS.lightWhite : COLORS.primary }]}>
          Date: {selectedDate || "None"}
        </Text>
        <Text style={[styles.selected, { color: isDarkMode ? COLORS.lightWhite : COLORS.primary }]}>
          Time: {manualTime || selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <TouchableOpacity 
          onPress={editingReminder ? handleUpdateReminder : handleAddReminder} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {editingReminder ? "Update Reminder" : "Add Reminder"}
          </Text>
        </TouchableOpacity>
        {editingReminder && (
          <TouchableOpacity 
            onPress={() => setEditingReminder(null)} 
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel Edit</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.reminderHeader, { color: isDarkMode ? COLORS.lightWhite : COLORS.primary }]}>
          All Reminders:
        </Text>
        {reminders.length > 0 ? (
          reminders.map((rem) => <Reminder key={rem.id} item={rem} />)
        ) : (
          <Text style={{ color: isDarkMode ? COLORS.lightWhite : COLORS.darkText }}>
            No reminders yet.
          </Text>
        )}
      </ScrollView>
      <RepeatModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  reminderContainer: {
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginVertical: SIZES.small
  },
  description: {
    color: COLORS.lightWhite,
    fontWeight: "bold"
  },
  date: {
    color: COLORS.lightWhite,
    fontSize: SIZES.small
  },
  input: {
    borderWidth: 1,
    padding: SIZES.small,
    marginVertical: SIZES.small,
    borderRadius: SIZES.small
  },
  selected: {
    fontSize: SIZES.medium,
    marginVertical: SIZES.small
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: "center",
    marginVertical: SIZES.small
  },
  buttonText: {
    color: COLORS.lightWhite,
    fontWeight: "bold"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SIZES.small
  },
  editButton: {
    marginRight: SIZES.small
  },
  editText: {
    color: COLORS.lightWhite,
    fontWeight: "bold"
  },
  deleteButton: {
    marginLeft: SIZES.small
  },
  deleteText: {
    color: "#FE7654",
    fontWeight: "bold"
  },
  reminderHeader: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    marginVertical: SIZES.medium
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent: {
    width: "80%",
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    elevation: 5
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    marginBottom: SIZES.medium,
    textAlign: "center"
  },
  repeatOption: {
    padding: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray
  },
  repeatOptionText: {
    fontSize: SIZES.medium
  },
  closeButton: {
    marginTop: SIZES.medium,
    padding: SIZES.small,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    alignItems: "center"
  },
  closeButtonText: {
    color: COLORS.lightWhite,
    fontWeight: "bold"
  },
  repeatButton: {
    backgroundColor: COLORS.secondary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginVertical: SIZES.small
  },
  repeatButtonText: {
    color: COLORS.lightWhite,
    textAlign: "center",
    fontWeight: "bold"
  },
  repeatText: {
    color: COLORS.lightWhite,
    fontSize: SIZES.small,
    marginTop: SIZES.small
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: "center",
    marginVertical: SIZES.small
  },
  cancelButtonText: {
    color: COLORS.lightWhite,
    fontWeight: "bold"
  }
});

export default DailyReminders; 