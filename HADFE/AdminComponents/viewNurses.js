import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
import { faL } from "@fortawesome/free-solid-svg-icons";

const ViewNurses = ({ handleBack }) => {
  const [nurses, setNurses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // const fetchNurses = useCallback(async () => {
  //   const token = await AsyncStorage.getItem('token');
  //   try {
  //     const response = await axios.get('http://172.16.145.146:8080/admin/viewNurses',{
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     });
  //     setNurses(response.data);
  //   } catch (error) {
  //     console.error('Error fetching nurses:', error);
  //   }
  // }, []);

  const fetchNurses = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log("Request Headers:", headers);

      const response = await axios.get(`${API_BASE_URL}/admin/viewNurses`, {
        headers: headers,
      });
      setNurses(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 500) {
        Alert.alert(
          "Error",
          "Session Expired!!! Please Log in again",
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
    fetchNurses();
  }, [fetchNurses]);

  const handleEdit = (nurseId) => {
    navigation.navigate("EditNurseScreen", {
      nurseId: nurseId,
      onSaveSuccess: fetchNurses,
    });
  };

  const handleDeactivate = async (nurseId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/admin/deactivateNurse/${nurseId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", `Deleted nurse with ID ${nurseId} successfully`);

      fetchNurses();
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
        console.error("Error deactivating nurse:", error);
      }
    }
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
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />
        )}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>View Nurses</Text>
          <Table borderStyle={{ borderWidth: 0, borderColor: "transparent" }}>
            {/* Table Header */}
            <Row
              data={[
                "S.No.",
                "Nurse ID",
                "Name",
                "Gender",
                "Contact",
                "Email",
                "Action",
              ]}
              style={styles.tableHeader}
              textStyle={styles.headerText}
              flexArr={[1, 2, 2, 1, 2, 3, 2]} // Flex array for column widths
            />
            {/* Table Rows */}
            {nurses && nurses.length > 0 ? (
              nurses.map((nurse, index) => (
                <TouchableOpacity
                  key={nurse.nurseId}
                  onPress={() => handleEdit(nurse.nurseId)}
                >
                  <Row
                    data={[
                      index + 1,
                      nurse.nurseId,
                      nurse.name,
                      nurse.sex,
                      nurse.contact,
                      nurse.email,
                      <View style={styles.actionContainer}>
                        <TouchableOpacity
                          onPress={() => handleEdit(nurse.nurseId)}
                        >
                          <MaterialIcons name="edit" size={24} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeactivate(nurse.nurseId)}
                        >
                          <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>
                      </View>,
                    ]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    flexArr={[1, 2, 2, 1, 2, 3, 2]} // Flex array for column widths
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No nurses found</Text>
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
};
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
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButtonContainer: {
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
  },
  noDataText: {
    textAlign: "center",
    fontSize: 30,
    color: "red",
    marginTop: 20,
  },
});

export default ViewNurses;
