import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import LoadingScreen from "../Loading";
import { Table, Row, Rows } from "react-native-table-component";

export default function ViewDoctors({ handleBack }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState("OP");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const [loading,setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchDoctors = useCallback(async (dept) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log("Request Headers:", headers);

      const response = await axios.get(
        `${API_BASE_URL}/admin/viewDoctors/${dept}`,
        {
          headers: headers,
        }
      );
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 500) {
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
        console.error("Error fetching doctors:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchDoctors(selectedDept);
  }, [fetchDoctors, selectedDept]);

  const handleEdit = (doctorId, selectedDept) => {
    // navigation.navigate('EditDoctorScreen', {
    //   doctorId: doctorId,
    //   onSaveSuccess: fetchDoctors
    // });
    navigation.navigate("EditDoctorScreen", {
      doctorId: doctorId,
      onSaveSuccess: () => fetchDoctors(selectedDept),
    });
  };

  const handleDeactivate = async (doctorId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log("Request Headers:", headers);

      // Pass headers as the second argument, not as part of the request body
      await axios.put(
        `${API_BASE_URL}/admin/deactivateDoctor/${doctorId}`,
        null,
        {
          headers: headers,
        }
      );
      Alert.alert("Success", `Deleted doctor with ID ${doctorId} successfully`);
      fetchDoctors(selectedDept);
    } catch (error) {
      if (error.response && error.response.status === 500) {
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
        console.error("Error deleting doctor:", error);
      }
    }
  };

  const toggleRadio = (dept) => {
    setSelectedDept(dept);
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
      {/* <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="RoleSelection"/> */}
      <ImageBackground
        source={{
          uri: "https://us.123rf.com/450wm/winnievinzence/winnievinzence2001/winnievinzence200100029/146032370-modern-hospital-icu-corridor-interior-medical-and-healthcare-concept.jpg?ver=6",
        }}
        style={styles.content}
      >
        {/* {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />} */}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>View Doctors</Text>
          <View style={styles.departmentSelection}>
            <Text style={styles.departmentText}>Select Department:</Text>
            <TouchableOpacity
              onPress={() => toggleRadio("OP")}
              style={styles.radioContainer}
            >
              <MaterialIcons
                name={
                  selectedDept === "OP"
                    ? "radio-button-checked"
                    : "radio-button-unchecked"
                }
                size={24}
                color="black"
              />
              <Text style={styles.radioLabel}>OP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleRadio("IP")}
              style={styles.radioContainer}
            >
              <MaterialIcons
                name={
                  selectedDept === "IP"
                    ? "radio-button-checked"
                    : "radio-button-unchecked"
                }
                size={24}
                color="black"
              />
              <Text style={styles.radioLabel}>IP</Text>
            </TouchableOpacity>
          </View>
          <Table borderStyle={{ borderWidth: 0, borderColor: "transparent" }}>
            {/* Table Header */}
            <Row
              data={[
                "S.No.",
                "Doctor ID",
                "Name",
                "Contact",
                "Email",
                "Highest Qualification",
                "Action",
              ]}
              style={styles.tableHeader}
              textStyle={styles.headerText}
              flexArr={[1, 2, 2, 2, 3, 3, 2]} // Flex array for column widths
            />
            {doctors && doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <TouchableOpacity
                  key={doctor.doctorId}
                  onPress={() => handleEdit(doctor.doctorId,doctor.department)}
                >
                  <Row
                    data={[
                      index + 1,
                      doctor.doctorId,
                      doctor.name,
                      doctor.contact,
                      doctor.email,
                      doctor.qualification,
                      <View style={styles.actionContainer}>
                        <TouchableOpacity
                          onPress={() => handleEdit(doctor.doctorId,doctor.department)}
                        >
                          <MaterialIcons name="edit" size={24} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeactivate(doctor.doctorId)}
                        >
                          <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>
                      </View>,
                    ]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    flexArr={[1, 2, 2, 2, 3, 3, 2]} // Flex array for column widths
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No doctors found</Text>
            )}
          </Table>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    // alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -10,
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
  },
  departmentSelection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  departmentText: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    color: "teal",
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "teal",
  },

  tableHeader: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "lightseagreen",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "teal",
    borderRadius: 4, // Rounded corners
    marginBottom: 3,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginLeft: 5,
    marginRight: 5,
    color: "ivory",
  },
  tableRow: {
    flexDirection: "row",
    height: 35,
    backgroundColor: "ghostwhite",
    borderWidth: 1,
    borderColor: "plum",
    marginVertical: 3,
    borderRadius: 8, // Rounded corners
  },
  tableText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 30,
    color: "red",
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold", 
  },
  backButtonContainer:{
    marginTop: 10,
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 45,
    width: 100, // Adjust width as needed
  }
});
