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
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import BG_PastHistory from "../Nurse_Comp_Images/BG_PastHistory.png";

export default function CapturePastImage({ navigation, route }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const photo = useState(null);
  const patientId = route.params.patientId;
  const historyId = route.params.historyId;
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
      navigation.navigate("AddPastImage", {
        photo: image,
        patientId: patientId,
        historyId: historyId,
      });
    }
  }
  if (image) {
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
      <ImageBackground source={BG_PastHistory} style={styles.content}>
        {isSidebarOpen && (
          <NurseSidebar
            navigation={navigation}
            email={email}
            activeRoute="NursePatient_Details"
          />
        )}
        <View style={styles.camContainer}>
          <Text style={styles.heading}>Capture Past Image</Text>
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
    alignItems: "center",
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
    backgroundColor: "teal",
    borderRadius: 5,
    width: 100,
    height: 40,
    marginHorizontal: 30,
    padding: 10,
    backgroundColor: "teal",
    borderRadius: 5,
    alignContent: "center",
  },
  saveButtons: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    marginHorizontal: 180,
  },
  text1: {
    fontSize: 18,
    color: "white",
    marginHorizontal: "auto",
    marginVertical: "auto",
  },
});
