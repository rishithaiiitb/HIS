import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import CheckBox from "expo-checkbox";
import axios from "axios";
import ReceptionistHeader from "./ReceptionistHeader";
import ReceptionistSidebar from "./Sidebar";
import SelectDropdown from "react-native-select-dropdown";
import { Picker } from "@react-native-picker/picker";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import { useEmail } from "../Context/EmailContext";
import { useNavigation } from '@react-navigation/native';
import BG_Appointment from "../Receptionist_Comp_Images/BG_Appointment.jpg";

export default function Appointment({ navigation,route }) {
  const isOTPVerified = route.params.isOTPVerified;
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointmentInfo, setAppointmentInfo] = useState({
    patientId: "",
    doctorId: "",
    isEmergency: false,
    //isNewPatient: false,
    category: "",
    otpVerified: isOTPVerified,
  });


  useEffect(() => {
    // Check if isOTPVerified is true
    if (isOTPVerified) {
      setAppointmentInfo({ ...appointmentInfo, otpVerified: isOTPVerified  })
      setCheckboxValue(true);
      setSubmitButtonDisabled(false);
    }
  }, [isOTPVerified]);

  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
  });

  const clearFields = () => {
    setPatientInfo({
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      category: "",
      doctor: ""
    });
  }


  // options for dropdown
  const [category, setCategory] = useState("");
  //const [doctorID, setDoctorID] = useState([]);
  const [doctors, setDoctors] = useState([]); // State to store doctor IDs and names
  const [isNewPatient, setIsNewPatient] = useState(false);

  const navigateToTerms = () => {
    navigation.navigate("TermsAndConditions");
  };

  // const handleOTPVerified = (verified) => {
  //   setAppointmentInfo({ ...appointmentInfo, otpVerified: verified });
  //   if (verified) {
  //     //navigation.goBack();
  //     // Callback function to tick the checkbox upon OTP verification
  //     setIsOTPVerified(true);
  //   }
  // };
  const handleOTPCheckboxChange = () => {
    if (!isOTPVerified) {
    navigation.navigate("OTPVerification", {
      phoneNumber: patientInfo.contact,
      //otpVerified: appointmentInfo.otpVerified, // Pass callback function
    });
    }
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
      const appointments =fetchAppointments(appointmentInfo.patientId,consentToken);
      if (!consentToken) {
        console.error("No consent token retrieved");
        return;
      }
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getPatientDetails/${appointmentInfo.patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.patientName === undefined) {
        clearFields();
      } else {
        const data = {
          name: response.data?.patientName,
          // convert age from number to string value
          age: "" + response.data?.age,
          gender: response.data?.sex,
          contact: response.data?.contact,
          email: response.data?.email,
        };
        setPatientInfo(data);
      }
    } catch (error) {
      if(error.response && error.response.status===500)
      {
        Alert.alert(
          'Error',
          'Session Expired!! Please Log in again',
          [
            { text: 'OK', onPress: () => {
              AsyncStorage.removeItem('token');
              navigation.navigate("HomePage")} }
          ],
          { cancelable: false }
        );
      }else{
      console.log(error);
    }}
  };
  

  const handleChangeAppointment = (key, value) => {
    setAppointmentInfo({ ...appointmentInfo, [key]: value });
  };

  const handleChangePatient = (key, value) => {
    setPatientInfo({ ...patientInfo, [key]: value });
  };

  const handleSearchPatient = async () => {
    fetchPatientDetails();
  };

  
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); 

      await axios
        .get(`${API_BASE_URL}/receptionist/getAllSpecializations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setCategory(res.data))
        await axios
        .get(`${API_BASE_URL}/receptionist/getAllSpecializations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setCategory(res.data))
        .catch((err) => {

          if(err.response && err.response.status===500)
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
        }
          console.log(err)});
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
      console.log(error);
    }}
  };

  


  const fetchDoctors = async (category) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getOutdoorDoctorsBySpecialization/${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const doctorData = response.data.doctors;
      const temp = [];

      if (doctorData.length === 0) {
        Alert.alert(
          "No Doctors Available at this moment for selected Specialization",  // Title of the alert
          "Please try again later", // Message of the alert
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }  // Button and its handler
          ]
        );
      } else {
        doctorData.forEach((doctor) => {
          const doctorObj = {
            id: doctor.doctorId,
            name: doctor.name,
          };
          temp.push(doctorObj);
        });
      }
  
      setDoctors(temp);
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
      console.error("Error fetching doctors:", error);
    }}
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const handleSubmitAppointment = async () => {
        // Check if OTP is verified before booking appointment
        if (!appointmentInfo.otpVerified) {
          Alert.alert("OTP Verification Required", "Please verify OTP before booking appointment.");
          return;
        }

    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      // Validate compulsory fields if isEmergency is false
      if (!appointmentInfo.isEmergency) {
        if (patientInfo.name.trim() === "") {
          Alert.alert("Name Required", "Please enter patient's name.");
          return;
        }
        if (patientInfo.age.trim() === "") {
          Alert.alert("Age Required", "Please enter patient's age.");
          return;
        }
        if (patientInfo.contact.trim() === "") {
          Alert.alert("Contact Required", "Please enter patient's contact number.");
          return;
          
        }
      }

      // Validate if category is selected
      if (appointmentInfo.category === "") {
        Alert.alert("Category Required", "Please select a category.");
        return;
      }

      // Validate if doctor is selected
      if (appointmentInfo.doctorId === "") {
        Alert.alert("Doctor Required", "Please select a doctor.");
        return;
      }

      
  
    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\-\'\s]+$/;
    const ageRegex = /^\d+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactRegex =/^\d{10}$/;
  
    // Validate patient info fields
    if (patientInfo.name && !nameRegex.test(patientInfo.name.trim())) {
      Alert.alert("Invalid Name", "Please enter a valid name.");
      return;
    }
    if (patientInfo.contact && !contactRegex.test(patientInfo.contact.trim())) {
      Alert.alert("Invalid contact", "Please enter a valid contact number.");
      return;
    }
    if (patientInfo.age && !ageRegex.test(patientInfo.age.trim())) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return;
    }
    if (patientInfo.email && patientInfo.email.trim() !== "" && !emailRegex.test(patientInfo.email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return;
    }
  
    const bodyData = {
      name: patientInfo.name,
      age: patientInfo.age,
      sex: patientInfo.gender,
      contact: patientInfo.contact,
      email: patientInfo.email,
      category: appointmentInfo.category,
      emergency: appointmentInfo.isEmergency,
      doctorId: appointmentInfo.doctorId,
    };
    if (isNewPatient) {
      await axios
        .post(
          `${API_BASE_URL}/receptionist/bookAppointmentForNewPatient/${email}`,
          bodyData,{
            headers: {
                Authorization: `Bearer ${token}`,
              },
        }
        )
        .then((res) => {
          Alert.alert("Appointment booked sucessfully");
          setAppointmentInfo({
            patientId: "",
            doctorId: "",
            category: "",
            isEmergency: false,
            //isNewPatient: false,
            isOTPVerified: false,
          });
          clearFields();
          setIsNewPatient(false);
          navigation.navigate('ReceptionistHome');
        })
        .catch((err) => {
          if(err.response && err.response.status===500)
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
          
          console.log(err)}});
    } else {
      const consentToken = await fetchConsentToken(appointmentInfo.patientId);
      const appointments = await fetchAppointments(appointmentInfo.patientId, consentToken); // make sure to await this call

      if (appointments.includes(appointmentInfo.doctorId)) {
        Alert.alert("Duplicate Doctor", "This doctor has already been assigned an appointment.");
        return;
      }
      await axios
        .post(
          `${API_BASE_URL}/receptionist/bookAppointmentForExistingPatient/${email}/${appointmentInfo.patientId}`,
          bodyData,{
            headers: {
                Authorization: `Bearer ${token}`,
              },
        }
        )
        .then((res) => {
          Alert.alert("Appointment booked sucessfully");
          setAppointmentInfo({
            patientId: "",
            doctorId: "",
            category: "",
            isEmergency: false,
            //isNewPatient: false,
            isOTPVerified: false,
          });
          clearFields();
          setIsNewPatient(false);
          navigation.navigate('ReceptionistHome');
        })
        .catch((err) => {
       if(err.response && err.response.status===500)
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
          
          console.log(err)}});
    }
  } catch (error) {
    console.error("Error in handling appointment:", error);
  }
};
  

  return (
    <View style={styles.container}>
      {/* <ReceptionistHeader /> */}
      {/* <ReceptionistSidebar navigation={navigation} /> */}
      <ReceptionistHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_Appointment} style={styles.content}>
      <View style={styles.content}>
        {isSidebarOpen && (
          <ReceptionistSidebar
            navigation={navigation}
            email={email}
            isSidebarOpen={isSidebarOpen}
            activeRoute="Appointment"
          />
        )}

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>Book Appointment</Text>
          <>
            <View style={styles.inputContainer}>
            <View style={styles.checkcontainer}>
            
              <Text style={styles.label}>New Patient Appointment:</Text>
              <CheckBox
                containerStyle={styles.checkbox}
                 textStyle={styles.checkboxText}
                 checkedColor='teal'
                disabled={false}
                value={isNewPatient}
                onValueChange={(newValue) => {
                  setIsNewPatient(newValue);
                  clearFields();
                  // Clear and disable Patient ID field when the checkbox is checked
                  if (newValue) {
                    handleChangeAppointment("patientId", ""); // Clear patient ID
                  }
                }}
              />
              </View>
            </View>
          </>
          {!isNewPatient && category.length > 0 && (
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
          )}

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Name:</Text>
              <TextInput
                style={styles.input}
                //editable={!appointmentInfo.isEmergency}
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
               // editable={!appointmentInfo.isEmergency}
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
                //editable={!appointmentInfo.isEmergency}
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
                <Picker.Item key="Select Gender" label="Select Gender" value={null} />
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
                //editable={!appointmentInfo.isEmergency}
                onChangeText={(text) => handleChangePatient("age", text)}
                value={patientInfo.age}
                placeholder="Patient's age"
              />
            </View>
          </>

           
          <>
          {category.length > 0 && (
            <>
              <View style ={styles.categorycontainer}>
              <Text style={styles.label}>Category:</Text>
              <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={appointmentInfo.category}
                onValueChange={async (itemValue, itemIndex) => {
                  try {
                    setDoctors([]); // Clear previous list of doctors
                    setAppointmentInfo({
                      ...appointmentInfo,
                      category: itemValue,
                    });
                    await fetchDoctors(itemValue); // Fetch doctors based on selected category
                  } catch (error) {
                    console.error("Error selecting category:", error);
                  }
                }}>
                <Picker.Item key="Select Category" label="Select Category" value={null} />
                {category.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
              </View>
              </View>
            </>
          )}
          
        </>

        <>
        {doctors.length > 0 && (
  <>
  <View style ={styles.categorycontainer}>
    <Text style={styles.label}>Doctor:</Text>
          <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={appointmentInfo.doctorId}
            onValueChange={(itemValue, itemIndex) => {
              const selectedDoctorObj = doctors.find(
                (doctor) => doctor.id === itemValue // Check doctor.id instead of doctor.name
              );
              if (selectedDoctorObj) {
                setAppointmentInfo({
                  ...appointmentInfo,
                  doctorId: selectedDoctorObj.id,
                });
              }
            }}>
            <Picker.Item key="SelectDoctor" label="Select Doctor" value={null} />
            {doctors.map((doctor) => (
              <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} /> // Use doctor.id as value
            ))}
          </Picker>
          </View>
          </View>
        </>
        )}
            <>
            <View style={styles.inputContainer}>
              <View style={styles.checkcontainer}>
              <Text style={styles.label}>Emergency Appointment:</Text>
              <CheckBox
                containerStyle={styles.checkbox}
                textStyle={styles.checkboxText}
                checkedColor='teal'
                disabled={false}
                value={appointmentInfo.isEmergency}
                onValueChange={(newValue) =>
                  setAppointmentInfo({
                    ...appointmentInfo,
                    isEmergency: newValue,
                    otpVerified: newValue,
                  })
                }
              />
              </View>
            </View>
          </>

        </>


      
        {
          !appointmentInfo.isEmergency && (
            <View style={styles.inputContainer}>
              <View style={styles.termContainer}>
                <View style={styles.checkcontainer}>
                  {/* Optional label for clarity */}
                  {/* <Text style={styles.label}>OTP Verification:</Text> */}
                  <CheckBox
                    containerStyle={styles.checkbox}
                    textStyle={styles.checkboxText}
                    checkedColor='teal'
                    disabled={isOTPVerified}
                    value={checkboxValue} // Ensuring it reacts to internal state changes
                    onValueChange={()=>{
                      if (patientInfo.contact.trim() === '') {
                        Alert.alert("Enter Contact Details", "Please enter contact details to proceed.");
                      } else {
                        handleOTPCheckboxChange();
                      }
                    }}
                  />
                </View>
                <TouchableOpacity  onPress={() => {
            if (patientInfo.contact.trim() === '') {
              Alert.alert("Enter Contact Details", "Please enter contact details to proceed.");
            } else {
              navigateToTerms();
            }
          }}>
                <Text style={[styles.termsText, patientInfo.contact.trim() === '' && styles.disabledText]}>
              I agree to the Terms and Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }


          {appointmentInfo.isEmergency ? (
            <TouchableOpacity

              style={[styles.submitButton,!appointmentInfo.otpVerified && styles.disabledButton]}
              onPress={handleSubmitAppointment}
              disabled={!appointmentInfo.otpVerified}
              //disabled={!appointmentInfo.otpVerified}
            >
              <Text style={styles.submitButtonText}>
                Book Emergency Appointment
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, !appointmentInfo.otpVerified && styles.disabledButton]}
              onPress={handleSubmitAppointment}
              disabled={!appointmentInfo.otpVerified}
              //disabled={!appointmentInfo.otpVerified}
            >
              <Text style={styles.submitButtonText}>
                Book Appointment
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  termsText: {
    textAlign: 'center',
    marginTop: 10,
    marginLeft:20,
    textDecorationLine: 'underline',
    fontSize: 20,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
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
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkcontainer:{
    flexDirection:"row",
    marginTop: 20,
  },
  SearchButton: {
    marginTop: 10,
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    height: 50,
    width: 100,
    alignSelf:"center"
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
  checkbox: {
    backgroundColor: 'lightgoldenrodyellow',
    borderColor: 'teal',
    borderWidth: 1,
    borderRadius: 10,
    width: 180,
  },
  checkboxText: {
    fontSize: 14,
    color: 'black',
  },
  categorycontainer:{
    alignItems: 'flex-start',
  },
  termContainer:{
    flexDirection:"row",
  },
  disabledText: {
    color: 'grey',
  },
  
});