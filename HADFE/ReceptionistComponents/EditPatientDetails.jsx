import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,TextInput, View, ScrollView, TouchableOpacity, Alert, ImageBackground,Image, FlatList  } from 'react-native';
// import CheckBox from "@react-native-community/checkbox";
import CheckBox from "expo-checkbox";
import axios from "axios";
import ReceptionistHeader from "./ReceptionistHeader";
import ReceptionistSidebar from "./Sidebar";
import SelectDropdown from "react-native-select-dropdown";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { useEmail } from "../Context/EmailContext";
import BG_Appointment from "../Receptionist_Comp_Images/BG_Appointment.jpg";

export default function EditPatientDetails({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { email } = useEmail();
  const [appointmentInfo, setAppointmentInfo] = useState({
    patientId: "",
  });
  const [fetchedData, setFetchedData] = useState();
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    department: "OP",
  });

  const clearFields = () => {
    setPatientInfo({
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      department: "OP",
    });
  };
  // Regular expressions for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const ageRegex = /^\d+$/;
  const contactRegex = /^\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateFields = () => {
    if (!appointmentInfo.patientId.trim()) {
      Alert.alert("Patient ID Required", "Please enter patient's ID.");
      return false;
    }
    if (!patientInfo.name.trim()) {
      Alert.alert("Name Required", "Please enter patient's name.");
      return false;
    }
    if (!nameRegex.test(patientInfo.name.trim())) {
      Alert.alert("Invalid Name", "Please enter a valid name.");
      return false;
    }
    if (!ageRegex.test(patientInfo.age.trim())) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return false;
    }
    if (!patientInfo.contact.trim()) {
      Alert.alert("Contact Required", "Please enter patient's contact number.");
      return false;
    }
    if (!contactRegex.test(patientInfo.contact.trim())) {
      Alert.alert("Invalid Contact", "Please enter a valid contact number.");
      return false;
    }
    // Validate gender selection
    if (!patientInfo.gender) {
      Alert.alert("Gender Required", "Please select patient's gender.");
      return false;
    }
    // Validate email if entered
    if (
      patientInfo.email.trim() &&
      !emailRegex.test(patientInfo.email.trim())
    ) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return false;
    }
    return true;
  };

  const fetchConsentToken = async (patientId) => {
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

  const fetchAppointments = async (patientId,consentToken) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getAllAppointments/${patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
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
      console.error("Error fetching appointments:", error);
    }}
  };



  const fetchPatientDetails = async () => {
    try {
      const consentToken = await fetchConsentToken(appointmentInfo.patientId);
      if (!consentToken) {
        console.error("No consent token retrieved");
        return;
      }
      const token = await AsyncStorage.getItem("token"); // Retrieve the token

      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getPatientDetails/${appointmentInfo.patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.patientName === undefined) {
        clearFields();
      } else {
        setFetchedData(response.data);
        const data = {
          name: response.data?.patientName,
          age: "" + response.data?.age,
          gender: response.data?.sex,
          contact: response.data?.contact,
          email: response.data?.email,
          department: "OP",
        };
        setPatientInfo(data);
      }
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
        console.log(error);
      }
    }
  };

  const handleChangePatient = (key, value) => {
    setPatientInfo({ ...patientInfo, [key]: value });
  };

  const handleChangeAppointment = (key, value) => {
    setAppointmentInfo({ ...appointmentInfo, [key]: value });
  };

  const handleSearchPatient = async () => {
    fetchPatientDetails();
  };

  const handleDeletePatient = async () => {
    const consentToken = await fetchConsentToken(appointmentInfo.patientId);
    const appointments = await fetchAppointments(appointmentInfo.patientId,consentToken);
    if (appointments.length) {
      Alert.alert("Can't Delete", "Can't delete patient who is currently admitted.");
    }
    else{
      try {
        const token = await AsyncStorage.getItem("token"); // Retrieve the token
  
        await axios.put(
          `${API_BASE_URL}/receptionist/deletePatientPII/${appointmentInfo.patientId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Patient details deleted successfully");
        setAppointmentInfo({
          patientId: "",
        });
        clearFields();
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
          console.error("Error deleting patient details:", error);
        }
      }

    }
    
  };

  const handleDeleteMedicalData = async () => {
    const consentToken = await fetchConsentToken(appointmentInfo.patientId);
    const appointments = await fetchAppointments(appointmentInfo.patientId,consentToken);
    console.log(appointments);
    if (appointments.length) {
      Alert.alert("Can't Delete", "Can't delete patient who is currently admitted.");
    }
    else{
      try {
        const token = await AsyncStorage.getItem("token"); // Retrieve the token
    
        const response = await fetch(
          `${API_BASE_URL}/receptionist/deletePatientRecords/${appointmentInfo.patientId}`, 
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        Alert.alert("Patient details deleted successfully");
        setAppointmentInfo({
          patientId: "",
        });
        clearFields();
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
          console.error("Error deleting patient details:", error);
        }
      }

    }
    
  };
  

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the token

      const bodyData = {
        //...fetchedData,
        patientName: patientInfo.name,
        age: patientInfo.age,
        sex: patientInfo.gender,
        contact: patientInfo.contact,
        email: patientInfo.email,
        department: patientInfo.department,
      };

      if (!validateFields()) {
        return;
      }

      await axios.put(
        `${API_BASE_URL}/receptionist/updatePatient/${appointmentInfo.patientId}`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Patient details updated successfully");
      setAppointmentInfo({
        patientId: "",
      });
      clearFields();
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
        console.error("Error updating patient details:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <ReceptionistHeader /> */}
      {/* <ReceptionistSidebar navigation={navigation} /> */}
      <ReceptionistHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_Appointment} style={styles.content}>

      
        {isSidebarOpen && (
          <ReceptionistSidebar
            navigation={navigation}
            //receptionistId={receptionistId}
            email={email}
            isSidebarOpen={isSidebarOpen}
            activeRoute="EditPatientDetails"
          />
        )}

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>Update Patient</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient ID:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                handleChangeAppointment("patientId", text)
              }
              value={appointmentInfo.patientId}
              placeholder="Enter patient's ID"
            />
            <TouchableOpacity onPress={handleSearchPatient} style={styles.SearchButton}>
                <Text style={styles.submitButtonText}>Search</Text>
              </TouchableOpacity>
          </View>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("name", text)}
                value={patientInfo.name}
                placeholder="Patient's Name"
              />
            </View>
          </>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Contact:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("contact", text)}
                value={patientInfo.contact}
                placeholder="Patient's contact"
              />
            </View>
          </>
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient email:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("email", text)}
                value={patientInfo.email}
                placeholder="Patient's email"
              />
            </View>
          </>

          <>
           <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Gender:</Text>
              <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={patientInfo.gender}
                onValueChange={(itemValue, itemIndex) =>
                  handleChangePatient("gender", itemValue)
                }
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            </View>
          </>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient age:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("age", text)}
                value={patientInfo.age}
                placeholder="Patient's age"
              />
            </View>
          </>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={styles.deleteContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePatient}
          >
            <Text style={styles.deleteButtonText}>Delete Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteMedicalData}
          >
            <Text style={styles.deleteButtonText}>Delete Medical data</Text>
          </TouchableOpacity>
          </View>

        </ScrollView>
      
    </ImageBackground>
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
    flexDirection:'column',
    alignItems:'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -10,
    marginBottom: 20,
    textAlign: 'center',
    color: 'teal',
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "column",
    //alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'teal',
  },
  input: {
    height: 50,
    width: 400,
    borderColor: 'teal',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'lightgoldenrodyellow',
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    height: 50,
    width: 400,
  },
  SearchButton: {
    marginTop: 10,
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    width: 100,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: "tomato",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    height: 50,
    width: 300,
    marginHorizontal: 20,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  pickerContainer: {
    borderColor: 'teal',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: 400,
    overflow: 'hidden', 
  },
  picker: {
    height: 50,
    backgroundColor: 'lightgoldenrodyellow',
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
  },
  deleteContainer:{
    flexDirection:'row',
    marginTop: 15,
  }
});
