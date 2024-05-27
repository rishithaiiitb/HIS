import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { API_BASE_URL } from "../config";

const AddSpecialization = ({ navigation }) => {
  const [specializations, setSpecializations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newSpecialization, setNewSpecialization] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_BASE_URL}/admin/getAllSpecializationDetails`,
        { headers }
      );
      if (response.status === 200) {
        const specializationDetails = response.data;
        setSpecializations(specializationDetails);
      } else {
        Alert.alert("Failed to fetch specializations.");
        throw new Error("Failed to fetch specializations.");
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
        console.error("Failed to fetch specializations:", error);
        setError("Failed to fetch specializations. Please try again.");
      }
    }
  };

  const handleAddSpecialization = async () => {
    const regex = /^[a-zA-Z\s]+$/;

    if (!newSpecialization.trim() || !regex.test(newSpecialization)) {
      Alert.alert("Error", "Please enter a valid specialization.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${API_BASE_URL}/admin/addSpecialization`,
        { specializationName: newSpecialization },
        { headers }
      );

      if (response.status === 200) {
        const data = response.data.specializationName;
        Alert.alert("Success", `Specialization ${data} added successfully!`);
        setNewSpecialization("");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add specialization. Please try again.");
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
        console.error("Error adding specialization:", error);
        Alert.alert("Error", "Failed to add specialization. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <AdminHeader
        onPressMenu={toggleSidebar}
        showBackButton={true}
        backButtonDestination="AdminHome"
      />
      <ImageBackground source={{uri: "https://careermantra.org/front_assets/images/mba-in-healthcare-management1.jpg"}} style={styles.content}>
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="ViewSpecialization" />
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Add Specialization</Text>
          <TextInput
            value={newSpecialization}
            onChangeText={(value) => setNewSpecialization(value)}
            placeholder="Enter specialization"
            style={styles.input}
          />
          {newSpecialization !== "" &&
            !/^[a-zA-Z\s]+$/.test(newSpecialization) &&
            renderErrorMessage(
              "Specialisation must contain only alphabets and spaces."
            )}
          <TouchableOpacity onPress={handleAddSpecialization} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -10,
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "teal",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'lightgoldenrodyellow',
    borderRadius: 5,
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    height: 50,
    width: 200, // Adjust width as needed
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold", // If you want the text to be bold
  },
});

export default AddSpecialization;
