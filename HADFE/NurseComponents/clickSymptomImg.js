import { Camera, CameraType } from "expo-camera/legacy";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEmail } from "../Context/EmailContext";
// import BG_SymptomImages from "../Nurse_Comp_Images/BG_SymptomImages.png";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import BG_SymptomImages from "../Nurse_Comp_Images/BG_Tests.png";

export default function CaptureImageScreen({ navigation, route }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const photo = useState(null);
  const patientId = route.params.patientId;
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const photoResult = await cameraRef.current.takePictureAsync(options);
      setImage(`data:image/jpeg;base64,${photoResult.base64}`);
    }
  }

  function saveImageAndNavigate() {
    if (image) {
      navigation.navigate("AddSymptomImages", {
        photo: image,
        patientId: patientId,
      });
    }
  }
  if (image) {
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
          <View style={styles.camContainer}>
            <Text style={styles.heading}>Captured Symptom Image</Text>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.button}
              onPress={saveImageAndNavigate}
            >
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (image) {
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
          <View style={styles.camContainer1}>
            <Text style={styles.heading}>Captured Test Image</Text>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </View>

          <View style={styles.saveButtons}>
            <TouchableOpacity
              style={styles.button1}
              onPress={saveImageAndNavigate}
            >
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
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
        <View style={styles.camContainer}>
          <Text style={styles.heading}>Captured Symptom Image</Text>
          <Camera ref={cameraRef} style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>Capture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.text}>Back</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      flexDirection: "column",
    },
    camContainer: {
      flex: 1,
      flexDirection: "column",
    },
    camContainer1: {
      flex: 1,
      flexDirection: "column",
      height: "80%",
    },
    camera: {
      flex: 1,
      height: "70%",
      marginVertical: 50,
      marginHorizontal: 100,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    button: {
      padding: 10,
      backgroundColor: "teal",
      borderRadius: 5,
    },
    text: {
      fontSize: 18,
      color: "white",
      textAlign: "center",
    },
    imagePreview: {
      flex: 1,
      width: "100%",
      resizeMode: "contain",
    },
    content: {
      flex: 1,
      flexDirection: "row",
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
    button1: {
      width: "30%", // Set width to 30% of the container
      padding: 10,
      backgroundColor: "teal",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    saveButtons: {
    //   position: "absolute",
      bottom: 20,
    //   left: "20%", // Set left to 20% to center the buttons within the view
    //   right: "20%", // Set right to 20% to center the buttons within the view
      flexDirection: "row",
    //   justifyContent: "space-between", // This will place some space between the buttons
    },
    text1: {
      fontSize: 18,
      color: "white",
    },
  });
  