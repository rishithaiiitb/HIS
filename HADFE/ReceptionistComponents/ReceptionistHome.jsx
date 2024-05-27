import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import ReceptionistHeader from "./ReceptionistHeader";
import ReceptionistSidebar from "./Sidebar";
import { API_BASE_URL } from "../config";
import { Calendar } from 'react-native-big-calendar';
import { Table, Row } from "react-native-table-component";
import Nurse_Home from "../Nurse_Comp_Images/Nurse_Home.png";

export default function ReceptionistHome({ navigation }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [receptionistDetails, setReceptionistDetails] = useState(null);
  const [receptionistSchedule, setReceptionistSchedule] = useState([]);
  const [receptionistId, setreceptionistId] = useState(null);
  const [tableHead, setTableHead] = useState(["Day", "Start Time", "End Time"]);
  const [tableData, setTableData] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchReceptionistDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/receptionist/getReceptionistDetailsByEmail/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const receptionistId = response.data.receptionistId;
        setreceptionistId(receptionistId);
        setReceptionistDetails(response.data);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          Alert.alert(
            "Error",
            "Session Expired !!Please Log in again",
            [
              {
                text: "OK",
                onPress: () => {
                  AsyncStorage.removeItem("token");
                  navigation.navigate("HomePage");
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          console.error("Error fetching receptionist details:", error);
        }
      }
    };
    fetchReceptionistDetails();
  }, [receptionistId]);

  useEffect(() => {
    const fetchReceptionistSchedule = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/receptionist/viewReceptionistScheduleById/${receptionistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReceptionistSchedule(response.data);
        // Convert receptionist schedule data into table format
        const formattedData = response.data.map((item) => [
          item.day,
          item.startTime,
          item.endTime,
        ]);
        setTableData(formattedData);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          Alert.alert(
            "Error",
            "Session Expired !!Please Log in again",
            [
              {
                text: "OK",
                onPress: () => {
                  AsyncStorage.removeItem("token");
                  navigation.navigate("HomePage");
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          console.error("Error updating receptionist schedule:", error);
        }
      }
    };

    fetchReceptionistSchedule();
  }, [receptionistId]);

  // Function to convert schedule data into a format suitable for bar graph
  const prepareScheduleDataForGraph = () => {
    // Example conversion: [{ day: 'Mon', duration: 4 }, { day: 'Tue', duration: 3 }, ...]
    return receptionistSchedule.map((item) => ({
      day: item.day,
      duration: calculateDuration(item.startTime, item.endTime),
    }));
  };

  // Function to calculate duration from start time and end time
  const calculateDuration = (startTime, endTime) => {
    // Parse start time and end time strings into Date objects
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    // Calculate the difference in milliseconds
    const durationInMs = end - start;

    // Convert milliseconds to minutes (assuming duration is less than 24 hours)
    const durationInMinutes = durationInMs / (1000 * 60);

    return durationInMinutes;
  };
  // Define the data for the bar chart
  const data = tableData.map((item) => calculateDuration(item[1], item[2])); // Assuming tableData contains start and end times

  // Define the labels for the bar chart
  const labels = tableData.map((item) => item[0]); // Assuming tableData contains days of the week

  // Data for the receptionist schedule chart
  const scheduleData = prepareScheduleDataForGraph();

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
const recSched = tableData.map(item => {
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


  return (
    <View style={styles.container}>
      <ReceptionistHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <ReceptionistSidebar
            navigation={navigation}
            receptionistId={receptionistId}
            isSidebarOpen={isSidebarOpen}
            activeRoute="ReceptionistHome"
          />
        )}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <ImageBackground
            source={{
              uri: "https://www.boston-engineering.com/wp-content/uploads/2021/09/BelovedBabyishAustraliancattledog-size_restricted.gif",
            }}
            style={styles.detailsContainer}
          >
            {receptionistDetails ? (
              <>
                <Text style={styles.detailHeading}>
                  Your Profile Overview...
                </Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>
                    {receptionistDetails.name}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Age:</Text>
                  <Text style={styles.detailValue}>
                    {receptionistDetails.age}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Sex:</Text>
                  <Text style={styles.detailValue}>
                    {receptionistDetails.sex}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Contact:</Text>
                  <Text style={styles.detailValue}>
                    {receptionistDetails.contact}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>
                    {receptionistDetails.email}
                  </Text>
                </View>
                <Image
                  source={{ uri: receptionistDetails.photo }}
                  style={styles.receptionistImage}
                />
              </>
            ) : (
              <Text>Loading receptionist details...</Text>
            )}
          </ImageBackground>
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleHeading}>Your Weekly Schedule:</Text>
            {/* <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={styles.row}
                  textStyle={{ padding: 10 }} // Set the textStyle as an object
                />
              ))}
            </Table> */}
            {/* Render the bar graph
            
<BarChart
  style={{ height: 200 }}
  data={data}
  svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
  contentInset={{ top: 30, bottom: 30 }}
  spacingInner={0.3}
  spacingOuter={0.3}
  gridMin={0}
>
  <Grid />
  {data.map((value, index) => (
    <Text
      key={index}
      x={(index * 30) + 15} // Adjust the positioning of the labels
      y={180 - value - 10} // Adjust the positioning of the labels
      fontSize={12}
      fill="black"
      alignmentBaseline={'middle'}
      textAnchor={'middle'}
    >
      {labels[index]} {/* Display the day of the week as the label */}
            {/* </Text>
  ))}
</BarChart> */}

<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1}}>
              <Image
                source={Nurse_Home}
                style={styles.rightImage}
              />
            </View>
            <View style={{ flex: 3, marginHorizontal: 30, marginBottom: 20, marginTop:20 }}>
              <Calendar
                events={recSched}
                height={200}
                hourRowHeight={35}
                style={{ borderWidth: 1, borderColor: 'teal' }}
                eventCellStyle={{ backgroundColor: 'teal' }} // Set teal color for event boxes
                eventInnerStyle={{ padding: 2 }} // Adjust padding inside event boxes
                //dayHeaderStyle={{ backgroundColor: 'lightcyan'}}
                //rowHeight={40} // Set the height of each row
                cellHeight={10} // Set the height between every hour
                scrollToOverflowEnabled={true}
              />
            </View>
            
          </View>
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
  receptionistImage: {
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