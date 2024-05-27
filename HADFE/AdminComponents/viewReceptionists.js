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

const ViewReceptionists = ({ handleBack }) => {
  const [receptionists, setReceptionists] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const [loading,setLoading] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchReceptionists = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/viewReceptionists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReceptionists(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 500) {
        Alert.alert(
          "Error",
          "Session Expired Please Log in again",
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
        console.error("Error fetching receptionist:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchReceptionists();
  }, [fetchReceptionists]);

  const handleEdit = async (receptionistId) => {
    try {
      await navigation.navigate("EditReceptionistScreen", {
        receptionistId: receptionistId,
        onSaveSuccess: fetchReceptionists,
      });
      setIsSidebarOpen(false); // Close sidebar after navigating
    } catch (error) {
      console.error("Error navigating to edit screen:", error);
    }
  };

  const handleDeactivate = async (receptionistId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/admin/deactivateReceptionist/${receptionistId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert(
        "Success",
        `Deleted receptionist with ID ${receptionistId} successfully`
      );
      fetchReceptionists();
      setIsSidebarOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Alert.alert(
          "Error",
          "Session Expired !! Please Log in again",
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
        console.error("Error deactivating receptionist:", error);
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header and sidebar components */}
      <ImageBackground
        source={{
          uri: "https://us.123rf.com/450wm/winnievinzence/winnievinzence2001/winnievinzence200100029/146032370-modern-hospital-icu-corridor-interior-medical-and-healthcare-concept.jpg?ver=6",
        }}
        style={styles.content}
      >
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="RoleSelection" />
        )}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>View Receptionists</Text>
          <Table borderStyle={{ borderWidth: 0, borderColor: "transparent" }}>
            {/* Table Header */}
            <Row
              data={[
                "S.No.",
                "Receptionist ID",
                "Name",
                "Contact",
                "Email",
                "Action",
              ]}
              style={styles.tableHeader}
              textStyle={styles.headerText}
              flexArr={[1, 2, 2, 2, 3, 2]} // Flex array for column widths
            />
            {/* Table Rows */}
            {receptionists && receptionists.length>0 ? (receptionists.map((receptionist, index) => (
              <TouchableOpacity
                key={receptionist.receptionistId}
                onPress={() => handleEdit(receptionist.receptionistId)}
              >
                <Row
                  data={[
                    index + 1,
                    receptionist.receptionistId,
                    receptionist.name,
                    receptionist.contact,
                    receptionist.email,
                    <View style={styles.actionContainer}>
                      <TouchableOpacity
                        onPress={() => handleEdit(receptionist.receptionistId)}
                      >
                        <MaterialIcons name="edit" size={24} color="blue" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeactivate(receptionist.receptionistId)
                        }
                      >
                        <MaterialIcons name="delete" size={24} color="red" />
                      </TouchableOpacity>
                    </View>,
                  ]}
                  style={styles.tableRow}
                  textStyle={styles.tableText}
                  flexArr={[1, 2, 2, 2, 3, 2]} // Flex array for column widths
                />
              </TouchableOpacity>
            ))) : (
              <Text style = {styles.noDataText}>No Receptionist available</Text>
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
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
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
    alignSelf: 'center',
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

export default ViewReceptionists;
