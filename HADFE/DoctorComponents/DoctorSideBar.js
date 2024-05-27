import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image ,ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "../config";
import { useEmail } from "../Context/EmailContext";

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};


const DoctorSideBar = ({ activeRoute }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = useEmail();
  const [doctorDetails, setDoctorDetails] = useState(null);

  const logoutUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/doctor/logout/${email}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          await AsyncStorage.removeItem('token');
          navigation.navigate('HomePage');
        } else {
          console.error('Failed to log out:', response.statusText);
        }
      } else {
        console.error('Token not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/doctor/home/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDoctorDetails(response.data);
      } catch (error) {
        if(error.response && error.response.status===500)
        {
          Alert.alert(
            'Error',
            'Session Expired !!Please Log in again',
            [
              { text: 'OK', onPress: () => {
                AsyncStorage.removeItem('token');
                navigation.navigate("HomePage")} }
            ],
            { cancelable: false }
          );
        }else{
        console.error('Error fetching doctor details:', error);
      }}
    };

    fetchDoctorDetails();
  }, [email]);

  const navigateToScreen = async (routeName) => {
    if (routeName === "HomePage") {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/doctor/exitDutyDoctor/${email}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          logoutUser();
        } else {
          Alert.alert(
            'Error',
            'Session Expired !!Please Log in again',
            [
              { text: 'OK', onPress: () => {
                AsyncStorage.removeItem('token');
                navigation.navigate("HomePage")} }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if(error.response && error.response.status===500)
        {
          Alert.alert(
            'Error',
            'Session Expired !!Please Log in again',
            [
              { text: 'OK', onPress: () => {
                AsyncStorage.removeItem('token');
                navigation.navigate("HomePage")} }
            ],
            { cancelable: false }
          );
        }else{
        console.error('Error:', error);
      }}
    } else {
      navigation.navigate(routeName, { shouldFetchData: true });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {doctorDetails ? (
          <>
            <Image source={{ uri: doctorDetails.photo }} style={styles.profileImage} />
            <Text style={styles.profileText}>{doctorDetails.name}</Text>
            <Text style={styles.profileText}>
              Contact : {doctorDetails.contact}
            </Text>
            <Text style={styles.profileText}>Email : {doctorDetails.email}</Text>
            <Text style={styles.profileText}>Department : {doctorDetails.department}</Text>
          </>
        ) : (
          <Text>Loading doctor details...</Text>
        )}
        <Text style={styles.profileText}>Doctor</Text>
      </View>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={() => navigateToScreen("DoctorHome")}>
        <Text
          style={[
            styles.item,
            activeRoute === "DoctorHome" && styles.activeItem,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity
        onPress={() => navigateToScreen("DoctorPatientDetails")}
      >
        <Text
          style={[
            styles.item,
            activeRoute === "DoctorPatientDetails" && styles.activeItem,
          ]}
        >
          Patient Details
        </Text>
      </TouchableOpacity>
      {doctorDetails && doctorDetails.department==="IP" && (
        <>
      <View style={styles.line}></View>
      <TouchableOpacity
        onPress={() => navigateToScreen("QRScanner")}
      >
        <Text
          style={[
            styles.item,
            activeRoute === "QRScanner" && styles.activeItem,
          ]}
        >
          QR Code
        </Text>
      </TouchableOpacity>
      </>
)}
      <View style={styles.line}></View>
      <TouchableOpacity onPress={() => navigateToScreen("HomePage")}>
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
  profileRole: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    color: 'lavender', // Very light yellow
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

export default DoctorSideBar;
