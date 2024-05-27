import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import LogoImage from "../Nurse_Comp_Images/Logo.jpg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import { API_BASE_URL } from "../config";

const PharmacyHeader = ({ onPress }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const navigation = useNavigation();
  const { email } = useEmail();

  const logoutUser = async () => {
    try {
      const token = await AsyncStorage.getItem("pharmacytoken");
      if (token) {
        const response = await fetch(
          `${API_BASE_URL}/pharmacy/logout/${email}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          await AsyncStorage.removeItem("pharmacytoken");
          navigation.navigate("HomePage");
        } else {
          console.error("Failed to log out:", response.statusText);
        }
      } else {
        console.error("Token not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = now.toLocaleDateString(undefined, options);
      const formattedTime = now.toLocaleTimeString();
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigateToScreen = (route) => () => {
    if (route === "HomePage") {
      logoutUser();
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        <Ionicons name="menu-outline" size={40} color="lightcyan" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={LogoImage} style={styles.logo} />
      </View>
      <View style={styles.titleContainer}>
        <MaterialIcons name="mood" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.title}>Good day, Healer of hearts and minds!</Text>
      </View>

      <View>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.time}>{currentTime}</Text>
      </View>
      <View style={styles.locationContainer}>
        <Ionicons
          name="location-outline"
          size={24}
          color="lavender"
          style={styles.icon}
        />
        <Text style={styles.locationText}>Bangalore</Text>
      </View>

      <View style={styles.rightIconsContainer}>
        {/* <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="user-circle-o" size={30} color="lightcyan"  onPress={navigateToScreen('PharmacyHome')}/>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={30} color="lightcyan" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mail-outline" size={30} color="lightcyan" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="log-out-outline"
            size={30}
            color="lightcyan"
            onPress={navigateToScreen("HomePage")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#005566",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 0,
  },
  logo: {
    width: 180,
    height: 60,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "teal",
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "lemonchiffon",
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    marginRight: 5,
    color: "lavender",
  },
  locationContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 5,
  },
  locationText: {
    fontSize: 14,
    color: "lavender",
    marginLeft: 5,
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
    color: "gold",
  },
  time: {
    fontSize: 16,
    color: "gold",
    fontWeight: "bold",
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 5,
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default PharmacyHeader;
