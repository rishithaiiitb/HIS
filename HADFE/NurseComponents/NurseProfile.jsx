import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import {useEmail} from '../Context/EmailContext';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import { Table, Row } from 'react-native-table-component';
import * as Font from 'expo-font';
import BG_Nurse_Profile from "../Nurse_Comp_Images/BG_Nurse_Profile.gif";
import Nurse_Pic from "../Nurse_Comp_Images/Nurse_Pic.png";
import LoadingScreen from '../Loading';

export default function NurseProfile({ navigation }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [nurseDetails, setNurseDetails] = useState(null);
    const [nurseSchedule, setNurseSchedule] = useState([]);
    const [nurseId, setNurseId] = useState(null); 
    const [tableHead, setTableHead] = useState(['Day', 'Start Time', 'End Time']);
    const [tableData, setTableData] = useState([]);  
    const [isLoading,setIsLoading] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    useEffect(() => {
      const fetchNurseDetails = async () => {
        try {
          const token = await AsyncStorage.getItem('token');        
          const response = await axios.get(`${API_BASE_URL}/nurse/getNurseDetailsByEmail/${email}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const nurseId = response.data.nurseId;
          setNurseId(nurseId);
          setNurseDetails(response.data);
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
          console.error('Error fetching nurse details:', error);
        }}
      };
      fetchNurseDetails();
    }, [nurseId]);
  
    useEffect(() => {
      const fetchNurseSchedule = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get(`${API_BASE_URL}/nurse/viewNurseScheduleById/${nurseId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNurseSchedule(response.data);
          // Convert nurse schedule data into table format
          const formattedData = response.data.map(item => [item.day, item.start_time, item.end_time]);
          setTableData(formattedData);
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
          console.error('Error fetching nurse schedule:', error);
        }}
      };
  
      fetchNurseSchedule();
    }, [nurseId]);
  
   
     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const today = new Date(); // Get the current date
  const dayOfWeek = today.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const mondayDate = new Date(today); // Create a new Date object based on the current date
  
  // Calculate the difference in days to Monday (assuming Sunday is the first day of the week)
  const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  mondayDate.setDate(today.getDate() - diffToMonday); // Subtract the difference to get to Monday
  
  // Array to store all the dates from Monday to Sunday
  const datesOfWeek = [];
  
  // Loop to calculate the dates for each day of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate); // Create a new Date object based on Monday's date
    date.setDate(mondayDate.getDate() + i); // Add the index (0 to 6) to get each day of the week
    datesOfWeek.push(date); // Push the date to the array
  }
  
  // Form calendar events based on the weekday from the schedule data
  const nurseSched = tableData.map(item => {
    // Find the index of the weekday in the daysOfWeek array
    const dayIndex = daysOfWeek.findIndex(day => day.toUpperCase() === item[0].toUpperCase())-1;
    
    // If the weekday is found, use its corresponding date from datesOfWeek array
    if (dayIndex !== -1) {
      const date = datesOfWeek[dayIndex];
      // Parse start time and end time strings into Date objects
      const startTimeParts = item[1].split(':').map(part => parseInt(part));
      const endTimeParts = item[2].split(':').map(part => parseInt(part));
      
      // Set the hours of the start and end times using the parsed values
      date.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2]);
      const startDate = new Date(date);
      
      date.setHours(endTimeParts[0], endTimeParts[1], endTimeParts[2]);
      const endDate = new Date(date);
      return {
        title: item[0], // Use the weekday as the title
        start: startDate, // Start time
        end: endDate, // End time
      };
    } else {
      // Handle case where weekday from schedule data doesn't match any date in this week
      console.error(`Weekday '${item[1]}' from schedule data does not match any date in this week.`);
      return null; // Return null for unmatched weekdays
    }
  }).filter(event => event !== null); // Filter out null events
  
  console.log(nurseSched); // Output the formed calendar events
  
    if(!nurseSchedule || !nurseDetails)
    {
      return <LoadingScreen/>
    }
  
    return (
      <View style={styles.container}>
        <NurseHeader onPress={toggleSidebar} />
        <View style={styles.content}>
          {isSidebarOpen && <NurseSidebar navigation={navigation} nurseId={nurseId} isSidebarOpen={isSidebarOpen}/>}
          <ScrollView contentContainerStyle={styles.formContainer}>
            <ImageBackground source={BG_Nurse_Profile} style={styles.detailsContainer}>
              {nurseDetails ? (
                <>
                  <Text style={styles.detailHeading}>Your Profile Overview...</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{nurseDetails.name}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Age:</Text>
                    <Text style={styles.detailValue}>{nurseDetails.age}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Sex:</Text>
                    <Text style={styles.detailValue}>{nurseDetails.sex}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Contact:</Text>
                    <Text style={styles.detailValue}>{nurseDetails.contact}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{nurseDetails.email}</Text>
                  </View>
                  <Image
                                    source={{ uri: nurseDetails.photo }}
                                    style={styles.nurseImage}
                                />
                </>
              ) : (
                <Text>Loading nurse details...</Text>
              )}
            </ImageBackground>
            <View style={styles.scheduleContainer}>
              <Text style={styles.scheduleHeading}>Your Weekly Schedule:</Text>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                {tableData.map((rowData, index) => (
                  <Row
                  key={index}
                  data={rowData}
                  style={styles.row}
                  textStyle={styles.text} // Pass the styles from styles.text
                />
                ))}
              </Table>
              
  
              </View>
            
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
    nurseImage: {
      width: 260,
      height: 260,
      position: 'absolute',
      top: 20,
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
  