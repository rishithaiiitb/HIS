import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useNavigation, validatePathConfig } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import * as ImagePicker from "expo-image-picker";

const AddEmployee = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [contact, setContact] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nurseSchedules, setNurseSchedules] = useState([
    { day: "", start_time: "", end_time: "" },
  ]);
  const [receptionistSchedules, setReceptionistSchedules] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [specializationList, setSpecializationList] = useState([]);
  var fetched = true;

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

  const validateTime = (text) => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(text);
  };

  const validatePhoneNumber = (text) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(text);
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setName("");
    setAge("");
    setSex("");
    setQualification("");
    setSpecialization("");
    setSpecializationList([]);
    setDepartment("");
    setPhoto("");
    setContact("");
    setLicenseNumber("");
    setAddress("");
    setNurseSchedules([{ day: "", start_time: "", end_time: "" }]);
    setReceptionistSchedules([{ day: "", startTime: "", endTime: "" }]);
  };
  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleAgeChange = (value) => {
    setAge(value);
  };

  const handleSexChange = (value) => {
    setSex(value);
  };

  const handleQualificationChange = (value) => {
    setQualification(value);
  };

  const handleSpecializationChange = (value) => {
    setSpecialization(value);
    // fetchSpecializations(value);
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  };
  const handleContactChange = (value) => {
    setContact(value);
  };
  const handleLicenseNumberChange = (value) => {
    setLicenseNumber(value);
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
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
          setPhoto(base64String);
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

  const fetchSpecializations = async () => {
    try {
      fetched = true;
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/admin/viewSpecializations`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetched = false;
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSpecializationList(data);
      } else if (response.status == 500) {
        Alert.alert(
          "Error",
          "Session Expired!! Please Log in again",
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
        fetched = false;
      } else {
        fetched = false;
        console.error(
          "Failed to fetch specialization names:",
          response.statusText
        );
      }
    } catch (error) {
      fetched = false;
      console.error("Error fetching specialization names:", error.message);
    }
  };

  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const handleAddSchedule = () => {
    setNurseSchedules([
      ...nurseSchedules,
      { day: "", start_time: "", end_time: "" },
    ]);
  };

  const handleAddReceptionistSchedule = () => {
    setReceptionistSchedules([
      ...receptionistSchedules,
      { day: "", startTime: "", endTime: "" },
    ]);
  };

  const handleRemoveSchedule = (index) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules.splice(index, 1);
    setNurseSchedules(updatedNurseSchedules);
  };

  const handleRemoveReceptionistSchedule = (index) => {
    const updatedReceptionistSchedules = [...receptionistSchedules];
    updatedReceptionistSchedules.splice(index, 1);
    setReceptionistSchedules(updatedReceptionistSchedules);
  };

  const handleScheduleDayChange = (index, value) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules[index].day = value;
    setNurseSchedules(updatedNurseSchedules);
  };

  const handleReceptionistScheduleDayChange = (index, value) => {
    const updatedReceptionistSchedules = [...receptionistSchedules];
    updatedReceptionistSchedules[index].day = value;
    setReceptionistSchedules(updatedReceptionistSchedules);
  };

  const handleScheduleStartTimeChange = (index, value) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules[index].start_time = value;
    setNurseSchedules(updatedNurseSchedules);
  };

  const handleReceptionistScheduleStartTimeChange = (index, value) => {
    const updatedReceptionistSchedules = [...receptionistSchedules];
    updatedReceptionistSchedules[index].startTime = value;
    setReceptionistSchedules(updatedReceptionistSchedules);
  };

  const handleScheduleEndTimeChange = (index, value) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules[index].end_time = value;
    setNurseSchedules(updatedNurseSchedules);
  };

  const handleReceptionistScheduleEndTimeChange = (index, value) => {
    const updatedReceptionistSchedules = [...receptionistSchedules];
    updatedReceptionistSchedules[index].endTime = value;
    setReceptionistSchedules(updatedReceptionistSchedules);
  };

  useEffect(() => {
    if (role === "doctor") {
      fetchSpecializations();
    }
  }, [role]);

  const submitNurse = async () => {
    if (!name || !age || !sex || !contact || !nurseSchedules) {
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

      if (endTime <= startTime) {
        Alert.alert("Error", "End time must be greater than start time.");
        return;
      }
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/admin/addNurse`;
      const roleName = "Nurse";
      const requestBody = {
        name,
        age,
        sex,
        contact,
        photo,
        nurseSchedules,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        Alert.alert("Success", `${roleName} added successfully!`);
        // Reset all state variables
        setRole(role);
        setName("");
        setAge("");
        setSex("");
        setContact("");
        setPhoto(null);
        setNurseSchedules([{ day: "", start_time: "", end_time: "" }]);
        setReceptionistSchedules([{ day: "", startTime: "", endTime: "" }]);
        console.log(`${roleName} added successfully!`);
      } else if (response.status == 500) {
        Alert.alert(
          "Error",
          "Session Expired!! Please Log in again",
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
        Alert.alert("Error", `Failed to add ${roleName.toLowerCase()}`);
        console.error(
          `Failed to add ${roleName.toLowerCase()}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error adding Nurse:`, error.message);
    }
  };

  const submitPharmacy = async () => {
    const token = await AsyncStorage.getItem("token");
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
    try {
      const apiUrl = `${API_BASE_URL}/admin/addPharmacy`;
      const roleName = "Pharmacy";
      const requestBody = {
        name,
        contact,
        address,
        licenseNumber,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        Alert.alert("Success", `${roleName} added successfully!`);
        setRole(role);
        setName("");
        setContact("");
        setLicenseNumber("");
        setAddress("");
        console.log(`${roleName} added successfully!`);
      } else if (response.status == 500) {
        Alert.alert(
          "Error",
          "Session Expired!! Please Log in again",
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
        Alert.alert("Error", `Failed to add ${roleName.toLowerCase()}`);
        console.error(
          `Failed to add ${roleName.toLowerCase()}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error adding Nurse:`, error.message);
    }
  };
  const submitDoctor = async () => {
    if (
      !name ||
      !age ||
      !sex ||
      !qualification ||
      !department ||
      !contact ||
      !licenseNumber ||
      !specialization
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
        "Invalid phone number.Enter a valid phone number of 10 digits"
      );
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/admin/addDoctor/${specialization}`;
      const roleName = "Doctor";
      const requestBody = {
        name,
        age,
        sex,
        qualification,
        department,
        contact,
        licenseNumber,
        photo,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        Alert.alert("Success", `${roleName} added successfully!`);
        setRole(role);
        setName("");
        setAge("");
        setSex("");
        setQualification("");
        setSpecialization("");
        setDepartment("");
        setPhoto(null);
        setContact("");
        setLicenseNumber("");
        setReceptionistSchedules([{ day: "", startTime: "", endTime: "" }]);
        console.log(`${roleName} added successfully!`);
        fetched = true;
      } else if (response.status == 500) {
        Alert.alert(
          "Error",
          "Session Expired!! Please Log in again",
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
        Alert.alert("Error", `Failed to add ${roleName.toLowerCase()}`);
        console.error(
          `Failed to add ${roleName.toLowerCase()}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error adding Doctor:`, error.message);
    }
  };

  const submitReceptionist = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!name || !age || !sex || !contact || !receptionistSchedules) {
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
    for (const schedule of receptionistSchedules) {
      if (!validateTime(schedule.startTime)) {
        Alert.alert(
          "Error",
          `Invalid start time "${schedule.startTime}" . Please enter in HH:MM:SS (24H format)`
        );
        return;
      }

      if (!validateTime(schedule.endTime)) {
        Alert.alert(
          "Error",
          `Invalid end time "${schedule.endTime}".Please enter in HH:MM:SS (24H format)`
        );
        return;
      }
      // Convert start time and end time to Date objects
      const startTime = new Date(`2000-01-01T${schedule.startTime}`);
      const endTime = new Date(`2000-01-01T${schedule.endTime}`);

      // Check if end time is greater than start time
      if (endTime <= startTime) {
        Alert.alert("Error", "End time must be greater than start time.");
        return;
      }
    }
    try {
      const apiUrl = `${API_BASE_URL}/admin/addReceptionist`;
      const roleName = "Receptionist";
      const requestBody = {
        name,
        age,
        sex,
        contact,
        photo,
        receptionistSchedules,
      };
      console.log(requestBody);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        Alert.alert("Success", `${roleName} added successfully!`);
        setRole(role);
        setName("");
        setAge("");
        setSex("");
        setContact("");
        setPhoto(null);
        setReceptionistSchedules([{ day: "", startTime: "", endTime: "" }]);
        console.log(`${roleName} added successfully!`);
      } else if (response.status == 500) {
        Alert.alert(
          "Error",
          "Session Expired!! Please Log in again",
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
        Alert.alert("Error", `Failed to add ${roleName.toLowerCase()}`);
        console.error(
          `Failed to add ${roleName.toLowerCase()}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error adding Receptionist:`, error.message);
    }
  };

  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  return (
    <View style={styles.container}>
      <AdminHeader
        onPressMenu={toggleSidebar}
        showBackButton={true}
        backButtonDestination={"AdminHome"}
      />
      <ImageBackground
        source={{
          uri: "https://png.pngtree.com/background/20210717/original/pngtree-plant-doctor-cartoon-international-nurse-day-character-background-picture-image_1409470.jpg",
        }}
        style={styles.content}
      >
        {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="AddEmployee" />
        )}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Team Profiles:Add {role} </Text>
          <Text style={styles.slabel}>Role:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={handleRoleChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="Nurse" value="nurse" />
              <Picker.Item label="Doctor" value="doctor" />
              <Picker.Item label="Pharmacy" value="pharmacy" />
              <Picker.Item label="Receptionist" value="receptionist" />
            </Picker>
          </View>

          {role === "doctor" && (
            <View>
              <Text style={styles.slabel}>Name:</Text>
              <TextInput
                value={name}
                onChangeText={handleNameChange}
                style={styles.textInput}
                placeholder="Enter Name"
              />
              {name !== "" &&
                !/^[a-zA-Z\s]+$/.test(name) &&
                renderErrorMessage(
                  "Name must contain only alphabets and spaces."
                )}

              <Text style={styles.slabel}>Age:</Text>
              <TextInput
                value={age}
                onChangeText={handleAgeChange}
                style={styles.textInput}
                placeholder="Enter Age"
              />
              {age !== "" &&
                !/^[0-9]+$/.test(age) &&
                renderErrorMessage("Age must contain only numbers.")}
              <Text style={styles.slabel}>Gender:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sex}
                  onValueChange={handleSexChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </View>

              <Text style={styles.slabel}>Highest Qualification:</Text>
              <TextInput
                value={qualification}
                onChangeText={handleQualificationChange}
                style={styles.textInput}
                placeholder="Enter Highest Degree"
              />
              {qualification !== "" &&
                !/^[a-zA-Z\s]+$/.test(qualification) &&
                renderErrorMessage(
                  "Qualification must contain only alphabets and spaces."
                )}

              <Text style={styles.slabel}>Specialization:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={specialization}
                  onValueChange={handleSpecializationChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Specialization" value="" />
                  {specializationList &&
                    specializationList.map((specializationItem, index) => (
                      <Picker.Item
                        key={index}
                        label={specializationItem}
                        value={specializationItem}
                      />
                    ))}
                </Picker>
              </View>

              <Text style={styles.slabel}>Department:</Text>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  title="OP"
                  checked={department === "OP"}
                  onPress={() => handleDepartmentChange("OP")}
                  containerStyle={styles.checkbox}
                  textStyle={styles.checkboxText}
                  checkedColor="teal"
                />
                <CheckBox
                  title="IP"
                  checked={department === "IP"}
                  onPress={() => handleDepartmentChange("IP")}
                  containerStyle={styles.checkbox}
                  textStyle={styles.checkboxText}
                  checkedColor="teal"
                />
              </View>
              <Text style={styles.slabel}>Contact:</Text>
              <TextInput
                value={contact}
                onChangeText={handleContactChange}
                style={styles.textInput}
                placeholder="Enter Contact No."
              />
              {contact !== "" &&
                !/^[0-9]{10}$/.test(contact) &&
                renderErrorMessage("Contact must contain only 10 digits.")}
              <Text style={styles.slabel}>License:</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={handleLicenseNumberChange}
                style={styles.textInput}
                placeholder="Enter License No."
              />
              {licenseNumber !== "" &&
                !/^[A-Z][A-Za-z]*\d+[a-z]*$/.test(licenseNumber) &&
                renderErrorMessage(
                  "License number must start with a alphabet and be alphanumeric."
                )}
              <TouchableOpacity
                onPress={handlePickImage}
                style={styles.addPictureButton}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 300, height: 300, borderRadius: 150 }}
                  />
                ) : (
                  <Text style={styles.addPictureButtonText}>
                    Add Profile Picture
                  </Text>
                )}
              </TouchableOpacity>

              {photo && (
                <TouchableOpacity
                  onPress={() => setPhoto(null)}
                  style={styles.addButtonToRemovePicture}
                >
                  <Text style={styles.addButtonToRemovePictureText}>
                    Remove Picture
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={submitDoctor} style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
          {role == "nurse" && (
            //  <ScrollView >
            <View>
              <Text style={styles.slabel}>Name:</Text>
              <TextInput
                value={name}
                onChangeText={handleNameChange}
                style={styles.textInput}
                placeholder="Enter Name"
              />
              {name !== "" &&
                !/^[a-zA-Z\s]+$/.test(name) &&
                renderErrorMessage(
                  "Name must contain only alphabets and spaces."
                )}

              <Text style={styles.slabel}>Age:</Text>
              <TextInput
                value={age}
                onChangeText={handleAgeChange}
                style={styles.textInput}
                placeholder="Enter Age"
              />
              {age !== "" &&
                !/^[0-9]+$/.test(age) &&
                renderErrorMessage("Age must contain only numbers.")}
              <Text style={styles.slabel}>Gender:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sex}
                  onValueChange={handleSexChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Value" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </View>

              <Text style={styles.slabel}>Contact:</Text>
              <TextInput
                value={contact}
                onChangeText={handleContactChange}
                style={styles.textInput}
                placeholder="Enter Contact No."
              />

              {contact !== "" &&
                !/^[0-9]{10}$/.test(contact) &&
                renderErrorMessage("Contact must contain only 10 digits.")}

              <Text
                style={[
                  styles.slabel,
                  { fontSize: 20, marginTop: 20, marginBottom: 10 },
                ]}
              >
                Schedule Details for the Nurse:
              </Text>
              {nurseSchedules.map((schedule, index) => (
                <View key={index}>
                  <Text style={styles.slabel}>Day: </Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={schedule.day}
                      onValueChange={(value) =>
                        handleScheduleDayChange(index, value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Value" value="" />

                      {daysOfWeek.map((day) => (
                        <Picker.Item key={day} label={day} value={day} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.startEndTimeContainer}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.slabel}>Start Time:</Text>
                      <TextInput
                        value={schedule.start_time}
                        onChangeText={(value) =>
                          handleScheduleStartTimeChange(index, value)
                        }
                        style={styles.textTimeInput}
                        placeholder="HH:MM:SS"
                      />
                    </View>
                    {/* {schedule.start_time !== "" &&
                      !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                        schedule.start_time
                      ) &&
                      renderErrorMessage(
                        "Start time must in 24 h format of HH:MM:SS."
                      )} */}

                    <View style={styles.timeContainer}>
                      <Text style={styles.slabel}>End Time:</Text>
                      <TextInput
                        value={schedule.end_time}
                        onChangeText={(value) =>
                          handleScheduleEndTimeChange(index, value)
                        }
                        style={styles.textTimeInput}
                        placeholder="HH:MM:SS"
                      />
                    </View>
                    {/* {schedule.end_time !== "" &&
                      !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                        schedule.end_time
                      ) &&
                      renderErrorMessage(
                        "End time must in 24 h format of HH:MM:SS."
                      )} */}
</View>
{schedule.start_time !== "" &&
                      !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                        schedule.start_time
                      ) &&
                      renderErrorMessage(
                        "Start time must in 24 h format of HH:MM:SS."
                      )} 
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
                        <Text style={styles.removeButtonText}>
                          Remove Schedule
                        </Text>
                      </TouchableOpacity>
                    )}
                  
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddSchedule}
                style={styles.button}
              >
                <Text style={styles.buttonText}>+ Add Another Schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePickImage}
                style={styles.addPictureButton}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 300, height: 300, borderRadius: 150 }}
                  />
                ) : (
                  <Text style={styles.addPictureButtonText}>
                    Add Profile Picture
                  </Text>
                )}
              </TouchableOpacity>
              {photo && (
                <TouchableOpacity
                  onPress={() => setPhoto(null)}
                  style={styles.addButtonToRemovePicture}
                >
                  <Text style={styles.addButtonToRemovePictureText}>
                    Remove Picture
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={submitNurse} style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
          {role === "pharmacy" && (
            <View>
              <Text style={styles.slabel}>Name:</Text>
              <TextInput
                value={name}
                onChangeText={handleNameChange}
                style={styles.textInput}
                placeholder="Enter Name"
              />

              {name !== "" &&
                !/^[a-zA-Z\s]+$/.test(name) &&
                renderErrorMessage(
                  "Name must contain only alphabets and spaces."
                )}

              <Text style={styles.slabel}>Contact:</Text>
              <TextInput
                value={contact}
                onChangeText={handleContactChange}
                style={styles.textInput}
                placeholder="Enter Contact No."
              />
              {contact !== "" &&
                !/^[0-9]{10}$/.test(contact) &&
                renderErrorMessage("Contact must contain only 10 digits.")}

              <Text style={styles.slabel}>Address:</Text>
              <TextInput
                value={address}
                onChangeText={handleAddressChange}
                style={styles.textInput}
                placeholder="Enter Pharmacy Address"
              />
              {address !== "" &&
                !/^[a-zA-Z0-9\s]+$/.test(address) &&
                renderErrorMessage(
                  "Address must contain only alphabets,digitsand spaces."
                )}
              <Text style={styles.slabel}>License:</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={handleLicenseNumberChange}
                style={styles.textInput}
                placeholder="Enter License No."
              />

              {licenseNumber !== "" &&
                !/^[A-Z][A-Za-z]*\d+[a-z]*$/.test(licenseNumber) &&
                renderErrorMessage(
                  "License number must start with a alphabet and be alphanumeric."
                )}

              <TouchableOpacity onPress={submitPharmacy} style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {role === "receptionist" && (
            <View>
              <Text style={styles.slabel}>Name:</Text>
              <TextInput
                value={name}
                onChangeText={handleNameChange}
                style={styles.textInput}
                placeholder="Enter Name"
              />
              {name !== "" &&
                !/^[a-zA-Z\s]+$/.test(name) &&
                renderErrorMessage(
                  "Name must contain only alphabets and spaces."
                )}

              <Text style={styles.slabel}>Age:</Text>
              <TextInput
                value={age}
                onChangeText={handleAgeChange}
                style={styles.textInput}
                placeholder="Enter Age"
              />
              {age !== "" &&
                !/^[0-9]+$/.test(age) &&
                renderErrorMessage("Age must contain only numbers.")}
              <Text style={styles.slabel}>Gender:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sex}
                  onValueChange={handleSexChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </View>
              <Text style={styles.slabel}>Contact:</Text>
              <TextInput
                value={contact}
                onChangeText={handleContactChange}
                style={styles.textInput}
                placeholder="Enter Contact No."
              />
              {contact !== "" &&
                !/^[0-9]{10}$/.test(contact) &&
                renderErrorMessage("Contact must contain only 10 digits.")}

              <Text
                style={[
                  styles.slabel,
                  { fontSize: 20, marginTop: 20, marginBottom: 10 },
                ]}
              >
                Schedule Details for the Receptionist:
              </Text>
              {receptionistSchedules.map((schedule, index) => (
                <View key={index}>
                  <Text style={styles.slabel}>Day: </Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={schedule.day}
                      onValueChange={(value) =>
                        handleReceptionistScheduleDayChange(index, value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Value" value="" />

                      {daysOfWeek.map((day) => (
                        <Picker.Item key={day} label={day} value={day} />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.startEndTimeContainer}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.slabel}>Start Time:</Text>
                      <TextInput
                        value={schedule.startTime}
                        onChangeText={(value) =>
                          handleReceptionistScheduleStartTimeChange(
                            index,
                            value
                          )
                        }
                        style={styles.textTimeInput}
                        placeholder="HH:MM:SS"
                      />
                    </View>
                    <View style={styles.timeContainer}>
                      

                      <Text style={styles.slabel}>End Time:</Text>
                      <TextInput
                        value={schedule.endTime}
                        onChangeText={(value) =>
                          handleReceptionistScheduleEndTimeChange(index, value)
                        }
                        style={styles.textTimeInput}
                        placeholder="HH:MM:SS"
                      />
                    </View>
                  </View>
                  {schedule.startTime !== "" &&
                        !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                          schedule.startTime
                        ) &&
                        renderErrorMessage(
                          "Start time must in 24 h format of HH:MM:SS."
                        )}
                  {schedule.endTime !== "" &&
                    !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                      schedule.endTime
                    ) &&
                    renderErrorMessage(
                      "End time must in 24 h format of HH:MM:SS."
                    )}
                  {index > 0 && ( // Render "Remove" button if not the first schedule
                    <TouchableOpacity
                      onPress={() => handleRemoveReceptionistSchedule(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>
                        Remove Schedule
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddReceptionistSchedule}
                style={styles.button}
              >
                <Text style={styles.buttonText}>+ Add Another Schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePickImage}
                style={styles.addPictureButton}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 300, height: 300, borderRadius: 150 }}
                  />
                ) : (
                  <Text style={styles.addPictureButtonText}>
                    Add Profile Picture
                  </Text>
                )}
              </TouchableOpacity>

              {photo && (
                <TouchableOpacity
                  onPress={() => setPhoto(null)}
                  style={styles.addButtonToRemovePicture}
                >
                  <Text style={styles.addButtonToRemovePictureText}>
                    Remove Picture
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={submitReceptionist}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
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

export default AddEmployee;
