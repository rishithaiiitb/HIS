import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import { Table, Row } from 'react-native-table-component';
import Doctor_Profile_BG from '../Doctor_Comp_Images/BG_Doctor_Profile.gif'

export default function DoctorProfile({ navigation, route }) {
    const { email } = useEmail();
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchDoctorDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/home/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 500) {
                Alert.alert(
                    'Error',
                    'Session Expired! Please log in again',
                    [
                        { text: 'OK', onPress: () => {
                            AsyncStorage.removeItem('token');
                            navigation.navigate("HomePage");
                        }}
                    ],
                    { cancelable: false }
                );
            }
            const fetchedDoctorDetails = await response.json();
            setDoctorDetails(fetchedDoctorDetails);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            if (error.response && error.response.status === 500) {
                Alert.alert(
                    'Error',
                    'Session Expired! Please log in again',
                    [
                        { text: 'OK', onPress: () => {
                            AsyncStorage.removeItem('token');
                            navigation.navigate("HomePage");
                        }}
                    ],
                    { cancelable: false }
                );
            }
        }
    };


    useEffect(() => {
        fetchDoctorDetails();
    }, [email]);

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={toggleSidebar} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSideBar navigation={navigation} />}
                <ScrollView contentContainerStyle={styles.formContainer}>
                <ImageBackground source={Doctor_Profile_BG} style={styles.detailsContainer}>
                        {doctorDetails ? (
                            <>
                                <Text style={styles.detailHeading}>Your Profile Overview...</Text>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Name:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.name}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Age:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.age}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Sex:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.sex}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Contact:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.contact}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Email:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.email}</Text>
                                </View>
                                <Image
                                    source={{ uri: doctorDetails.photo }}
                                    style={styles.doctorImage}
                                />
                            </>
                        ) : (
                            <Text>Loading doctor details...</Text>
                        )}
                    </ImageBackground>
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
      // flex: 1, Remove this line to allow ScrollView to take up the entire space
    },
    detailsContainer: {
      padding: 20,
      backgroundColor: 'lightcyan',
      marginBottom: 20,
      fontSize: 14,
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
    doctorImage: {
      width: 260,
      height: 260,
      position: 'absolute',
      top: 10,
      right: 40,
      borderRadius: 130,
      borderWidth: 2,
      borderColor: 'white',
    },
    scheduleLabels: {
      marginTop: 10,
      textAlign: 'center',
    },
    // Style for table header (head)
    head: { 
      height: 60, 
      backgroundColor: '#b2f5ea', 
      justifyContent: 'center', // Center align the content vertically
      flexDirection: 'row', // Make the content of the header row aligned horizontally
    },
    // Style for table cell text (text)
    text: { 
      margin: 6, 
      fontWeight: 'bold', // Make the text bold
      textAlign: 'center', // Center align the text
      padding: 5, // Add padding here
      fontSize: 15,
    },
    
    row: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    barChart: {
      height: 200,
      marginTop: 20, // Adjust as needed to create space between the table and the bar chart
    },
    rightImage: {
      marginLeft: 10,
      width: 220,
      height: 450,
      resizeMode: 'cover',
      borderRadius: 50,
      marginTop: 20,
      marginRight: 20,
    },
  });
  