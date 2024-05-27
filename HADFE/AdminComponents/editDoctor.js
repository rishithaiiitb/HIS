import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../config";
import LoadingScreen from "../Loading";

const EditDoctorScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [editDoctorDetails, setEditedDoctorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [specializationList, setSpecializationList] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validateName = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(text);
  };

  const validateAge = (text) => {
    const ageNum = parseInt(text);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
  };

  const validatePhoneNumber = (text) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(text);
  };

  useEffect(() => {
    fetchDoctorDetails();
    fetchSpecializations();
  }, [fetchDoctorDetails]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/viewDoctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const doctorData = response.data;
      // setEditedDoctorDetails(doctorData);
      setEditedDoctorDetails({
        ...doctorData,
        specialization: doctorData.specialization.specializationName,
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
        console.error("Error fetching doctor details:", error);
        setError("Failed to fetch doctor details");
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchSpecializations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/viewSpecializations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setSpecializationList(data);
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
        setError("Failed to fetch specializations");
      }
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        const selectedImageUri = selectedAsset.uri;

        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setEditedDoctorDetails({ ...editDoctorDetails, photo: base64String });
        };
        reader.readAsDataURL(blob);
      } else {
        Alert.alert("Image picking cancelled", "You cancelled image picking.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image");
    }
  };

  const handleInputChange = (field, value) => {
    setEditedDoctorDetails({ ...editDoctorDetails, [field]: value });
  };

  const removePhoto = () => {
    setEditedDoctorDetails({ ...editDoctorDetails, photo: null });
  };

  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );

  const handleSave = async () => {
    const {
      name,
      age,
      sex,
      qualification,
      specialization,
      contact,
      department,
      licenseNumber,
      photo,
      active,
    } = editDoctorDetails;
    if (
      !name ||
      !age ||
      !sex ||
      !qualification ||
      !specialization ||
      !department ||
      !contact ||
      !licenseNumber
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!validateName(name)) {
      Alert.alert("Error", "Name should contain only letters and spaces.");
      return;
    }

    if (!validateName(qualification)) {
      Alert.alert(
        "Error",
        "Qualification should contain only letters and spaces."
      );
      return;
    }

    if (!validateAge(age)) {
      Alert.alert("Error", "Age should be a number between 0 and 150.");
      return;
    }

    if (!validatePhoneNumber(contact)) {
      Alert.alert(
        "Error",
        "Invalid phone number. Enter a valid phone number of 10 digits"
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const editedFields = {
        photo,
        name,
        age,
        sex,
        qualification,
        contact,
        department,
        licenseNumber,
        active,
      };
      const response = await fetch(
        `${API_BASE_URL}/admin/editDoctor/${doctorId}/${specialization}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedFields),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Doctor details updated successfully.");
        if (route.params && route.params.onSaveSuccess) {
          route.params.onSaveSuccess();
        }
        //navigation.navigate("ViewDoctors",{fetch:true});
        navigation.goBack();
      } else {
        Alert.alert("Failed to update doctor details.");
        throw new Error("Failed to update doctor details.");
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
        console.error("Error updating doctor details:", error);
        setError("Failed to update doctor details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!editDoctorDetails || !specializationList) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <AdminHeader
        onPressMenu={toggleSidebar}
        showBackButton={true}
        backButtonDestination="ViewDoctors"
      />
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61809.jpg",
        }}
        style={styles.content}
      >
        {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>
            Edit {editDoctorDetails.department} Doctor - {doctorId}
          </Text>
          <Text style={styles.slabel}>Name:</Text>
          <TextInput
            value={editDoctorDetails.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={styles.textInput}
            placeholder="Enter Name"
          />
          {editDoctorDetails.name !== "" &&
            !/^[a-zA-Z\s]+$/.test(editDoctorDetails.name) &&
            renderErrorMessage("Name must contain only alphabets and spaces.")}

          <Text style={styles.slabel}>Age:</Text>
          <TextInput
            value={
              editDoctorDetails.age !== undefined
                ? editDoctorDetails.age.toString()
                : ""
            }
            onChangeText={(value) => handleInputChange("age", value)}
            style={styles.textInput}
            placeholder="Enter Age"
          />

          {editDoctorDetails.age !== "" &&
            !/^[0-9]+$/.test(editDoctorDetails.age) &&
            renderErrorMessage("Age must contain only numbers.")}

          <Text style={styles.slabel}>Gender:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editDoctorDetails.sex}
              onValueChange={(value) => handleInputChange("sex", value)}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <Text style={styles.slabel}>Contact:</Text>
          <TextInput
            value={editDoctorDetails.contact}
            onChangeText={(value) => handleInputChange("contact", value)}
            style={styles.textInput}
            placeholder="Enter Contact No."
          />
          {editDoctorDetails.contact !== "" &&
            !/^[0-9]+$/.test(editDoctorDetails.contact) &&
            renderErrorMessage("Contact must contain only numbers.")}

          <Text style={styles.slabel}>Department:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editDoctorDetails.department}
              onValueChange={(value) => handleInputChange("department", value)}
              style={styles.picker}
            >
              <Picker.Item label="IP" value="IP" />
              <Picker.Item label="OP" value="OP" />
            </Picker>
          </View>
          <Text style={styles.slabel}>Qualification:</Text>
          <TextInput
            value={editDoctorDetails.qualification}
            onChangeText={(value) => handleInputChange("qualification", value)}
            style={styles.textInput}
            placeholder="Enter Highest Degree"
          />

          {editDoctorDetails.qualification !== "" &&
            !/^[a-zA-Z\s]+$/.test(editDoctorDetails.qualification) &&
            renderErrorMessage(
              "Qualification must contain only alphabets and spaces."
            )}

          <Text style={styles.slabel}>Specialization:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editDoctorDetails.specialization}
              onValueChange={(value) =>
                handleInputChange("specialization", value)
              }
              style={styles.picker}
            >
              {specializationList.map((specialization, index) => (
                <Picker.Item
                  key={index.toString()}
                  label={specialization}
                  value={specialization}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.slabel}>License:</Text>
          <TextInput
            value={editDoctorDetails.licenseNumber}
            onChangeText={(value) => handleInputChange("licenseNumber", value)}
            style={styles.textInput}
            placeholder="Enter License No."
          />

          {editDoctorDetails.licenseNumber !== "" &&
            !/^[A-Z][A-Za-z]*\d+[a-z]*$/.test(
              editDoctorDetails.licenseNumber
            ) &&
            renderErrorMessage(
              "License number must start with a alphabet and be alphanumeric."
            )}

<TouchableOpacity
                onPress={pickImage}
                style={styles.button}
              >
                <Text style={styles.addButtonToRemovePictureText}>
                  Edit Profile Picture
                </Text>
              </TouchableOpacity>

          {editDoctorDetails.photo && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: editDoctorDetails.photo }}
                style={{ width: 300, height: 300, borderRadius: 150 }}
              />
              <TouchableOpacity
                onPress={removePhoto}
                style={styles.addButtonToRemovePicture}
              >
                <Text style={styles.addButtonToRemovePictureText}>
                  Remove Picture
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={handleSave} style={styles.button}>
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
    justifyContent: "center",
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
    fontWeight: "bold",
    marginTop: -10,
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
  },
  textInput: {
    height: 50,
    width: 400,
    borderColor: "teal",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    fontSize: 14,
    color: "black",
    marginBottom: 20,
  },
  slabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "teal", // You can change this as needed
  },
  pickerContainer: {
    borderColor: "teal",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: 400,
    overflow: "hidden", // This is important to make borderRadius work on Android
  },
  picker: {
    height: 50,
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    fontSize: 14,
    color: "black",
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: 400, // or '100%' if it should be responsive
    marginBottom: 20,
  },
  checkbox: {
    backgroundColor: "lightgoldenrodyellow",
    borderColor: "teal",
    borderWidth: 1,
    borderRadius: 10,
    width: 180,
  },
  checkboxText: {
    fontSize: 14,
    color: "black",
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
    justifyContent: "center",
    height: 50,
    width: 400, // Adjust width as needed
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold", // If you want the text to be bold
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
    flexDirection: "column",
    alignItems: "center", // Align items vertically
    justifyContent: "space-between", // Distribute space evenly
    flexWrap: "wrap", // Allow items to wrap to the next line if space is tight
    marginBottom: 20, // Optional: add some bottom margin
  },
  startEndTimeContainer: {
    flexDirection: "row", // Align children in a row
    justifyContent: "space-around", // Space out children evenly
    width: 400, // Take the full width to accommodate both columns
  },
  timeContainer: {
    flex: 1, // Each child (start and end time) takes equal space
    //padding: 10, // Optional: for spacing around the content
  },
  textTimeInput: {
    height: 50,
    borderColor: "teal",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    fontSize: 14,
    color: "black",
    marginBottom: 20,
    width: 190, // Ensure the input takes the full width of its container
  },
  slabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "teal",
  },
});

export default EditDoctorScreen;
