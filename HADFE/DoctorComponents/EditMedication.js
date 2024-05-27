import React, { useState, useEffect } from "react";
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSideBar";
import { API_BASE_URL } from "../config";
import { FontAwesome } from "@expo/vector-icons";
import { useEmail } from "../Context/EmailContext";

const validateInputs = (medication) => {
  if (!medication.medicineName.trim()) {
    Alert.alert("Medicine Name is required.");
    return false;
  }
  // Ensure medicine name includes at least one alphabet character
  if (!/[a-zA-Z]/.test(medication.medicineName)) {
    Alert.alert("Medicine Name should be a string and include alphabetic characters.");
    return false;
  }

  const dosageRegex = /^\d+\s(mg|mcg|ml)$/;
  if (!medication.dosage.trim()) {
    Alert.alert("Dosage is required.");
    return false;
  }
  if (!dosageRegex.test(medication.dosage.trim())) {
    Alert.alert("Dosage should be in the format: [number] [unit] (e.g., 10 mg).");
    return false;
  }

  if (!medication.frequency.trim()) {
    Alert.alert("Frequency is required.");
    return false;
  }
  // Example of how frequencyRegex should be defined, if not already
  const frequencyRegex = /^\d+\s(times|time)$/;
  if (!frequencyRegex.test(medication.frequency.trim())) {
    Alert.alert(
      "Frequency should be in the format: [number] times/time (e.g., 3 times)."
    );
    return false;
  }

  const durationRegex = /^\d+\s(day|week|month|year|days|weeks|months|years)$/;
  if (!medication.duration.trim()) {
    Alert.alert("Duration is required.");
    return false;
  }
  if (!durationRegex.test(medication.duration.trim())) {
    Alert.alert(
      "Duration should be in the format: [number] [period] (e.g., 10 days, 3 weeks, 1 month, 2 years)."
    );
    return false;
  }

  if (medication.specialInstructions !== null && /^[0-9]+$/.test(medication.specialInstructions)) {
    Alert.alert("Special Instructions should contain more than just numbers.");
    return false;
  }

  return true;
};

export default function EditMedication({ navigation, route }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const patientId = route.params.patientId;
  const medicineId = route.params.medicationId;
  const [medication, setMedication] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    specialInstructions: "",
  });

  useEffect(() => {
    fetchMedicationDetails();
  }, []);

  const fetchMedicationDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/doctor/getMedication/${patientId}/${medicineId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedMedication = response.data;
      setMedication({
        medicineName: fetchedMedication.medicineName,
        dosage: fetchedMedication.dosage,
        frequency: fetchedMedication.frequency,
        duration: fetchedMedication.duration,
        specialInstructions: fetchedMedication.specialInstructions,
      });
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
        console.error("Error fetching medication details:", error);
      }
    }
  };

  const handleChange = (key, value) => {
    setMedication({ ...medication, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!validateInputs(medication)) {
        return;
      }
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/doctor/editMedication/${patientId}/${medicineId}`,
        {
          ...medication,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Medication Updated successfully");
      route.params.onView();
      navigation.goBack();
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
        console.error("Error updating medication:", error);
      }
    }
  };
  const SemicircleBackground = ({ children, style }) => {
    return <View style={[styles.background, style]}>{children}</View>;
  };

  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );
  
  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/736x/93/9d/ca/939dca745f61a98f38f240ced8583f3a.jpg",
        }}
        style={styles.content}
      >
        {isSidebarOpen && (
          <DoctorSidebar
            navigation={navigation}
            activeRoute="DoctorPatientDetails"
          />
        )}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.formcontent}>
            <Text style={styles.heading}>Edit Medication</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Medication Name:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("medicineName", text)}
                    value={medication.medicineName}
                    placeholder="Medication Name"
                  />
                  {medication.medicineName !== "" &&
                    !/^[a-zA-Z0-9\s]+$/.test(medication.medicineName) &&
                    renderErrorMessage(
                      "Medicine name must contain only alphabets and spaces."
                    )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Frequency:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("frequency", text)}
                    value={medication.frequency}
                    placeholder="Frequency"
                  />
                  {medication.frequency !== "" &&
                    !/^\d+\s(times|time)$/.test(medication.frequency) &&
                    renderErrorMessage(
                      "Frequency should be in the format: [number] times (e.g., 3 times)."
                    )}
                </View>
              </View>
              <View style={styles.inputColumn}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Dosage:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("dosage", text)}
                    value={medication.dosage}
                    placeholder="Dosage"
                  />
                  {medication.dosage !== "" &&
                    !/^\d+\s(mg|mcg|ml)$/.test(medication.dosage) &&
                    renderErrorMessage(
                      "Dosage should be in the format: [number] mg (e.g., 10 mg)."
                    )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duration:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("duration", text)}
                    value={medication.duration}
                    placeholder="Duration"
                  />
                  {medication.duration !== "" &&
                    !/^\d+\s(day|week|month|year|days|weeks|months|years)$/.test(medication.duration) &&
                    renderErrorMessage(
                      "Duration should be in the format: [number] days/weeks/months/years (e.g., 10 days, 3 weeks, 1 month, 2 years)."
                    )}
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Special Instructions:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  handleChange("specialInstructions", text)
                }
                value={medication.specialInstructions}
                placeholder="Special Instructions"
                multiline={true}
                numberOfLines={4}
              />
              {medication.specialInstructions !== "" &&
                /^[0-9]+$/.test(medication.specialInstructions) &&
                renderErrorMessage("Special instruction should be a string")}
            </View>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <SemicircleBackground style={styles.lbackground}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DoctorPatientDashboard", { patientId })
                }
              >
                <View style={styles.lfooterIconContainer}>
                  <FontAwesome name="arrow-left" size={24} color="teal" />
                </View>
                <Text style={styles.footerText1}>Back</Text>
              </TouchableOpacity>
            </SemicircleBackground>

            <SemicircleBackground style={styles.rbackground}>
              <TouchableOpacity
                onPress={() => {
                  route.params.onView();
                  navigation.goBack();
                }}
              >
                <View style={styles.rfooterIconContainer}>
                  <FontAwesome name="eye" size={24} color="teal" />
                </View>
                <Text style={styles.footerText2}>View</Text>
              </TouchableOpacity>
            </SemicircleBackground>
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
    flexDirection: "row",
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -10,
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    height: 50,
    width: 400,
  },
  submitButton: {
    backgroundColor: "teal",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 50,
    margin: "auto",
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  formcontent: {
    alignItems: "center",
  },
  footerText1: {
    textAlign: "left",
    marginTop: 10,
    color: "teal",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footerText2: {
    textAlign: "right",
    marginTop: 10,
    color: "teal",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputColumn: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 25,
    marginRight: 10,
  },
  italicText: {
    fontStyle: "italic",
  },
  redStar: {
    color: "red",
  },
  lfooterIconContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: 5, // Adjust this margin as needed
  },
  rfooterIconContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 5, // Adjust this margin as needed
  },
  lbackground: {
    backgroundColor: "cornsilk",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 500,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  rbackground: {
    backgroundColor: "cornsilk",
    borderTopLeftRadius: 500,
    borderTopRightRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 0,
  },
});
