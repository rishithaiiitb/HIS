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
import BG_PastHistory from "../Nurse_Comp_Images/BG_PastHistory.png";
import LoadingScreen from "../Loading";
import { faL } from "@fortawesome/free-solid-svg-icons";

const PastImages = ({ route }) => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pastImages, setPastImages] = useState([]);
  const patientId = route.params.patientId;
  const historyId = route.params.historyId;
  const { consentToken } = useConsent();
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    fetchPastImages();
  }, []);

  const fetchPastImages = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/doctor/pastImages/${historyId}/${patientId}/${consentToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPastImages(response.data);
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
        console.error("Error fetching past images:", error);
      }
    }
  };
  // console.log(pastImages);
  if(isLoading)
  {
    return <LoadingScreen />;
  }
    return (
      <View style={styles.container}>
        <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
        <ImageBackground source={BG_PastHistory} style={styles.content}>
          {isSidebarOpen && (
            <DoctorSideBar
              navigation={navigation}
              activeRoute="DoctorPatientDetails"
            />
          )}
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.heading}>
              View Images: For Selected Past History
            </Text>
            <View style={styles.symptomImagesContainer}>
            {pastImages && pastImages.length>0 ? (pastImages.map((image, index) => (
              <View key={index} style={styles.symptomImageItem}>
                <Image source={{ uri: image.pastImg }} style={styles.image} />
              </View>
                ))) :
                (
                  <Text style={styles.noImagesText}>No past images available</Text>

                )
              }
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
//   return (
//     <View style={styles.container}>
//       <DoctorSideBar onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
//       <ImageBackground source={BG_PastHistory} style={styles.content}>
//         {isSidebarOpen && (
//           <DoctorSideBar
//             navigation={navigation}
//             activeRoute="DoctorPatientDetails"
//           />
//         )}
//         <ScrollView contentContainerStyle={styles.scrollView}>
//           <Text style={styles.heading}>
//             View Images: For Selected Medical History
//           </Text>
//           {/* <TouchableOpacity style={styles.addButton} onPress={() => handleadd(historyId)}>
//             <MaterialIcons name="add" size={24} color="white" />
//             <Text style={styles.addSymptomsText}>Add Medical Images</Text>
//           </TouchableOpacity> */}
//           <View style={styles.symptomImagesContainer}>
//             {pastImages.map((image, index) => (
//               <View key={index} style={styles.symptomImageItem}>
//                 <Image source={{ uri: image.pastImg }} style={styles.image} />
//                 {/* <View style={styles.actionContainer}>
//                                   <TouchableOpacity onPress={() => handleEdit(image.imgId)}>
//                                       <MaterialIcons name="edit" size={24} color="blue" />
//                                   </TouchableOpacity>
//                                   <TouchableOpacity onPress={() => handleDelete(image.imgId)}>
//                                       <MaterialIcons name="delete" size={24} color="red" />
//                                   </TouchableOpacity>
//                </View> */}
//               </View>
//             ))}
//           </View>
//           <View style={styles.footerContainer}>
//             <TouchableOpacity
//               onPress={() => navigation.navigate("PastHistory", { patientId })}
//             >
//               <Text style={styles.footerText}>Back</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </ImageBackground>
//     </View>
//   );
// };

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
  }
});

export default PastImages;