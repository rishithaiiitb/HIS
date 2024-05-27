import React, { useState } from "react";
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
import { useEmail } from "../Context/EmailContext";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { API_BASE_URL } from "../config";
import { FontAwesome } from "@expo/vector-icons";
import BG_Symptoms from "../Nurse_Comp_Images/BG_Symptoms.jpg";

export default function AddSymptoms({ navigation, route }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [symptoms, setSymptoms] = useState({
    symptom1: "",
    symptom2: "",
    symptom3: "",
    symptom4: "",
    symptom5: "",
  });
  const patientId = route.params.patientId;

  const handleChange = (key, value) => {
    setSymptoms({ ...symptoms, [key]: value });
  };

  const SemicircleBackground = ({ children, style }) => {
    return <View style={[styles.background, style]}>{children}</View>;
  };

  const handleSubmit = async () => {
    try {
      if (!validateInputs()) {
        return;
      }
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/nurse/addSymptoms/${patientId}`,
        symptoms,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Symptoms added successfully:", response.data);

      setSymptoms({
        symptom1: "",
        symptom2: "",
        symptom3: "",
        symptom4: "",
        symptom5: "",
      });
      Alert.alert("Symptoms added successfully");
      navigation.navigate("viewSymptoms", { patientId });
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
        console.error("Error adding Symptoms:", error);
      }
    }
  };

  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );

  const validateInputs = () => {
    if (symptoms.symptom1.trim() !== "" && !isValidText(symptoms.symptom1)) {
      console.error("Invalid text for Symptom 1");
      return false;
    }

    if (symptoms.symptom2.trim() !== "" && !isValidText(symptoms.symptom2)) {
      console.error("Invalid text for Symptom 2");
      return false;
    }

    if (symptoms.symptom3.trim() !== "" && !isValidText(symptoms.symptom3)) {
      console.error("Invalid text for Symptom 3");
      return false;
    }

    if (symptoms.symptom4.trim() !== "" && !isValidText(symptoms.symptom4)) {
      console.error("Invalid text for Symptom 4");
      return false;
    }

    if (symptoms.symptom5.trim() !== "" && !isValidText(symptoms.symptom5)) {
      console.error("Invalid text for Symptom 5");
      return false;
    }

    return true;
  };

  const isValidText = (text) => {
    const regex = /^[a-zA-Z\s]*$/;

    return regex.test(text);
  };

  return (
    <View style={styles.container}>
      <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_Symptoms} style={styles.content}>
        {isSidebarOpen && (
          <NurseSidebar
            navigation={navigation}
            email={email}
            activeRoute="NursePatient_Details"
          />
        )}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.formcontent}>
            <Text style={styles.heading}>
              Symptoms Matter: Add Your Patient's Signals!
            </Text>
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Symptom 1:<Text style={styles.redStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("symptom1", text)}
                    value={symptoms.symptom1}
                    placeholder="First Symptom"
                    multiline={true} // Enable multiline
                    numberOfLines={4} // Set the number of lines to show initially (optional)
                  />
                </View>
                {symptoms.symptom1 !== "" &&
                  !/^[a-zA-Z\s]+$/.test(symptoms.symptom1) &&
                  renderErrorMessage(
                    "Symptom 1 must contain only alphabets and spaces."
                  )}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Symptom 3:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("symptom3", text)}
                    value={symptoms.symptom3}
                    placeholder="Third Symptom"
                    multiline={true} // Enable multiline
                    numberOfLines={4}
                  />
                </View>
                {symptoms.symptom3 !== "" &&
                  !/^[a-zA-Z\s]+$/.test(symptoms.symptom3) &&
                  renderErrorMessage(
                    "Symptom 3 must contain only alphabets and spaces."
                  )}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Symptom 5:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("symptom5", text)}
                    value={symptoms.symptom5}
                    placeholder="Fifth Symptom"
                    multiline={true} // Enable multiline
                    numberOfLines={4}
                  />
                </View>
                {symptoms.symptom5 !== "" &&
                  !/^[a-zA-Z\s]+$/.test(symptoms.symptom5) &&
                  renderErrorMessage(
                    "Symptom 5 must contain only alphabets and spaces."
                  )}
              </View>
              <View style={styles.inputColumn}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Symptom 2:<Text style={styles.redStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("symptom2", text)}
                    value={symptoms.symptom2}
                    placeholder="Second Symptom"
                    multiline={true} // Enable multiline
                    numberOfLines={4}
                  />
                </View>
                {symptoms.symptom2 !== "" &&
                  !/^[a-zA-Z\s]+$/.test(symptoms.symptom2) &&
                  renderErrorMessage(
                    "Symptom 2 must contain only alphabets and spaces."
                  )}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Symptom 4:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("symptom4", text)}
                    value={symptoms.symptom4}
                    placeholder="Fourth Symptom"
                    multiline={true} // Enable multiline
                    numberOfLines={4}
                  />
                </View>
                {symptoms.symptom4 !== "" &&
                  !/^[a-zA-Z\s]+$/.test(symptoms.symptom4) &&
                  renderErrorMessage(
                    "Symptom 4 must contain only alphabets and spaces."
                  )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            {/* Back button */}
            <SemicircleBackground style={styles.lbackground}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("NursePatient_Dashboard", { patientId })
                }
                style={styles.footerItem}
              >
                <View style={styles.lfooterIconContainer}>
                  <FontAwesome name="arrow-left" size={24} color="teal" />
                </View>
                <Text style={styles.footerText1}>Back</Text>
              </TouchableOpacity>
            </SemicircleBackground>

            {/* View button */}
            {/* <SemicircleBackground style={styles.rbackground}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("viewSymptoms", { patientId })
                }
                style={styles.footerItem}
              >
                <View style={styles.rfooterIconContainer}>
                  <FontAwesome name="eye" size={24} color="teal" />
                </View>
                <Text style={styles.footerText2}>View</Text>
              </TouchableOpacity>
            </SemicircleBackground> */}
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
    //alignItems: 'center',
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
    // marginTop: 10,
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
