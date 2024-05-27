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
  ImageBackground
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import LoadingScreen from "../Loading";

const EditNurseScreen = ({ route, navigation }) => {
  const { nurseId } = route.params;
  const [nurseDetails, setNurseDetails] = useState(null);
  const [editedNurseDetails, setEditedNurseDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const selectedAsset = result.assets[0];
        const selectedImageUri = selectedAsset.uri;

        // Fetch the image data as a blob
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        // Convert the blob to a Base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setEditedNurseDetails({ ...editedNurseDetails, photo: base64String });
        };
        reader.readAsDataURL(blob);
      } else {
        // Provide feedback to the user if image picking is cancelled
        Alert.alert("Image picking cancelled", "You cancelled image picking.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image");
    }
  };

  const removePhoto = () => {
    setEditedNurseDetails({ ...editedNurseDetails, photo: null });
  };

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
    fetchNurseDetails();
  }, []);

  const fetchNurseDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/viewNurse/${nurseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nurseData = response.data;
      setNurseDetails(nurseData);
      setEditedNurseDetails({
        name: nurseData.name,
        age: nurseData.age.toString(),
        sex: nurseData.sex,
        contact: nurseData.contact,
        photo: nurseData.photo,
        nurseSchedules: nurseData.nurseSchedules,
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
        console.error("Error fetching nurse details:", error);
        setError("Failed to fetch nurse details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedNurseDetails({ ...editedNurseDetails, [field]: value });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...editedNurseDetails.nurseSchedules];
    updatedSchedules[index][field] = value;
    setEditedNurseDetails({
      ...editedNurseDetails,
      nurseSchedules: updatedSchedules,
    });
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedules = [...editedNurseDetails.nurseSchedules];
    updatedSchedules.splice(index, 1);
    setEditedNurseDetails({
      ...editedNurseDetails,
      nurseSchedules: updatedSchedules,
    });
  };

  const addSchedule = () => {
    setEditedNurseDetails({
      ...editedNurseDetails,
      nurseSchedules: [
        ...(editedNurseDetails.nurseSchedules || []),
        { day: "", start_time: "", end_time: "" }, // Default values for a new schedule
      ],
    });
  };

  const handleSave = async () => {
    const { name, age, sex, contact, nurseSchedules, photo, active } =
      editedNurseDetails;

    if (!name || !age || !sex || !contact || !nurseSchedules) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!validateName(name)) {
      Alert.alert("Error", "Name should contain only letters and spaces.");
      return;
    }

    if (!validateAge(age)) {
      Alert.alert("Error", "Age should be a number between 0 and 150.");
      return;
    }

    if (!validatePhoneNumber(contact)) {
      Alert.alert(
        "Error",
        "Invalid phone number.Enter a valid phone number of 10 digits"
      );
      return;
    }
    for (const schedule of nurseSchedules) {
      if (!validateTime(schedule.start_time)) {
        Alert.alert(
          "Error",
          `Invalid start time "${schedule.start_time}" . Please enter in HH:MM:SS (24H format)`
        );
        return;
      }

      if (!validateTime(schedule.end_time)) {
        Alert.alert(
          "Error",
          `Invalid end time "${schedule.end_time}".Please enter in HH:MM:SS (24H format)`
        );
        return;
      }
      const startTime = new Date(`2000-01-01T${schedule.start_time}`);
      const endTime = new Date(`2000-01-01T${schedule.end_time}`);

      // Check if end time is greater than start time
      if (endTime <= startTime) {
        Alert.alert("Error", "End time must be greater than start time.");
        return;
      }
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
        contact,
        active,
        nurseSchedules,
      };
      await axios.put(
        `${API_BASE_URL}/admin/editNurse/${nurseId}`,
        editedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", "Nurse details updated successfully.");
      if (route.params && route.params.onSaveSuccess) {
        route.params.onSaveSuccess();
      }
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
        console.error("Error updating nurse details:", error);
        setError("Failed to update nurse details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!editedNurseDetails) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
      <AdminHeader
        onPressMenu={toggleSidebar}
        showBackButton={true}
        backButtonDestination="ViewNurses"
      />
      <ImageBackground source={{uri: "https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61809.jpg"}} style={styles.content}>
        
          {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {/* {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />} */}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Edit Nurse - {nurseId}</Text>
          <Text style={styles.slabel}>Name:</Text>
          <TextInput
            style={styles.textInput}
            value={editedNurseDetails.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Enter Name"
          />
          {editedNurseDetails.name !== "" &&
            !/^[a-zA-Z\s]+$/.test(editedNurseDetails.name) &&
            renderErrorMessage("Name must contain only alphabets and spaces.")}

<Text style={styles.slabel}>Age:</Text>
          <TextInput
            style={styles.textInput}
            value={editedNurseDetails.age}
            onChangeText={(value) => handleInputChange("age", value)}
            placeholder="Enter Age"
          />
          {editedNurseDetails.age !== "" &&
            !/^[0-9]+$/.test(editedNurseDetails.age) &&
            renderErrorMessage("Age must contain only numbers.")}

<Text style={styles.slabel}>Gender:</Text>
          <View style={styles.pickerContainer}>
          <Picker
            selectedValue={editedNurseDetails.sex}
            onValueChange={(value) => handleInputChange("sex", value)}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
          </View>


          <Text style={styles.slabel}>Contact:</Text>
          <TextInput
            style={styles.textInput}
            value={editedNurseDetails.contact}
            onChangeText={(value) => handleInputChange("contact", value)}
          />
          {editedNurseDetails.contact !== "" &&
            !/^[0-9]+$/.test(editedNurseDetails.contact) &&
            renderErrorMessage("Contact must contain only numbers.")}

{editedNurseDetails.nurseSchedules &&
            editedNurseDetails.nurseSchedules.map((schedule, index) => (
              <View key={index} style={styles.scheduleContainer}>
               <Text style={[styles.slabel,{fontSize:20,marginTop:20,marginBottom:10}]}>
                  Schedule {index + 1}:
                </Text>
                <Text style={styles.slabel}>Day: {schedule.day}</Text>
                <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={schedule.day}
                  onValueChange={(value) =>
                    handleScheduleChange(index, "day", value)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select a value" value="" />
                  <Picker.Item label="Monday" value="MONDAY" />
                  <Picker.Item label="Tuesday" value="TUESDAY" />
                  <Picker.Item label="Wednesday" value="WEDNESDAY" />
                  <Picker.Item label="Thursday" value="THURSDAY" />
                  <Picker.Item label="FRIDAY" value="FRIDAY" />
                  <Picker.Item label="Saturday" value="SATURDAY" />
                  <Picker.Item label="Sunday" value="SUNDAY" />
                </Picker>
                </View>
                <View style={styles.startEndTimeContainer}>
  <View style={styles.timeContainer}>
    <Text style={styles.slabel}>Start Time:</Text>
                <TextInput
                  style={styles.textTimeInput}
                  value={schedule.start_time}
                  onChangeText={(value) =>
                    handleScheduleChange(index, "start_time", value)
                  }
                  placeholder="HH:MM:SS"
                />
               </View>
                {schedule.start_time !== "" &&
                  !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                    schedule.start_time
                  ) &&
                  renderErrorMessage(
                    "Start time must in 24 h format of HH:MM:SS."
                  )}
                <View style={styles.timeContainer}>
    <Text style={styles.slabel}>End Time:</Text>
                <TextInput
                  style={styles.textTimeInput}
                  value={schedule.end_time}
                  onChangeText={(value) =>
                    handleScheduleChange(index, "end_time", value)
                  }
                  placeholder="HH:MM:SS"
                />
                </View>

</View>
                {schedule.end_time !== "" &&
                  !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                    schedule.end_time
                  ) &&
                  renderErrorMessage(
                    "End time must in 24 h format of HH:MM:SS."
                  )}

                {index > 0 && ( // Render "Remove" button if not the first schedule
                  <TouchableOpacity
                    onPress={() => handleRemoveSchedule(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove Schedule</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          <TouchableOpacity onPress={addSchedule} style={styles.button}>
  <Text style={styles.buttonText}>+ Add Another Schedule</Text>
</TouchableOpacity>

<TouchableOpacity
                onPress={pickImage}
                style={styles.button}
              >
                <Text style={styles.addButtonToRemovePictureText}>
                  Edit Profile Picture
                </Text>
              </TouchableOpacity>


          {editedNurseDetails.photo && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: editedNurseDetails.photo }}
                style={{ width: 300, height: 300, borderRadius: 150 }}
              />
              <TouchableOpacity
                onPress={removePhoto}
                style={styles.addButtonToRemovePicture}
              >
                <Text style={styles.addButtonToRemovePictureText}>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity onPress={handleSave} style={styles.button}>
  <Text style={styles.buttonText}>Save</Text>
</TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
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

export default EditNurseScreen;
