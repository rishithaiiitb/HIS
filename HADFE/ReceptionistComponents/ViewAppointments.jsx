import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import ReceptionistHeader from "./ReceptionistHeader";
import ReceptionistSidebar from "./Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { useEmail } from "../Context/EmailContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function ViewAppointments({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { email } = useEmail();
  const [appointmentInfo, setAppointmentInfo] = useState({
    patientId: "",
  });
  const [appointments, setAppointments] = useState([]);
  

  const fetchConsentToken = async (patientId) => {
    console.log(patientId);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token available");
      }
      const consentresponse = await fetch(
        `${API_BASE_URL}/receptionist/getConsentToken/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!consentresponse.ok) {
        throw new Error(
          `Failed to fetch the consent token. Status: ${consentresponse.status}`
        );
      }
      return await consentresponse.text();
    } catch (error) {
      console.error("Error fetching consent details:", error);
      return null;
    }
  };


  const fetchAppointments = async (patientId) => {
    try {
      const consentToken = await fetchConsentToken(patientId);
      if (!consentToken) {
        console.error("No consent token retrieved");
        return;
      }
      const token = await AsyncStorage.getItem("token"); 

      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getAllAppointments/${patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response);

        const formattedAppointments = response.data.map((appointment) => ({
        did: appointment.doctorId,
        dname: appointment.name,
      }));

      setAppointments(formattedAppointments);
      //setAppointments(response.data); 
      
    } catch (error) {
        console.error("Error fetching appointments:", error);
    
        if (error.message === "No consent token retrieved") {
          Alert.alert("Error", "Failed to retrieve consent details. Please ensure you are logged in.");
        } else if (error.response && error.response.status === 401) {
          Alert.alert(
            "Error",
            "Unauthorized access. Please log in again.",
            [
              {
                text: "OK",
                onPress: () => {
                  AsyncStorage.removeItem("token");
                  navigation.navigate("ReceptionistHome");
                },
              },
            ],
            { cancelable: false }
          );
        } else if (error.response && error.response.status === 404) {
          Alert.alert("Error", "Appointments not found for the specified patient.");
        } else if (error.response && error.response.status === 500) {
          Alert.alert("Error", "Server error. Please try again later.");
        } else {
          Alert.alert("Error", "An unexpected error occurred. Please try again later.");
        }
      }
    };

  const handleDeleteAppointment = async (doctorId) => { 
    try {
      const token = await AsyncStorage.getItem("token"); 

      await axios.put(
        `${API_BASE_URL}/receptionist/deleteAppointment/${appointmentInfo.patientId}/${doctorId}`, // Use doctorId in the endpoint
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Appointment deleted successfully");
     
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
                navigation.navigate("ReceptionistHome");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error("Error deleting patient appointment:", error);
      }
    }
  };

  

  return (
    <View style={styles.container}>
      {/* <ReceptionistHeader /> */}
      {/* <ReceptionistSidebar navigation={navigation} /> */}
      <ReceptionistHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />

      <View style={styles.content}>
        {isSidebarOpen && (
          <ReceptionistSidebar
            navigation={navigation}
            //receptionistId={receptionistId}
            email={email}
            isSidebarOpen={isSidebarOpen}            
            activeRoute="ViewAppointments"
          />
        )}

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>View Appointment</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient ID:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setAppointmentInfo({ ...appointmentInfo, patientId: text })}
              value={appointmentInfo.patientId}
              placeholder="Enter patient's ID"
            />
            <TouchableOpacity onPress={() => fetchAppointments(appointmentInfo.patientId)}>
            <Text>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Display appointments */}
          {appointments.map((appointment, index) => (
          <View key={index} style={styles.appointmentContainer}>
            <View>
              <Text>Doctor ID: {appointment.did}</Text>
              <Text>Doctor Name: {appointment.dname}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteAppointment(appointment.did)}
              style={styles.deleteButton}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
            </View>
          ))}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    //width: "50vw",
    //justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row",
  },
  formContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  deleteButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
