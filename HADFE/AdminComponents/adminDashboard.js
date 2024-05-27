import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import LoadingScreen from "../Loading";
import BG_Image from '../Admin_Comp_Images/Admin_BG.jpg';

const AdminHome = ({}) => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    nurses: 0,
    receptionists: 0,
    pharmacy: 0,
  });
  const [hospitalDetails, setHospitalDetails] = useState(null);
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isFocused = useIsFocused(); // Use useIsFocused hook to determine if the screen is focused

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleSessionExpired = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("HomePage"); // Make sure you have a 'HomePage' in your navigation stack
  };

  const checkResponse = (response) => {
    if (response.status === 500) {
      Alert.alert("Session Expired", "Please log in again.", [
        { text: "OK", onPress: handleSessionExpired },
      ]);
      return true; // Indicates an error was handled
    }
    return false; // No error was handled
  };

  useEffect(() => {
    if (isFocused) {
      fetchData(); // Fetch data when the screen is focused
    }
  }, [isFocused]); // Trigger effect whenever isFocused changes

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const hospitalDetailsResponse = await axios.get(
        `${API_BASE_URL}/admin/getHospitalDetails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (checkResponse(hospitalDetailsResponse)) return;

      const patientCountResponse = await axios.get(
        `${API_BASE_URL}/admin/patientCount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (checkResponse(patientCountResponse)) return;

      const doctorCountResponse = await axios.get(
        `${API_BASE_URL}/admin/doctorCount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (checkResponse(doctorCountResponse)) return;

      const nurseCountResponse = await axios.get(
        `${API_BASE_URL}/admin/nurseCount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (checkResponse(nurseCountResponse)) return;

      const receptionistCountResponse = await axios.get(
        `${API_BASE_URL}/admin/receptionistCount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (checkResponse(receptionistCountResponse)) return;

      const pharmacyCountResponse = await axios.get(
        `${API_BASE_URL}/admin/pharmacyCount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (checkResponse(pharmacyCountResponse)) return;

      const hospitalDetailsData = hospitalDetailsResponse.data;
      const patientCount = patientCountResponse.data;
      const doctorCount = doctorCountResponse.data;
      const nurseCount = nurseCountResponse.data;
      const receptionistCount = receptionistCountResponse.data;
      const pharmacyCount = pharmacyCountResponse.data;

      setHospitalDetails(hospitalDetailsData);
      setCounts({
        patients: patientCount,
        doctors: doctorCount,
        nurses: nurseCount,
        receptionists: receptionistCount,
        pharmacy: pharmacyCount,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (!hospitalDetails || !counts) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
      <AdminHeader onPressMenu={toggleSidebar} showBackButton={false} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="AdminHome"/>
        )}

        {/* Main content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
           {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
          <>
          {hospitalDetails && (
                 <ImageBackground source={BG_Image} style={styles.backgroundImage}>
                 <View style={styles.hcard}>
            <Text style={styles.title}>Hospital Details</Text>
            {hospitalDetails && (
                     <>
                       <View style={styles.detailRow}>
                         <Text style={styles.detailName}>Name:  </Text>
                         <Text style={styles.detailValue}>{hospitalDetails.name}</Text>
                       </View>
                       <View style={styles.detailRow}>
                         <Text style={styles.detailName}>Address:  </Text>
                         <Text style={styles.detailValue}>{hospitalDetails.address}</Text>
                       </View>
                       <View style={styles.detailRow}>
                         <Text style={styles.detailName}>Phone:  </Text>
                         <Text style={styles.detailValue}>{hospitalDetails.contact}</Text>
                       </View>
                       <View style={styles.detailRow}>
                         <Text style={styles.detailName}>Email:  </Text>
                         <Text style={styles.detailValue}>{hospitalDetails.email}</Text>
                       </View>
                     </>
                   )}
                 </View>
               </ImageBackground>
              )}
              <Text style={styles.heading}>Exploring Employee Statistics</Text>
              <View style={[styles.gridContainer, isSidebarOpen && styles.gridContainerWithSidebar]}>
                {Object.keys(counts).map((key, index) => (
                  <View key={index} style={[styles.card, isSidebarOpen && styles.smallCard, { width: `${100 / 4}%`, backgroundColor: styles.getCountColor(index) }]}>
                    <Image source={{ uri: getIconUri(key) }} style={styles.icon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.title1}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                      <Text style={styles.count}>{counts[key]}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );

};

  const getIconUri = (key) => {
    switch (key) {
      case 'patients':
        return 'https://cdn-icons-png.flaticon.com/256/1158/1158425.png';
      case 'doctors':
        return 'https://cdn.pixabay.com/photo/2020/12/09/16/40/doctor-5817903_1280.png';
      case 'nurses':
        return 'https://cdn-icons-png.freepik.com/512/8496/8496122.png';
      case 'receptionists':
        return 'https://cdn-icons-png.flaticon.com/512/3073/3073790.png';
      case 'pharmacy':
        return 'https://cdn-icons-png.flaticon.com/512/2621/2621846.png';
      default:
        return '';
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      //alignItems: 'center',
      //paddingTop: 50,
      //marginTop: 20,
      //justifyContent: 'center',
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      //width: '100%',
      //backgroundColor: '#ffffff',
      //paddingHorizontal: 20,
      //paddingTop: 20,
    },
    scrollContainer: {
      flex: 1,
     //alignItems: 'center',
      // paddingTop: 0,
    },
    backgroundImage: {
      width: '100%',
      height:'70%',
    },
    heading: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 10,
      color: 'teal',
      marginTop: -120,
    },
    hcard: {
      backgroundColor: 'lavenderblush',
      borderRadius: 10,
      borderColor: 'plum',
      borderWidth: 1,
      padding: 20,
      marginVertical: 30,
      marginLeft: 80,
      elevation: 5,
      shadowColor: 'plum',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: '40%',
      marginHorizontal: '2.5%',
      flexDirection: 'column', // Align items horizontally
      alignItems: 'center', // Center content vertically
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: '46%',
      marginHorizontal: '2.5%',
      flexDirection: 'row', // Align items horizontally
      alignItems: 'center', // Center content vertically
      marginHorizontal: 10,
      marginBottom: 20,
      borderRadius: 20,
      padding: 10,
      alignItems: 'center',
  justifyContent: 'center',
  elevation: 3, // for Android shadow
  shadowOffset: { width: 1, height: 1 }, // for iOS shadow
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 2,
  
    },
    smallCard: {
      width: '30%',
    },
    textContainer: {
      marginLeft: 10, // Add margin between icon and text
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: 'mediumpurple',
    },
    title1: {

      fontSize: 18,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginTop: 5,
  paddingLeft: 20,
  color: 'ghostwhite',
    },
    count: {
      textAlign: 'center',
      fontSize: 30,
  fontWeight: 'bold',
  color: 'ghostwhite',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginLeft: 50,
      marginRight: -150,
    },
    gridContainerWithSidebar: {
      justifyContent: 'flex-start', // Adjust the alignment for the grid when the sidebar is open
    },
    icon: {
      width: 70,
      height: 70,
      marginBottom: 10,
    },
    // Define an array of colors for the count buttons
    countColors: ['lightcoral', 'lightseagreen', 'lightslategrey', '#57d9a3', 'lightsalmon'],
  
    // Define a function to get the count button color based on index
    getCountColor: (index) => {
      return styles.countColors[index % styles.countColors.length];
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    detailName: {
      fontSize: 16,
      fontWeight: 'bold',
      //marginBottom: 5,
  
    },
    detailValue: {
      fontSize: 16,
      //marginBottom: 10,
    },
  });
  
  export default AdminHome;
  