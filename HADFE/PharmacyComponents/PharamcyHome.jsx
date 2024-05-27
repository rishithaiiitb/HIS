import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PharmacyHeader from './PharmacyHeader';
import PharmacySidebar from './PharmacySidebar';
import { API_BASE_URL } from '../config';
import { useEmail } from '../Context/EmailContext';
import { useFocusEffect } from '@react-navigation/native';

export default function PharmacyDetails({ navigation }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pharmacyDetails, setPharmacyDetails] = useState(null);
  const [totalPatientsServed, setTotalPatientsServed] = useState(0);
  const [totalMedicinesServed, setTotalMedicinesServed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSessionExpiration = () => {
    Alert.alert(
      'Error',
      'Session Expired !! Please Log in again',
      [{ text: 'OK', onPress: () => {
        AsyncStorage.removeItem('pharmacytoken');
        navigation.navigate("HomePage");
      }}],
      { cancelable: false }
    );
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('pharmacytoken');
      const detailsResponse = await axios.get(`${API_BASE_URL}/pharmacy/home/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalResponse = await axios.get(`${API_BASE_URL}/pharmacy/total-served`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPharmacyDetails(detailsResponse.data);
      setTotalPatientsServed(totalResponse.data.totalPatientsServed);
      setTotalMedicinesServed(totalResponse.data.totalMedicinesServed);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        handleSessionExpiration();
      } else {
        console.error('Error fetching data:', error);
      }
    }
  };

  // Fetch data initially and set up a timer for refreshing data
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Ensure data is refreshed when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <PharmacyHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && <PharmacySidebar navigation={navigation}  email={email}  activeRoute="PharmacyHome"/>}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <ImageBackground source={{ uri: "https://i.pinimg.com/736x/c6/f8/05/c6f8054235ac9523148c25010952d3af.jpg" }} style={styles.detailsContainer}>
            {pharmacyDetails ? (
              <>
                <Text style={styles.detailHeading}>Pharmacy Details...</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{pharmacyDetails.name}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>{pharmacyDetails.address}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{pharmacyDetails.contact}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{pharmacyDetails.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>License No:</Text>
                  <Text style={styles.detailValue}>{pharmacyDetails.licenseNumber}</Text>
                </View>
              </>
            ) : (
              <Text>Loading pharmacy details...</Text>
            )}
            <View style={styles.servedDataContainer}>
  <View style={styles.servedBox}>
    <Text style={styles.servedLabel}>Total Patients Served</Text>
    <Text style={styles.servedValue}>{totalPatientsServed}</Text>
  </View>
  <View style={styles.servedBox}>
    <Text style={styles.servedLabel}>Total Medications Served</Text>
    <Text style={styles.servedValue}>{totalMedicinesServed}</Text>
  </View>
</View>

            <Image
              source={{ uri: "https://t4.ftcdn.net/jpg/01/10/40/85/360_F_110408571_MKABH1lRABlrn4aK6gUsWhFv9gTdSMOe.jpg" }}
              style={styles.nurseImage}
            />
          </ImageBackground>
          <Image
            source={{ uri: "https://indusuni.ac.in/uploads/blogs/iipr/Pioneering%20the%20Future%20of%20Healthcare.gif" }}
            style={styles.image}
            resizeMode="cover"
            onLoad={() => setIsLoading(false)} // Once image is loaded, set isLoading to false
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    flex: 1, //Remove this line to allow ScrollView to take up the entire space
  },
  image: {
    width: '100%',
    height: 320, // Adjust height as needed
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'lightcyan',
    marginBottom: 0,
    fontSize: 14,
    //paddingBottom: 0,
  },
  detailHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'crimson',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    width: 150,
    fontSize: 20,
    color: 'lavenderblush',
  },
  detailValue: {
    flex: 1,
    fontSize: 20,
    color: 'lavenderblush',
  },
  scheduleContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  scheduleHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
  },
  nurseImage: {
    width: 260,
    height: 260,
    position: 'absolute',
    top: 10,
    right: 40,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: 'white',
  },
  servedDataContainer: {
    marginTop: 20,
    backgroundColor: 'lightgoldenrodyellow',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around', // Align boxes with space around them
    borderWidth: 2,
    borderColor: 'white',
  },
  servedBox: {
    alignItems: 'center', // Center align text inside the box
  },
  servedLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  servedValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'teal', // Adjust color as needed
  },
  
});
