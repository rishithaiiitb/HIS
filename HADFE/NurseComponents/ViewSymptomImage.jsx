import React, { useState, useEffect,useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Alert,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import { API_BASE_URL } from "../config";
import BG_SymptomImages from "../Nurse_Comp_Images/BG_SymptomImages.jpg";
import { useConsent } from "../Context/ConsentContext";
import LoadingScreen from "../Loading";

export default function ViewSymptomImage({ navigation, route }) {
  const { patientId } = route.params;
  const [patientImages, setPatientImages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { email } = useEmail();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { consentToken } = useConsent();
  const[loadComp,setLoadComp] = useState(false);

  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        setLoadComp(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/nurse/viewSymptomImages/${patientId}/${consentToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLoading(false);
        setPatientImages(response.data);
        setLoadComp(false);
      } catch (error) {
        setLoadComp(false);
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
          console.error("Error fetching patient symptom images:", error);
          setIsLoading(false);
        }
      }
    };
    if (isLoading) {
      fetchPatientImages();
    }
  }, [patientId, isLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
    });
    return unsubscribe;
  }, [navigation]);
  const handleEdit = (id) => {
    navigation.navigate("EditSymptomImage", { patientId, id });
  };
  const handleadd = (patientId) => {
    navigation.navigate("AddSymptomImages", { patientId });
  };

  if(loadComp)
  {
    return <LoadingScreen/>
  }

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/nurse/deleteSymptomImages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(true);
      Alert.alert("Symptom image deleted successfully")
      navigation.navigate("ViewSymptomImage", { patientId });
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
        console.error("Error deleting symptom image:", error);
      }
    }
  };

  const handleFullScreen = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_SymptomImages} style={styles.content}>
        {isSidebarOpen && (
          <NurseSidebar
            navigation={navigation}
            email={email}
            activeRoute="NursePatient_Details"
          />
        )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>
            View Symptoms: Exploring Patient Expressions
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleadd(patientId)}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.addSymptomsText}>Add More Symptoms</Text>
          </TouchableOpacity>
          <View style={styles.symptomImagesContainer}>
            {patientImages && patientImages.length>0 ?(patientImages.map((image, index) => (
              <View key={index} style={styles.symptomImageItem}>
                <Image source={{ uri: image.image }} style={styles.image} />
                <Text style={styles.description}>{image.description}</Text>
                <View style={styles.actionContainer}>
                  <TouchableOpacity onPress={() => handleEdit(image.id)}>
                    <MaterialIcons name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(image.id)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))) : (
              <Text style={styles.noImagesText}>No symptom images available</Text>
            )}
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("NursePatient_Dashboard", { patientId })
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
    height: "80%",
    resizeMode: "cover",
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "mediumaquamarine",
  },
  description: {
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "lightyellow",
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
