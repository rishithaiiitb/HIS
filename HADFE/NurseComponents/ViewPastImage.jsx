import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { useEmail } from "../Context/EmailContext";
import { API_BASE_URL } from "../config";
import BG_PastHistory from "../Nurse_Comp_Images/BG_PastHistory.png";
import { useConsent } from "../Context/ConsentContext";
import LoadingScreen from "../Loading";

export default function ViewPastImage({ navigation, route }) {
  const { patientId } = route.params;
  const { historyId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [patientImages, setPatientImages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { email } = useEmail();
  const { consentToken } = useConsent();
  const[loadComp,setLoadComp] = useState(false);

  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        setLoadComp(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/nurse/viewPastImages/${patientId}/${historyId}/${consentToken}`,
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
          console.error("Error fetching past history images:", error);
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
  const handleEdit = (imgId) => {
    navigation.navigate("EditPastImage", { historyId, imgId, patientId });
  };
  const handleadd = (historyId) => {
    navigation.navigate("AddPastImage", { patientId, historyId });
  };

  const handleDelete = async (imgId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/nurse/deletePastImages/${imgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(true);
      navigation.navigate("ViewPastImage", { patientId,historyId });
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
        console.error("Error deleting past image:", error);
      }
    }
  };

  if(loadComp)
  {
    return <LoadingScreen />
  }

  return (
    <View style={styles.container}>
    <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
    <ImageBackground source={BG_PastHistory} style={styles.content}>
      {isSidebarOpen && (
        <NurseSidebar
          navigation={navigation}
          email={email}
          activeRoute="NursePatient_Details"
        />
      )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>
            View Images: For Selected Medical History
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleadd(historyId)}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.addSymptomsText}>Add Medical Images</Text>
          </TouchableOpacity>
          <View style={styles.symptomImagesContainer}>
            {patientImages && patientImages.length>0 ? (patientImages.map((image, index) => (
              <View key={index} style={styles.symptomImageItem}>
                <Image source={{ uri: image.pastImg }} style={styles.image} />
                <View style={styles.actionContainer}>
                  <TouchableOpacity onPress={() => handleEdit(image.imgId)}>
                    <MaterialIcons name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(image.imgId)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))) :(
              <Text style={styles.noImagesText}>No past images available</Text>
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
