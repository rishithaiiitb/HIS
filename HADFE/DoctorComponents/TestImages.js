import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DoctorHeader from "./DoctorHeader";
import DoctorSideBar from "./DoctorSideBar";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConsent } from "../Context/ConsentContext";
import BG_Tests from "../Nurse_Comp_Images/BG_Tests.png";
import { MaterialIcons } from "@expo/vector-icons";
import { useEmail } from "../Context/EmailContext";
import LoadingScreen from "../Loading";

const TestImages = ({ route }) => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [testImages, setTestImages] = useState([]);
  const { consentToken } = useConsent();
  const patientId = route.params.patientId;
  const { email } = useEmail();
  const testId = route.params.testId;
  const [isLoading, setIsLoading] = useState(false);  

  useEffect(() => {
    fetchTestImages();
  }, []);

  const fetchTestImages = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/doctor/testImages/${testId}/${patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestImages(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
        console.error("Error fetching test images:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_Tests} style={styles.content}>
        {isSidebarOpen && (
          <DoctorSideBar
            navigation={navigation}
            // email={email}
            activeRoute="DoctorPatientDetails"
          />
        )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>
            View Images: For Selected Test Results
          </Text>
          <View style={styles.symptomImagesContainer}>
            {!testImages && <LoadingScreen />}
            {testImages && testImages.length > 0 ? (
              testImages.map((image, index) => (
                <View key={index} style={styles.symptomImageItem}>
                  <Image
                    source={{ uri: image.image }}
                    style={styles.image}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noImagesText}>No test images available</Text>
            )}
            {/* {testImages && testImages.length === 0 && (
              <Text style={styles.noImagesText}>No test images available</Text>
            )}

            {testImages &&
              testImages.length > 0 &&
              testImages.map((image, index) => (
                <View key={index} style={styles.symptomImageItem}>
                  <Image source={{ uri: image.image }} style={styles.image} />
                </View>
              ))} */}
          </View>
          <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text style={styles.footerText}>Back</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default TestImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    padding: 20,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 5,
    textAlign: "center",
    color: "teal",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  symptomImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 30,
  },
  symptomImageItem: {
    width: 300,
    height: 400,
    overflow: "hidden",
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "mediumturquoise",
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "mediumaquamarine",
  },
  addButton: {
    width: 50,
    height: 50,
    bieworderRadius: 25,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  addButton: {
    flexDirection: "row",
    width: "50%",
    height: 50,
    alignItems: "center",
    backgroundColor: "teal",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addSymptomsText: {
    fontSize: 18,
    marginLeft: 10,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  footerContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    marginTop: 0,
    color: "teal",
    fontSize: 24,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  noImagesText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
});