import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import { MaterialIcons } from "@expo/vector-icons";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { API_BASE_URL } from "../config";
import { Table, Row, Rows } from "react-native-table-component";
import { FontAwesome } from "@expo/vector-icons";
import BG_Tests from "../Nurse_Comp_Images/BG_Tests.png";
import { useConsent } from "../Context/ConsentContext";
import LoadingScreen from "../Loading";

// Define icons for previous and next
const previousIcon = "<<";
const nextIcon = ">>";
const backIcon = "arrow-back";
const addIcon = "add";

export default function ViewTest({ navigation, route }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const patientId = route.params.patientId;
  const { consentToken } = useConsent();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Example value
  const photo = null;
  const [loading,setLoading] = useState(false);

  const SemicircleBackground = ({ children, style }) => {
    return <View style={[styles.background, style]}>{children}</View>;
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/nurse/viewTest/${patientId}/${consentToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLoading(false);
        setTests(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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
          console.error("Error fetching tests:", error);
          setIsLoading(false);
        }
      }
    };
    if (isLoading) {
      fetchTests();
    }
  }, [patientId, isLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
    });

    return unsubscribe;
  }, [navigation]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTests = tests.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (id) => {
    navigation.navigate("NurseEditTest", { patientId, id });
  };

  const handleImage = (id) => {
    navigation.navigate("AddTestImage", { patientId, id, photo});
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/nurse/deleteTestResult/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTests = tests.filter((test) => test.id !== id);
      setTests(updatedTests);
      setIsLoading(true);
      navigation.navigate("ViewTest", { patientId });
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
        console.error("Error deleting test:", error);
      }
    }
  };
  
  if(loading)
  {
    return <LoadingScreen/>
  }

  return (
    <View style={styles.container}>
      <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_Tests} style={styles.content}>
        {isSidebarOpen && (
          <NurseSidebar
            navigation={navigation}
            email={email}
            activeRoute="NursePatient_Details"
          />
        )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>View Tests and their Results</Text>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderColor: "transparent" }}>
              <Row
                data={[
                  "S.No",
                  "Test Name",
                  "Result",
                  "Prescribed On",
                  "Action",
                ]}
                style={styles.tableHeader}
                textStyle={styles.headerText}
              />
              <Rows
                data={currentTests.map((test, index) => [
                  (currentPage - 1) * 10 + index + 1,
                  test.testName,
                  test.result,
                  test.prescribedOn,
                  <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={() => handleImage(test.id)}>
                      <MaterialIcons
                        name="file-upload"
                        size={24}
                        color="blue"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEdit(test.id)}>
                      <MaterialIcons name="edit" size={24} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(test.id)}>
                      <MaterialIcons name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  </View>,
                ])}
                textStyle={styles.tableText}
                style={styles.tableRow}
              />
            </Table>
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
            <SemicircleBackground style={styles.rbackground}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddTestResult", { patientId })
                }
                style={styles.footerItem}
              >
                <View style={styles.rfooterIconContainer}>
                  <FontAwesome name="plus" size={24} color="teal" />
                </View>
                <Text style={styles.footerText2}>Add</Text>
              </TouchableOpacity>
            </SemicircleBackground>
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
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 30,
    padding: 20,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 10,
    textAlign: "center",
    color: "teal",
  },
  tableContainer: {
    flex: 1,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  tableHeader: {
    height: 50,
    backgroundColor: "lightseagreen",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
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
    height: 40,
    backgroundColor: "ghostwhite",
    borderWidth: 1,
    borderColor: "plum",
    marginVertical: 5,
    borderRadius: 8, // Rounded corners
  },
  tableText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 90,
    marginLeft: 50,
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
