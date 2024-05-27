import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { useEmail } from "../Context/EmailContext";
import { API_BASE_URL } from "../config";
import BG_Tests from "../Nurse_Comp_Images/BG_Tests.png";
import { useConsent } from "../Context/ConsentContext";
import LoadingScreen from "../Loading";
import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function ViewTestImage({ navigation, route }) {
  const { patientId } = route.params;
  const { id } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [patientImages, setPatientImages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { email } = useEmail();
  const { consentToken } = useConsent();
  const[loadComp,setLoadComp] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/nurse/viewTestImages/${id}/${patientId}/${consentToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatientImages(response.data);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          Alert.alert(
            "Error",
            "Session Expired. Please log in again.",
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
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      setIsLoading(true);
      fetchPatientImages();
    }
  }, [isFocused,isLoading]);


  const handleEdit = (testimageId) => {
    navigation.navigate("EditTestImage", { id, testimageId, patientId });
  };
  const handleadd = (id) => {
    navigation.navigate("AddTestImage", { patientId, id });
  };

  const handleDelete = async (testimageId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/nurse/deleteTestImage/${testimageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) { // Check if the deletion was successful
        Alert.alert("Success", "Deleted test image successfully");
        setIsLoading(true); // Trigger a re-fetch
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
        console.error("Error deleting image:", error);
      }
    }
  };
  

  if(loadComp)
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
          <Text style={styles.heading}>
            View Images: For Selected Test Results
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleadd(id)}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.addSymptomsText}>Add Test Images</Text>
          </TouchableOpacity>
          <View style={styles.symptomImagesContainer}>
            {patientImages && patientImages.length>0 ? (patientImages.map((image, index) => (
              <View key={index} style={styles.symptomImageItem}>
                <Image source={{ uri: image.image }} style={styles.image} />
                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    onPress={() => handleEdit(image.testimageId)}
                  >
                    <MaterialIcons name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(image.testimageId)}
                  >
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))) : (
              <Text style={styles.noImagesText}>No test images available</Text>
            )}
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() =>
                // navigation.navigate("NursePatient_Dashboard", {
                //   patientId: route.params.patientId,
                // })
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
}

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
    height: "90%",
    resizeMode: "cover",
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "mediumaquamarine",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    backgroundColor: "powderblue",
    paddingVertical: 10,
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'red', 
  },
});