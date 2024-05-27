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
import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSideBar";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const validateInputs = (test) => {
  if (!test.testName.trim()) {
    Alert.alert("Test Name is required.");
    return false;
  }
  if (!isNaN(test.testName) || /^\d+$/.test(test.testName)) {
    Alert.alert(
      "Test Name should contain at least one character and not just numeric."
    );
    return false;
  }
  return true;
};

export default function EditTest({ navigation, route }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const patientId = route.params.patientId;
  const testId = route.params.testId;
  const [test, setTest] = useState({
    testName: "",
  });

  useEffect(() => {
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/doctor/getTest/${patientId}/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedTest = response.data;
      setTest({
        testName: fetchedTest.testName,
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
        console.error("Error fetching test details:", error);
      }
    }
  };

  const handleChange = (key, value) => {
    setTest({ ...test, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!validateInputs(test)) {
        return;
      }
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/doctor/editTest/${patientId}/${testId}`,
        {
          ...test,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Test Updated successfully");
      route.params.onViewTest();
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
        console.error("Error updating test:", error);
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
        <View style={styles.content}>
          {isSidebarOpen && <DoctorSidebar navigation={navigation} activeRoute="DoctorPatientDetails"/>}
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.formcontent}>
              <Text style={styles.heading}>Edit Test</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Test Name:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChange("testName", text)}
                  value={test.testName}
                  placeholder="Test Name"
                />
                {test.testName !== "" &&
                /^\d+$/.test(test.testName) &&
                renderErrorMessage("Special instruction should be a string")}
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerContainer}>
              <SemicircleBackground style={styles.lbackground}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("DoctorPatientDashboard", {
                      patientId: route.params.patientId,
                    })
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
                    route.params.onViewTest();
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
        </View>
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
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    width: 500,
    borderColor: "teal",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightgoldenrodyellow",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "teal",
    paddingVertical: 15,
    borderRadius: 5,
    width: 100,
    marginBottom: 10,
    // marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  formcontent: {
    alignItems: "center",
  },
  footerText1: {
    textAlign: "left",
    color: "teal",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footerText2: {
    textAlign: "right",
    color: "teal",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 350,
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
