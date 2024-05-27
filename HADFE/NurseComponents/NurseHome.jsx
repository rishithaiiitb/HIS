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
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { API_BASE_URL } from "../config";
import { Calendar } from "react-native-big-calendar";
import * as Font from "expo-font";
import { PieChart } from "react-native-gifted-charts";
import Nurse_Home from "../Nurse_Comp_Images/Nurse_Home.png";
import LoadingScreen from "../Loading";

export default function NurseHome({ navigation }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nurseDetails, setNurseDetails] = useState(null);
  const [nurseSchedule, setNurseSchedule] = useState([]);
  const [nurseId, setNurseId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(2); // Display 2-3 patients per page

  const handlePatientDetailClick = (patientId) => {
    navigation.navigate("NursePatient_Dashboard", { patientId });
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const emergencyResponse = await axios.get(
        `${API_BASE_URL}/nurse/getEmergencyPatients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderedEmergencyPatients = emergencyResponse.data.sort(
        (a, b) => a.order - b.order
      );

      await Promise.all(
        orderedEmergencyPatients.map(async (patient) => {
          const response = await axios.get(
            `${API_BASE_URL}/nurse/vitals-and-symptoms/${patient.patientId}/${patient.consent.token}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return { ...patient, colorData: response.data };
        })
      ).then(setEmergencyPatients);

      const patientsResponse = await axios.get(
        `${API_BASE_URL}/nurse/getAllPatients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderedPatients = patientsResponse.data.sort(
        (a, b) => a.order - b.order
      );

      await Promise.all(
        orderedPatients.map(async (patient) => {
          const response = await axios.get(
            `${API_BASE_URL}/nurse/vitals-and-symptoms/${patient.patientId}/${patient.consent.token}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return { ...patient, colorData: response.data };
        })
      ).then(setPatients);
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
        console.error("Error fetching data:", error);
      }
    }
  };

  

  // Start polling when the component mounts and stop polling on unmount
  useEffect(() => {
    fetchData(); 
  }, []);

  // Stop polling when navigating away from the screen
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => clearInterval(intervalId);
    }, [])
  );

  const getTotalPatients = () => {
    return patients.length + emergencyPatients.length;
  };

  const getPatientsFilledStatusCounts = () => {
    const fullyFilledCount = patients.filter(
      (patient) =>
        patient.colorData.symptomsFilled && patient.colorData.vitalsFilled
    ).length;
    const partiallyFilledCount =
      patients.filter(
        (patient) =>
          patient.colorData.symptomsFilled || patient.colorData.vitalsFilled
      ).length - fullyFilledCount;
    const notFilledCount =
      patients.length - (fullyFilledCount + partiallyFilledCount);
    return [fullyFilledCount, partiallyFilledCount, notFilledCount];
  };

  const getEmerPatientsFilledStatusCounts = () => {
    const fullyFilledCount = emergencyPatients.filter(
      (patient) =>
        patient.colorData.symptomsFilled && patient.colorData.vitalsFilled
    ).length;
    const partiallyFilledCount =
      emergencyPatients.filter(
        (patient) =>
          patient.colorData.symptomsFilled || patient.colorData.vitalsFilled
      ).length - fullyFilledCount;
    const notFilledCount =
      emergencyPatients.length - (fullyFilledCount + partiallyFilledCount);
    return [fullyFilledCount, partiallyFilledCount, notFilledCount];
  };

  const getEmergencyPatientsCount = () => {
    return emergencyPatients.length;
  };

  const getNonEmergencyPatientsCount = () => {
    return patients.length;
  };

  useEffect(() => {
    const fetchNurseDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/nurse/getNurseDetailsByEmail/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const nurseId = response.data.nurseId;
        setNurseId(nurseId);
        setNurseDetails(response.data);
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
          console.error("Error fetching nurse details:", error);
        }
      }
    };
    fetchNurseDetails();
  }, [nurseId]);

  useEffect(() => {
    const fetchNurseSchedule = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/nurse/viewNurseScheduleById/${nurseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNurseSchedule(response.data);
        // Convert nurse schedule data into table format
        const formattedData = response.data.map((item) => [
          item.day,
          item.start_time,
          item.end_time,
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
          console.error("Error fetching nurse schedule:", error);
        }
      }
    };

    fetchNurseSchedule();
  }, [nurseId]);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date(); // Get the current date
  const dayOfWeek = today.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const mondayDate = new Date(today); // Create a new Date object based on the current date

  // Calculate the difference in days to Monday (assuming Sunday is the first day of the week)
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
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
  const nurseSched = tableData
    .map((item) => {
      // Find the index of the weekday in the daysOfWeek array
      const dayIndex =
        daysOfWeek.findIndex(
          (day) => day.toUpperCase() === item[0].toUpperCase()
        ) - 1;

      // If the weekday is found, use its corresponding date from datesOfWeek array
      if (dayIndex !== -1) {
        const date = datesOfWeek[dayIndex];
        // Parse start time and end time strings into Date objects
        const startTimeParts = item[1].split(":").map((part) => parseInt(part));
        const endTimeParts = item[2].split(":").map((part) => parseInt(part));

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
        console.error(
          `Weekday '${item[1]}' from schedule data does not match any date in this week.`
        );
        return null; // Return null for unmatched weekdays
      }
    })
    .filter((event) => event !== null); // Filter out null events


    if(!patients || !emergencyPatients || !tableData || !nurseSched)
    {
      return <LoadingScreen/>
    }

  return (
    <View style={styles.container}>
      <NurseHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <NurseSidebar
            navigation={navigation}
            nurseId={nurseId}
            isSidebarOpen={isSidebarOpen}
            activeRoute="NurseHome"
          />
        )}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.legendWrapper}>
            <View style={styles.legendContainer}>
              {/* Legend for Emergency vs Non-Emergency Patients */}
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: "seagreen" },
                  ]}
                />
                <Text style={styles.legendText}>Emergency Patients</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: "steelblue" },
                  ]}
                />
                <Text style={styles.legendText}>Non-Emergency Patients</Text>
              </View>
              {/* Legend for Filled Status for Emergency Patients */}
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: "palegreen" },
                  ]}
                />
                <Text style={styles.legendText}>
                  Both Symptoms & Vitals Filled
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColorBox, { backgroundColor: "wheat" }]}
                />
                <Text style={styles.legendText}>Partially Filled</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColorBox, { backgroundColor: "tomato" }]}
                />
                <Text style={styles.legendText}>Not Filled</Text>
              </View>
            </View>
          </View>
          <View style={styles.pieChartsContainer}>
            {/* Pie Chart 1: Emergency vs Non-Emergency */}
            <View style={styles.pieChartItem}>
              <Text style={styles.chartTitle}>
                Emergency vs Non-Emergency Patients
              </Text>
              <PieChart
                data={[
                  {
                    value: getEmergencyPatientsCount(),
                    color: "seagreen",
                    text: `${getEmergencyPatientsCount()}`, // Show count value instead of text
                    textColor: "white",
                  },
                  {
                    value: getNonEmergencyPatientsCount(),
                    color: "steelblue",
                    text: `${getNonEmergencyPatientsCount()}`, // Show count value instead of text
                    textColor: "white",
                  },
                ]}
                donut={true}
                radius={90}
                showText={true}
                textSize={20}
                strokeWidth={3}
                strokeColor={"white"}
                //isThreeD={true}
                //tilt={1}
                focusOnPress={true}
                toggleFocusOnPress={true}
                showGradient={true}
                gradientCenterColor={"lightblue"}
                textStyle={{ fontWeight: "bold" }}
                textBackgroundColor={"transparent"}
                innerRadius={40}
                innerCircleColor={"white"}
                innerCircleBorderColor={"white"}
                innerCircleBorderWidth={3}
                onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
              />

              <Text style={styles.countText}>Total: {getTotalPatients()}</Text>
            </View>
            <View style={styles.pieChartItem}>
              <Text style={styles.chartTitle}>
                Filled Status for Emergency Patients
              </Text>
              <PieChart
                data={[
                  {
                    value: getEmerPatientsFilledStatusCounts()[0],
                    color: "palegreen",
                    text: `${getEmerPatientsFilledStatusCounts()[0]}`,
                    textColor: "teal",
                  },
                  {
                    value: getEmerPatientsFilledStatusCounts()[1],
                    color: "wheat",
                    text: `${getEmerPatientsFilledStatusCounts()[1]}`,
                    textColor: "teal",
                  },
                  {
                    value: getEmerPatientsFilledStatusCounts()[2],
                    color: "tomato",
                    text: `${getEmerPatientsFilledStatusCounts()[2]}`,
                    textColor: "teal",
                  },
                ]}
                donut={true}
                radius={90}
                showText={true}
                textSize={20}
                strokeWidth={3}
                strokeColor={"white"}
                focusOnPress={true}
                toggleFocusOnPress={true}
                showGradient={true}
                gradientCenterColor={"lightgoldenrodyellow"}
                textStyle={{ fontWeight: "bold" }}
                textBackgroundColor={"transparent"}
                innerRadius={40}
                innerCircleColor={"white"}
                innerCircleBorderColor={"white"}
                innerCircleBorderWidth={3}
                onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
              />
              <Text style={styles.countText}>
                Total: {getEmergencyPatientsCount()}
              </Text>
            </View>

            <View style={styles.pieChartItem}>
              <Text style={styles.chartTitle}>
                Filled Status for General Patients
              </Text>
              <PieChart
                data={[
                  {
                    value: getPatientsFilledStatusCounts()[0],
                    color: "palegreen",
                    text: `${getPatientsFilledStatusCounts()[0]}`,
                    textColor: "teal",
                  },
                  {
                    value: getPatientsFilledStatusCounts()[1],
                    color: "wheat",
                    text: `${getPatientsFilledStatusCounts()[1]}`,
                    textColor: "teal",
                  },
                  {
                    value: getPatientsFilledStatusCounts()[2],
                    color: "tomato",
                    text: `${getPatientsFilledStatusCounts()[2]}`,
                    textColor: "teal",
                  },
                ]}
                donut={true}
                radius={90}
                showText={true}
                textSize={20}
                strokeWidth={3}
                strokeColor={"white"}
                focusOnPress={true}
                toggleFocusOnPress={true}
                showGradient={true}
                gradientCenterColor={"lightgoldenrodyellow"}
                textStyle={{ fontWeight: "bold" }}
                textBackgroundColor={"transparent"}
                innerRadius={40}
                innerCircleColor={"white"}
                innerCircleBorderColor={"white"}
                innerCircleBorderWidth={3}
                onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
              />
              <Text style={styles.countText}>
                Total: {getNonEmergencyPatientsCount()}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Image source={Nurse_Home} style={styles.rightImage} />
            </View>
            <View style={{ flex: 3, marginHorizontal: 30, marginBottom: 20 }}>
              <Calendar
                events={nurseSched}
                height={200}
                hourRowHeight={35}
                style={{ borderWidth: 1, borderColor: "teal" }}
                eventCellStyle={{ backgroundColor: "teal" }} // Set teal color for event boxes
                eventInnerStyle={{ padding: 2 }} // Adjust padding inside event boxes
                //dayHeaderStyle={{ backgroundColor: 'lightcyan'}}
                //rowHeight={40} // Set the height of each row
                cellHeight={10} // Set the height between every hour
                scrollToOverflowEnabled={true}
              />
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
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  formContainer: {
    // flex: 1, Remove this line to allow ScrollView to take up the entire space
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "lightcyan",
    marginBottom: 20,
    fontSize: 14,
  },
  detailHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 20,
    color: "crimson",
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 5,
    width: 100,
    fontSize: 14,
    color: "lavenderblush",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "lavenderblush",
  },
  scheduleContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  scheduleHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
  },
  nurseImage: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "white",
  },
  scheduleLabels: {
    marginTop: 10,
    textAlign: "center",
  },
  // Style for table header (head)
  head: {
    height: 40,
    backgroundColor: "#b2f5ea",
    justifyContent: "center", // Center align the content vertically
    flexDirection: "row", // Make the content of the header row aligned horizontally
  },
  // Style for table cell text (text)
  text: {
    margin: 6,
    fontWeight: "bold", // Make the text bold
    textAlign: "center", // Center align the text
    padding: 10, // Add padding here
  },

  row: {
    justifyContent: "center",
    alignContent: "center",
  },
  barChart: {
    height: 200,
    marginTop: 20, // Adjust as needed to create space between the table and the bar chart
  },
  rightImage: {
    marginLeft: 10,
    width: 240,
    height: 450,
    resizeMode: "cover",
    borderRadius: 50,
    marginTop: 20,
    marginRight: 20,
  },
  pieChartsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 25,
    marginTop: 0,
  },
  pieChartItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pieLegend: {
    flexDirection: "column",
  },
  colorKeyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  colorKeyText: {
    padding: 5,
    borderRadius: 5,
    color: "teal",
    fontWeight: "bold",
  },

  tableContainer: {
    flex: 1,
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    marginTop: -10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    color: "teal",
    backgroundColor: "#b2f5ea", // Change to light teal color
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  headerText: {
    flex: 1,
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    fontSize: 14, // Smaller font size
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    alignItems: "center",
    fontSize: 12, // Smaller font size
    textAlign: "center", // Center align the text horizontally
  },
  tableName: {
    fontSize: 16, // Smaller font size
    fontWeight: "bold",
    marginBottom: 10, // Added margin bottom
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  paginationText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "teal",
  },
  countButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  countButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  legendWrapper: {
    //position: 'absolute',
    // top: 10,
    // right: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#fff",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //marginBottom: 5,
    marginHorizontal: 50,
    marginRight: 0,
  },
  legendColorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 11,
  },
  legendBox: {
    width: 30,
    height: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  legendBoxText: {
    color: "white",
    fontWeight: "bold",
  },
  countText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10, // Add some left margin for spacing
    color: "teal", // Change the text color to teal
  },
});
