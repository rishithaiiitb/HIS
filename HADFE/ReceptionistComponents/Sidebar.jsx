
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { useEmail } from "../Context/EmailContext";
import axios from 'axios'; 
import Receptionist_Pic from "../Receptionist_Comp_Images/Receptionist_Pic.png";
import { useNavigation } from "@react-navigation/native";
import EditPatientDetails from "./EditPatientDetails";

const ReceptionistSidebar = ({ navigation,activeRoute}) => {
  const { email } = useEmail();
  const [receptionistDetails, setReceptionistDetails] = useState(null);
  const [receptionistId, setReceptionistId] = useState(null);
  const logoutUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await fetch(
          `${API_BASE_URL}/receptionist/logout/${email}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          await AsyncStorage.removeItem("token");
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
    const fetchReceptionistDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/receptionist/getReceptionistDetailsByEmail/${email}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const receptionistId = response.data.receptionistId;
        setReceptionistId(receptionistId);
        setReceptionistDetails(response.data);
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
        console.error('Error fetching receptionist details:', error);
      }}
    };

    fetchReceptionistDetails();
  }, [receptionistId]);

  const navigateToScreen = (route) => () => {
    if (route === "Appointment") {
      navigation.navigate(route,{ isOTPVerified: false });
    } else if (route === "EditPatientDetails") {
      navigation.navigate(EditPatientDetails);
    } else if (route === "HomePage") {
      logoutUser();
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        
      
        {receptionistDetails ? (
          
              <>
              <Image source={{ uri: receptionistDetails.photo }} style={styles.profileImage} />
                <Text style={styles.profileText}>{receptionistDetails.name}</Text>
                <Text style={styles.profileText}>Contact: {receptionistDetails.contact}</Text>
                <Text style={styles.profileText}>Email: {receptionistDetails.email}</Text>
              </>
            ) : (
              <Text>Loading receptionist details...</Text>
            )}
        <Text style={styles.profileText}>Receptionist</Text>
      </View>
      <View style={styles.line}></View>

        <TouchableOpacity onPress={navigateToScreen("ReceptionistHome")}>
          <Text style={[styles.item, activeRoute==='ReceptionistHome' && styles.activeItem]}>Home</Text>
        </TouchableOpacity>

      <View style={styles.line}></View>
        <TouchableOpacity onPress={navigateToScreen("Appointment")}>
          <Text style={[styles.item, activeRoute==='Appointment' && styles.activeItem]}>Appointment</Text>
        </TouchableOpacity>

      <View style={styles.line}></View>
        <TouchableOpacity onPress={navigateToScreen("EditPatientDetails")}>
          <Text style={[styles.item, activeRoute==='EditPatientDetails' && styles.activeItem]}>Edit Details</Text>
        </TouchableOpacity>


      <View style={styles.line}></View>
        <TouchableOpacity onPress={navigateToScreen("HomePage")}>
          <Text style={[styles.item, activeRoute==='HomePage' && styles.activeItem]}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>

      
      </View>
  );
};

// const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   //   backgroundColor: "#669bed",
//   //   width: 140,
//   //   alignItems: "center",
//   //   justifyContent: "flex-start",
//   //   paddingTop: 10,
//   //   marginTop: -19,
//   //   marginLeft: -30,
//   //   paddingHorizontal: 20,
//   // },
//   container: {
//     flex: -1,
//     backgroundColor: '#008080', // Sidebar background color
//     width: 240, // Sidebar width
//     alignItems: 'center', // Center items horizontally
//     justifyContent: 'flex-start', // Align items to the top
//     paddingTop: 10, // Add padding to the top
//     marginTop: 0, // Adjust margin to overlap with Header
//     //paddingHorizontal: 20, // Horizontal padding for items
//   },
//   profileContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   profileImage: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     marginBottom: 10,
//   },
//   profileText: {
//     fontSize: 15,
//     marginBottom: 5,
//     fontWeight: 'bold',
    
//     color: 'lightcyan', // Very light yellow 
//   },
//   item: {
//     fontSize: 25,
//     marginBottom: 10,
//     marginTop: 10,
//     fontWeight: 'bold',
//     color: 'lavender', // Light teal colorgive
//   },
//   activeItem: {
//     color: 'lightsalmon', // Change color for active item
//   },
//   line: {
//     width: '100%',
//     height: 1,
//     backgroundColor: 'lavender',
//     marginTop: 5,
//     marginBottom: 5,
//   },
//   sidebarOpen: {
//     left: 0,
//   },
//   sidebarClosed: {
//     left: -200,
//   },
// });




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
    marginTop: 0,
    marginBottom: 5,
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarClosed: {
    left: -200,
  },
});

export default ReceptionistSidebar;
