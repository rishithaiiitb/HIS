import React, { useState, useEffect,useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { Platform } from "react-native";
import { API_BASE_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImage, faUpload,faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesome } from "@expo/vector-icons";
import BG_PastHistory from "../Nurse_Comp_Images/BG_PastHistory.png";

export default function AddPastImage({ navigation, route }) {
  const [pastImg, setImageUrl] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const { email } = useEmail();
  const historyId = route.params.historyId;
  const patientId = route.params.patientId;

  const SemicircleBackground = ({ children, style }) => {
    return <View style={[styles.background, style]}>{children}</View>;
  };



  const handleCaptureImage = async () => {
    navigation.navigate('CapturePastImage', { patientId, historyId });
  };

  const setPhoto = useCallback((photo) => {
    console.log("in preview:", photo);
    setPreviewImage(photo);
    setImageUrl(photo);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const photo = route.params?.photo; // Get the photo from navigation parameters
      if (photo) {
        setPhoto(photo);
        navigation.setParams({ photo: null });
      }
    }, [route.params?.photo, navigation, setPhoto])
  );


  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        const selectedImageUri = selectedAsset.uri;

        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setPreviewImage(base64String);
          setImageUrl(base64String);
        };
        reader.readAsDataURL(blob);
      } else {
        Alert.alert("Image picking cancelled", "You cancelled image picking.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image");
    }
  };

  const handleImageUpload = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/nurse/addPastImages/${historyId}`,
        { pastImg },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPreviewImage(null);
      console.log("Image uploaded successfully");

      Alert.alert("Success", "Image uploaded successfully");
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
        console.error("Error uploading image:", error);
        Alert.alert("Error", "Failed to upload image");
      }
    }
  };

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
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.headerText}>Upload Medical History Images</Text>
          <View style={styles.formContent}>
            <View style={styles.leftContent}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleCaptureImage}
              >
                <FontAwesomeIcon icon={faCamera} style={styles.icon} />
                <Text style={styles.buttonText}>Click Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <FontAwesomeIcon icon={faImage} style={styles.icon} />
                <Text style={styles.buttonText}>
                  Pick an image from gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { opacity: previewImage ? 1 : 0.5 }]}
                onPress={handleImageUpload}
                disabled={!previewImage}
              >
                <FontAwesomeIcon icon={faUpload} style={styles.icon} />
                <Text style={styles.buttonText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
            {previewImage && (
              <View style={styles.rightContent}>
                <Image
                  source={{ uri: previewImage }}
                  style={styles.imagePreview}
                />
              </View>
            )}
          </View>
          <View style={styles.footerContainer}>
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

            <SemicircleBackground style={styles.rbackground}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ViewPastImage", { patientId, historyId })
                }
                style={styles.footerItem}
              >
                <View style={styles.rfooterIconContainer}>
                  <FontAwesome name="eye" size={24} color="teal" />
                </View>
                <Text style={styles.footerText2}>View</Text>
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
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
    padding: 20,
  },
  formContainer: {
    padding: 20,
  },
  formContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
    alignItems: "center",
  },
  rightContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "teal",
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 80,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
  icon: {
    marginRight: 10,
    color: "#fff",
  },
  input: {
    height: 100,
    marginBottom: 30,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    fontSize: 18,
  },
  imagePreview: {
    width: 400,
    height: 400,
    resizeMode: "cover",
    marginBottom: 50,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "teal",
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
    marginTop: 30,
  },
});
