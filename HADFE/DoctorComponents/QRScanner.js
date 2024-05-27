import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Camera from "expo-camera";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEmail } from "../Context/EmailContext";
import DoctorHeader from "./DoctorHeader";
import DoctorSideBar from "./DoctorSideBar";
import { useConsent } from "../Context/ConsentContext";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useIsFocused } from "@react-navigation/native"; 

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patient, setPatient] = useState(null);
  const navigation = useNavigation();
  const { email } = useEmail();
  const { updateConsent } = useConsent();
  const isFocused = useIsFocused(); 


  useEffect(() => {
    (async () => {
      const { status } =  Camera.useCameraPermissions();
      setHasPermission(status === "granted");
      setShowScanner(false); 
    })();
  }, []);
  useEffect(() => {
    if (isFocused) {
      setShowScanner(false); 
      setScannedData(null);
    }
  }, [isFocused]);

  const fetchConsentToken = async (patientId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token available");
      }
      const consentresponse = await fetch(
        `${API_BASE_URL}/doctor/getConsentToken/${patientId}`,
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setApiResponse(null);

        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/doctor/viewAdmitted/${scannedData}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApiResponse(response.data);
        if (!response.data) {
          Alert.alert("No patient found with this bed id");
        } else {
          fetchPatient(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchPatient = async (patientId) => {
      try {
        const consentToken = await fetchConsentToken(patientId);
        if (!consentToken) {
          console.error("No consent token retrieved");
          return;
        }
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/doctor/viewDetails/${email}/${patientId}/${consentToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedPatient = response.data;
        setPatient(fetchedPatient);
        // setApiResponse(null);
        updateConsent(consentToken);
        navigation.navigate("DoctorPatientDashboard", {
          patientId: fetchedPatient.patientId,
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Alert.alert("Error", "Unauthorized to view this patient");
        } else {
          console.log(error);
        }
      }
    };

    if (scannedData) {
      fetchData();
     // setApiResponse("");
    }
  }, [scannedData]);

  const handleBarcodeScan = ({ type, data }) => {
    setScannedData(data);
    setShowScanner(false);
  };

  const startScan = () => {
    setShowScanner(true);
  };

  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <DoctorSideBar
            navigation={navigation}
            isSidebarOpen={isSidebarOpen}
            activeRoute="QRScanner"
          />
        )}
        <View style = {styles.qrContainer}>
        <View>
          <Text style = {styles.heading1}>QR Code Scanner</Text>
        </View>
        <View style={styles.maincontainer}>
          {showScanner ? (
            <View style={styles.cameraContainer}>
              {hasPermission === null ? (
                <Text>Requesting camera permission</Text>
              ) : hasPermission === false ? (
                <Text>No access to camera</Text>
              ) : (
                <BarCodeScanner
                  onBarCodeScanned={handleBarcodeScan}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
            </View>
          ) : (
            <TouchableOpacity onPress={startScan} style={styles.button}>
              <Text style={styles.buttonText}>Scan QR Code</Text>
            </TouchableOpacity>
          )}
          {/* {scannedData && (
            <View style={styles.dataContainer}>
              {apiResponse && (
                <Text>PatientId: {JSON.stringify(apiResponse)}</Text>
              )}
            </View>
          )} */}
        </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  maincontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    width: "60%",
    height:"100%",
    marginLeft:0,
    marginTop: -20,
  },
  dataContainer: {
    marginTop: 10,
    marginLeft:0,
  },
  heading1: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -10,
    marginBottom: 10,
    textAlign: "center",
    color: "teal",
    padding: 20,
  },
  button: {
    // Added styles for the button
    backgroundColor: "#008080", // Teal color
    padding: 10, // Padding around the text
    borderRadius: 5, // Rounded corners of the button
    alignItems:'centre',
    marginLeft:0,

  },
  buttonText: {
    // Text styling inside the button
    color: "white", // White text color
    textAlign: "center", // Center text horizontally
    fontSize: 16, // Text size
  },
  qrContainer: {
    flex: 1,
    flexDirection: 'column',
  }
  
});

export default ScanScreen;
