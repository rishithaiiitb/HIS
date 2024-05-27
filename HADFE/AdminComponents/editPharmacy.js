import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  ImageBackground
} from "react-native";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import LoadingScreen from "../Loading";

const EditPharmacyScreen = ({ route, navigation }) => {
  const { pharmacyId, onSaveSuccess } = route.params;
  const [pharmacyDetails, setPharmacyDetails] = useState(null);
  const [editedPharmacyDetails, setEditedPharmacyDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );
  const validateName = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(text);
  };

  const validateAge = (text) => {
    const ageNum = parseInt(text);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
  };

  const validateTime = (text) => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(text);
  };

  const validatePhoneNumber = (text) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(text);
  };

  useEffect(() => {
    fetchPharmacyDetails();
  }, []);

  const fetchPharmacyDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/viewPharmacy/${pharmacyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pharmacyData = response.data;
      setPharmacyDetails(pharmacyData);
      setEditedPharmacyDetails({
        name: pharmacyData.name,
        address: pharmacyData.address,
        contact: pharmacyData.contact,
        licenseNumber: pharmacyData.licenseNumber,
        pharmacyId: pharmacyData.pharmacyId,
        Id: pharmacyData.Id,
        active: pharmacyData.active,
        password: pharmacyData.password,
        email: pharmacyData.email,
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
        console.error("Error fetching pharmacy details:", error);
        setError("Failed to fetch pharmacy details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedPharmacyDetails({ ...editedPharmacyDetails, [field]: value });
  };

  const handleSave = async () => {
    const { name, contact, address, licenseNumber, active } =
      editedPharmacyDetails;
    if (!name || !contact || !licenseNumber || !address) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!validateName(name)) {
      Alert.alert("Error", "Name should contain only letters and spaces.");
      return;
    }

    if (!validatePhoneNumber(contact)) {
      Alert.alert(
        "Error",
        "Invalid phone number.Enter a valid phone number of 10 digits"
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const editedFields = {
        name,
        address,
        contact,
        active,
        licenseNumber,
      };
      await axios.put(
        `${API_BASE_URL}/admin/editPharmacy/${pharmacyId}`,
        editedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", "Pharmacy details updated successfully.");
      onSaveSuccess();
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
        console.error("Error updating pharmacy details:", error);
        setError("Failed to update pharmacy details. Please try again.");
        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!editedPharmacyDetails) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
     <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="ViewPharmacies"/>
     <ImageBackground source={{uri: "https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61809.jpg"}} style={styles.content}>
       {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Edit Pharmacies - {pharmacyId}</Text>
        <Text style={styles.slabel}>Name:</Text>
      <TextInput
        value={editedPharmacyDetails.name}
        onChangeText={(value) => handleInputChange('name', value)}
        style={styles.textInput}
        placeholder="Enter Name"
      />
          {editedPharmacyDetails.name !== "" &&
            !/^[a-zA-Z\s]+$/.test(editedPharmacyDetails.name) &&
            renderErrorMessage("Name must contain only alphabets and spaces.")}

<Text style={styles.slabel}>Address</Text>
      <TextInput
        value={editedPharmacyDetails.address}
        onChangeText={(value) => handleInputChange('address', value)}
        style={styles.textInput}
                placeholder="Enter Pharmacy Address"
      />
          {editedPharmacyDetails.address !== "" &&
            !/^[a-zA-Z0-9\s]+$/.test(editedPharmacyDetails.address) &&
            renderErrorMessage(
              "Address must contain only alphabets and spaces."
            )}

<Text style={styles.slabel}>Contact</Text>
      <TextInput
        value={editedPharmacyDetails.contact}
        onChangeText={(value) => handleInputChange('contact', value)}
        style={styles.textInput}
                placeholder="Enter Contact No."
      />
          {editedPharmacyDetails.contact !== "" &&
            !/^[0-9]{10}$/.test(editedPharmacyDetails.contact) &&
            renderErrorMessage("Contact must contain only 10 digit number.")}

<Text style={styles.slabel}>License Number</Text>
      <TextInput
        value={editedPharmacyDetails.licenseNumber}
        onChangeText={(value) => handleInputChange('licenseNumber', value)}
        style={styles.textInput}
        placeholder="Enter License No."
      />
          {editedPharmacyDetails.licenseNumber !== "" &&
            !/^[A-Z][A-Za-z]*\d+[a-z]*$/.test(
              editedPharmacyDetails.licenseNumber
            ) &&
            renderErrorMessage(
              "License number must start with a alphabet and be alphanumeric."
            )}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
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
    backgroundColor: "#fff",
    // alignItems: "center",
    // marginTop: 20,
    // justifyContent: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center', 
    // width: "100%",
    // backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 30,
        fontWeight: 'bold',
        marginTop: -10,
        marginBottom: 20,
        textAlign: 'center',
        color: 'teal',
  },
  textInput:
  {
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
  slabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'teal', // You can change this as needed
  },
  pickerContainer: {
    borderColor: 'teal',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: 400,
    overflow: 'hidden', // This is important to make borderRadius work on Android
  },
  picker: {
    height: 50,
    backgroundColor: 'lightgoldenrodyellow',
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "teal",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 400, // or '100%' if it should be responsive
    marginBottom: 20,
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
  label: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
  },
  button: {
  marginTop: 10,
  backgroundColor: "teal",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  alignItems: "center",
  justifyContent: 'center',
  height: 50,
  width: 400, // Adjust width as needed
},
buttonText: {
  color: "white",
  fontSize: 16,
  fontWeight: 'bold', // If you want the text to be bold
},

  removeButton: {
    backgroundColor: "tomato",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  addPictureButton: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  addPictureButtonText: {
    color: "white",
    fontSize: 16,
  },

  // Style for the "Add" button to remove the picture
  addButtonToRemovePicture: {
    backgroundColor: "tomato",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButtonToRemovePictureText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  startEndTime: {
    flexDirection: 'column',
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between', // Distribute space evenly
    flexWrap: 'wrap', // Allow items to wrap to the next line if space is tight
    marginBottom: 20, // Optional: add some bottom margin
  },
  startEndTimeContainer: {
    flexDirection: 'row', // Align children in a row
    justifyContent: 'space-around', // Space out children evenly
    width: 400, // Take the full width to accommodate both columns
  },
  timeContainer: {
    flex: 1, // Each child (start and end time) takes equal space
    //padding: 10, // Optional: for spacing around the content
  },
  textTimeInput: {
    height: 50,
    borderColor: 'teal',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'lightgoldenrodyellow',
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
    marginBottom: 20,
    width: 190, // Ensure the input takes the full width of its container
  },
  slabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'teal',
  },
});

export default EditPharmacyScreen;
