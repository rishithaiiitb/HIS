import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import axios from "axios"; // Import axios library
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import { API_BASE_URL } from "../config";

const PharmacySidebar = ({ navigation, activeRoute }) => {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pharmacyDetails, setPharmacyDetails] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    const fetchPharmacyDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("pharmacytoken");
        const response = await axios.get(
          `${API_BASE_URL}/pharmacy/home/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPharmacyDetails(response.data);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          Alert.alert(
            "Error",
            "Session Expired !!Please Log in again",
            [
              {
                text: "OK",
                onPress: () => {
                  AsyncStorage.removeItem("pharmacytoken");
                  navigation.navigate("HomePage");
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          console.error("Error fetching pharmacy details:", error);
        }
      }
    };

    fetchPharmacyDetails();
  }, [email]);

  const navigateToScreen = (route) => () => {
    if (route === "PharmacyHome") {
      navigation.navigate(route);
    } else if (route === "PharmacyPatient_Details") {
      navigation.navigate(route);
    } else if (route === "HomePage") {
      logoutUser();
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://t4.ftcdn.net/jpg/01/10/40/85/360_F_110408571_MKABH1lRABlrn4aK6gUsWhFv9gTdSMOe.jpg",
          }}
          style={styles.profileImage}
        />

        {pharmacyDetails ? (
          <>
            <Text style={styles.profileText}>{pharmacyDetails.name}</Text>
            <Text style={styles.profileText}>
              Contact: {pharmacyDetails.contact}
            </Text>
            <Text style={styles.profileText}>
              Email: {pharmacyDetails.email}
            </Text>
          </>
        ) : (
          <Text>Loading pharmacy details...</Text>
        )}
        <Text style={styles.profileText}>Pharmacy</Text>
      </View>

      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen("PharmacyHome")}>
        <Text
          style={[
            styles.item,
            activeRoute === "PharmacyHome" && styles.activeItem,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen("PharmacyPatient_Details")}>
        <Text
          style={[
            styles.item,
            activeRoute === "PharmacyPatient_Details" && styles.activeItem,
          ]}
        >
          View Prescriptions
        </Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen("HomePage")}>
        <Text
          style={[styles.item, activeRoute === "HomePage" && styles.activeItem]}
        >
          Logout
        </Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: -1,
    backgroundColor: "#008080", // Sidebar background color
    width: 240, // Sidebar width
    alignItems: "center", // Center items horizontally
    justifyContent: "flex-start", // Align items to the top
    paddingTop: 10, // Add padding to the top
    marginTop: 0, // Adjust margin to overlap with NurseHeader
    //paddingHorizontal: 20, // Horizontal padding for items
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "bold",

    color: "lightcyan", // Very light yellow
  },
  item: {
    fontSize: 25,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
    color: "lavender", // Light teal colorgive
  },
  activeItem: {
    color: "lightsalmon", // Change color for active item
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "lavender",
    marginTop: 5,
    marginBottom: 5,
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarClosed: {
    left: -200,
  },
});

export default PharmacySidebar;
