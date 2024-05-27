import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert, Image,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PharmacyHeader from "./PharmacyHeader";
import PharmacySidebar from "./PharmacySidebar";
import { API_BASE_URL } from "../config";
import { useEmail } from "../Context/EmailContext";
import { useConsent } from '../Context/ConsentContext';

export default function ViewMedication({ navigation }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [medications, setMedications] = useState([]);
  const [search, setSearch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [canvasList, setCanvasList] = useState([]);
  const {consentToken} = useConsent();
    //const [isLoading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // useEffect(() => {
  //   fetchCanvasData();
  // }, []);

  
  const fetchConsentToken = async () => {
    try {
      const token = await AsyncStorage.getItem("pharmacytoken");
      if (!token) {
        throw new Error("No authentication token available");
      }
      const consentresponse = await fetch(
        `${API_BASE_URL}/pharmacy/getConsentToken/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!consentresponse.ok) {
        throw new Error(
          `Failed to fetch the consent token. Status: ${consentresponse.status}`
        );
      }
      return await consentresponse.text();
    } catch (error) {
      console.error("Error fetching consent details:", error);
      return null;
    }
  };

  const fetchCanvasData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("pharmacytoken");
      // const patientId = "P001"; // This should be dynamic based on your app's context
      // const consentToken = await fetchConsentToken(patientId);
      // if (!token || !consentToken) throw new Error("Authentication required.");

      const response = await fetch(`${API_BASE_URL}/pharmacy/viewCanvas/${patientId}/${consentToken}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (!response.ok) throw new Error(`Failed to fetch canvases: ${response.status}`);

      const resultText = response.json; // First get text to avoid JSON parse error
    try {
      const result = JSON.parse(resultText); // Safely parse JSON
      setCanvasList(result);
    } catch (error) {
      console.error("Failed to parse JSON", error);
      throw new Error("Invalid JSON response received");
    }
  } catch (error) {
    console.error("Error fetching canvases:", error);
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = async () => {
    setLoading(true);
    setMedications([]);
    setCanvasList([]);
    const patientIdPattern = /^P\d{3}$/;
    if (!patientIdPattern.test(patientId)) {
      Alert.alert(
        "Invalid Patient ID",
        "Patient ID should start with P followed by three numbers."
      );
      return;
    }
    try {
      const consentToken = await fetchConsentToken();
      if (!consentToken) {
        console.error("No consent token retrieved");
        return;
      }
      const token = await AsyncStorage.getItem("pharmacytoken");
      const response = await axios.get(
        `${API_BASE_URL}/pharmacy/viewMedication/${patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMedications(response.data);
      setLoading(false);
      setSearch(true);

      // const token = await AsyncStorage.getItem("pharmacytoken");
      // const patientId = "P001"; // This should be dynamic based on your app's context
      // const consentToken = await fetchConsentToken(patientId);
      // if (!token || !consentToken) throw new Error("Authentication required.");

      const response1 = await fetch(`${API_BASE_URL}/pharmacy/viewCanvas/${patientId}/${consentToken}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response1);
      if (!response1.ok) throw new Error(`Failed to fetch canvases: ${response.status}`);

      const resultText = await response1.json(); // First get text to avoid JSON parse error
    try {
      // const result = JSON.parse(resultText); // Safely parse JSON
      console.log(resultText);
      setCanvasList(resultText);
    } catch (error) {
      console.error("Failed to parse JSON", error);
      throw new Error("Invalid JSON response received");
    }
   
    } catch (error) {
      console.error("Error fetching medications:", error);
      if (error.response && error.response.status === 500) {
        Alert.alert(
          "Error",
          "Session Expired !!Please Log in again",
          [
            {
              text: "OK",
              onPress: () =>
                AsyncStorage.removeItem("pharmacytoken").then(() =>
                  navigation.navigate("HomePage")
                ),
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  const handleServeMedication = async (medicineId) => {
    try {
      const token = await AsyncStorage.getItem("pharmacytoken");
      const response = await axios.put(
        `${API_BASE_URL}/pharmacy/serve/${medicineId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert(
        "Medication Served",
        "The medication has been served successfully."
      );
      handleSearch();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Alert.alert(
          "Error",
          "Session Expired !!Please Log in again",
          [
            {
              text: "OK",
              onPress: () => {
                AsyncStorage.removeItem("pharmacytoken");
                navigation.navigate("HomePage");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error("Error serving medication:", error);
        Alert.alert("Error", "Failed to serve medication. Please try again.");
      }
    }
  };


  const handleServePrescription = async (canvasId) => {
    try {
      const token = await AsyncStorage.getItem("pharmacytoken");
      const response = await axios.put(
        `${API_BASE_URL}/pharmacy/serveCanvas/${canvasId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert(
        "Medications in Prescription Served",
        "The medications in the Prescription has been served successfully."
      );
      handleSearch();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Alert.alert(
          "Error",
          "Session Expired !!Please Log in again",
          [
            {
              text: "OK",
              onPress: () => {
                AsyncStorage.removeItem("pharmacytoken");
                navigation.navigate("HomePage");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error("Error serving medication:", error);
        Alert.alert("Error", "Failed to serve medication. Please try again.");
      }
    }
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <Text style={styles.medicationName}>{item.medicineName}</Text>
      <View style={styles.medicationDetails}>
        <Text style={styles.detailLabel}>Prescribed Date:</Text>
        <Text style={styles.detailText}>{item.prescribedOn}</Text>
      </View>
      <View style={styles.medicationDetails}>
        <Text style={styles.detailLabel}>Dosage:</Text>
        <Text style={styles.detailText}>{item.dosage}</Text>
      </View>
      <View style={styles.medicationDetails}>
        <Text style={styles.detailLabel}>Frequency:</Text>
        <Text style={styles.detailText}>{item.frequency}</Text>
      </View>
      <TouchableOpacity
        style={styles.serveButton}
        onPress={() => handleServeMedication(item.medicineId)}
      >
        <Text style={styles.serveButtonText}>Serve</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCanvasItem = ({ item }) => (
    <View style={styles.medicationItem}>
      {item.image ? (
        <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.canvasImage} />
      ) : (
        <Text style={styles.noMedicationsText}>No prescription found.</Text>
      )}
      {item.image && (
        <TouchableOpacity
          style={styles.serveButton}
          onPress={() => handleServePrescription(item.canvasId)}
        >
          <Text style={styles.serveButtonText}>Serve Prescription</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <PharmacyHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <PharmacySidebar
            navigation={navigation}
            email={email}
            activeRoute="PharmacyPatient_Details"
          />
        )}
        <ScrollView style={styles.prescription}>
        <FlatList
          ListHeaderComponent={
            <ImageBackground
              source={{
                uri: "https://png.pngtree.com/background/20210710/original/pngtree-flat-cartoon-medical-blue-banner-poster-background-picture-image_1040368.jpg",
              }}
              style={styles.image}
            >
              <View style={styles.searchContainer}>
                <Text style={styles.infoText}>
                  Enter the Patient ID to view medications prescribed
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Patient ID"
                  value={patientId}
                  onChangeText={setPatientId}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          }
          data={search ? medications : []} // Ensures FlatList does not try to render when no search has been made
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMedicationItem}
          ListFooterComponent={
            isLoading ? (
              <Text style = {styles.loading}>Loading Medications...</Text>
            ) : null
          }
          ListEmptyComponent={
            search && !isLoading && medications.length === 0 ? (
              <Text style={styles.noMedicationsText}>
                No medications found for the patient.
              </Text>
            ) : null
          }

          
        />

        {/* {search && canvasList.length > 0 ? (
        <View style={styles.medicationItem}>
        <FlatList
        data={canvasList}
        keyExtractor={(item, index) => `canvas-${index}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `data:image/png;base64,${item.image}` }}
            style={styles.canvasImage}
          />
        )}
        // ListEmptyComponent={<Text>No canvas available.</Text>}
        ListFooterComponent={isLoading ? <Text>Loading...</Text> : null}
      />
      <TouchableOpacity
        style={styles.serveButton}
        onPress={() => handleServePrescription(item.canvasId)}
      >
        <Text style={styles.serveButtonText}>Serve</Text>
      </TouchableOpacity>
      </View>):(
          <Text style={styles.noMedicationsText}>No prescription found.</Text>
        )} */}
        {search && canvasList.length === 0 && <Text style={styles.noMedicationsText}>No prescription found.</Text>}
        {search && canvasList.length > 0 && (
          <FlatList
            data={canvasList}
            keyExtractor={(item, index) => `canvas-${index}`}
            renderItem={renderCanvasItem}
            ListEmptyComponent={
              search && canvasList.length === 0 && (
                <Text style={styles.noMedicationsText}>No prescription found.</Text>
              )
            }
          />
        )}
      </ScrollView>
      </View>
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
    width: '100%',
    // backgroundColor: '#ffffff',
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  prescription:{
    flex: 1,
    //flexDirection: "row",
    width: '100%',
  },
  searchContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 150,
  },
  infoText: {
    marginBottom: 10,
    marginRight: 50,
    fontSize: 18,
    color: "teal",
  },
  image: {
    width: "100%",
    height: 400, // Adjust height as needed
    alignItems: "center", // Align input and delete button vertically
    justifyContent: "space-between",
  },
  input: {
    flexDirection: "row", // Add flexDirection to align input and delete button horizontally
    alignItems: "center", // Align input and delete button vertically
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    marginRight: 50,
    height: 50,
    width: 400,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "teal",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 100,
    marginRight: 50,
    marginTop: 20,
  },
  searchButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  medicationContainer: {
    flex: 1,
    padding: 20,
  },
  medicationHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "teal",
  },
  medicationItem: {
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "lightgoldenrodyellow",
    shadowColor: "teal",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "lightseagreen",
  },
  medicationDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  detailText: {
    fontSize: 16,
  },
  serveButton: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  serveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noMedicationsText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 20,
  },
  loading: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 13,
  },
  canvasImage: {
    width: "100%",
    height: 640,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});
