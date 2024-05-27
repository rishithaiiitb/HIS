import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmail } from "../Context/EmailContext";
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { API_BASE_URL } from "../config";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import BG_Vitals from "../Nurse_Comp_Images/BG_Vitals.png";

export default function AddVitals({ navigation, route }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [vitals, setVitals] = useState({
    temperature: "",
    weight: "",
    height: "",
    bp: "",
    spo2: "",
    pulse: "",
  });
  const patientId = route.params.patientId;

  const handleChange = (key, value) => {
    setVitals({ ...vitals, [key]: value });
  };

  const SemicircleBackground = ({ children, style }) => {
    return <View style={[styles.background, style]}>{children}</View>;
  };

  const handleSubmit = async () => {
    try {
      if (!validateInputs()) {
        return;
      }
      const bpValue = `${vitals.systolic}/${vitals.diastolic}`;
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/nurse/addVitals/${patientId}`,
        {
          temperature: vitals.temperature,
          weight: vitals.weight,
          height: vitals.height,
          bp: bpValue,
          spo2: vitals.spo2,
          pulse: vitals.pulse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Vitals added successfully:", response.data);
      Alert.alert("Vitals Added sucessfully");
      setVitals({
        temperature: "",
        weight: "",
        height: "",
        bp: "",
        spo2: "",
        pulse: "",
      });
      navigation.navigate('viewVitals',{patientId});
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
        console.error("Error adding vitals:", error);
      }
    }
  };

  const renderErrorMessage = (errorMessage) => (
    <Text style={[styles.errorMessage, { color: "red" }]}>{errorMessage}</Text>
  );

  const validateInputs = () => {
    const weightRegex = /^([1-9]\d{0,1}|[1-3]\d{2}|400)(\.\d)?$/; // Matches numbers between 1 and 400
    const heightRegex = /^([4-9]\d|1\d{2}|2\d{2}|300)(\.\d)?$/; // Matches numbers between 40 and 300
    const systolicRegex = /^([7-9]\d|1\d{2}|2\d{2}|300)(\.\d)?$/; // Matches numbers between 70 and 300
    const diastolicRegex = /^([3-9]\d|1\d{2}|2[0-5]\d|260)(\.\d)?$/; // Matches numbers between 30 and 260
    const spo2Regex = /^(100(\.0+)?|[7-9]\d{1}(\.\d+)?)$/; // Accepts 100 or numbers between 70 and 99.9
    const pulseRegex = /^(200|1\d{2}|[2-9]\d)(\.\d)?$/;
    // Matches numbers between 20 and 200
    const temperatureRegex = /^([9]\d|[1][0-0][0-8])(\.\d)?$/; // Matches numbers between 90 and 108

    if (!weightRegex.test(vitals.weight)) {
      showAlert(
        "Invalid input",
        "Weight must be a positive number between 1 and 400, with up to 1 decimal place."
      );
      return false;
    }

    if (!heightRegex.test(vitals.height)) {
      showAlert(
        "Invalid input",
        "Height must be a positive number between 40 and 300, with up to 1 decimal place."
      );
      return false;
    }

    if (!pulseRegex.test(vitals.pulse)) {
      showAlert(
        "Invalid input",
        "Pulse must be a positive number between 20 and 200, with up to 1 decimal place."
      );
      return false;
    }

    if (!spo2Regex.test(vitals.spo2)) {
      showAlert(
        "Invalid input",
        "SpO2 must be a positive number between 70 and 100, with up to 1 decimal place."
      );
      return false;
    }

    // if (!bpRegex.test(vitals.bp)) {
    //     showAlert('Invalid input', 'BP must be in the format "systolic/diastolic"');
    //     return false;
    // }

    if (!systolicRegex.test(vitals.systolic)) {
      showAlert(
        "Invalid input",
        "Systolic BP must a positive number between 70 and 300, with up to 1 decimal place."
      );
      return false;
    }
    if (!diastolicRegex.test(vitals.diastolic)) {
      showAlert(
        "Invalid input",
        "Diastolic BP must a positive number between 30 and 260, with up to 1 decimal place."
      );
      return false;
    }

    if (!temperatureRegex.test(vitals.temperature)) {
      showAlert(
        "Invalid input",
        "Temperature must be a positive number between 90 and 108, with up to 1 decimal place."
      );
      return false;
    }

    return true;
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const handleIncrement = (key, maxValue) => {
    const currentValue = parseFloat(vitals[key]);
    if (currentValue < maxValue) {
      setVitals({ ...vitals, [key]: (currentValue + 1).toString() });
    }
  };

  const handleDecrement = (key, minValue) => {
    const currentValue = parseFloat(vitals[key]);
    if (currentValue > minValue) {
      setVitals({ ...vitals, [key]: (currentValue - 1).toString() });
    }
  };

  const CustomSlider = ({ value, onValueChange, minValue, maxValue }) => (
    <View style={styles.sliderContainer}>
      <Slider
        style={{ width: 400, height: 40 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={1}
        value={parseFloat(value)}
        onValueChange={onValueChange}
        minimumTrackTintColor="lightseagreen"
        maximumTrackTintColor="plum"
        thumbTintColor="teal"
      />
      <View style={styles.sliderRangeContainer}>
        <Text style={styles.rangeText}>Min: {minValue}</Text>
        <Text style={styles.rangeText}>Max: {maxValue}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={BG_Vitals} style={styles.content}>
        {isSidebarOpen && (
          <NurseSidebar
            navigation={navigation}
            email={email}
            activeRoute="NursePatient_Details"
          />
        )}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.formcontent}>
            <Text style={styles.heading}>Record Patient Vitals</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Weight (<Text style={styles.italicText}>in kg</Text>):
                    <Text style={styles.redStar}>*</Text>
                  </Text>
                  <View style={styles.inputWithIcon}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("weight", 1)}
                    >
                      <FontAwesome
                        name="minus"
                        size={20}
                        color={
                          parseFloat(vitals.weight) === 1 ? "lightgrey" : "teal"
                        }
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => handleChange("weight", text)}
                      value={vitals.weight}
                      placeholder="Weight"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <TouchableOpacity
                      onPress={() => handleIncrement("weight", 400)}
                    >
                      <FontAwesome
                        name="plus"
                        size={20}
                        color={
                          parseFloat(vitals.weight) === 400
                            ? "lightgrey"
                            : "teal"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <CustomSlider
                    value={vitals.weight}
                    onValueChange={(value) =>
                      handleChange("weight", value.toString())
                    }
                    minValue={1}
                    maxValue={400}
                  />
                  {vitals.weight !== "" &&
                    !/^([1-9]\d{0,1}|[1-3]\d{2}|400)(\.\d{1,2})?$/.test(
                      vitals.weight
                    ) &&
                    renderErrorMessage(
                      "Weight must be a positive number between 1 and 400, with up to 2 decimal place."
                    )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Pulse:<Text style={styles.redStar}>*</Text>
                  </Text>
                  <View style={styles.inputWithIcon}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("pulse", 20)}
                    >
                      <FontAwesome
                        name="minus"
                        size={20}
                        color={
                          parseFloat(vitals.pulse) === 20 ? "lightgrey" : "teal"
                        }
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => handleChange("pulse", text)}
                      value={vitals.pulse}
                      placeholder="Pulse"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <TouchableOpacity
                      onPress={() => handleIncrement("pulse", 200)}
                    >
                      <FontAwesome
                        name="plus"
                        size={20}
                        color={
                          parseFloat(vitals.pulse) === 200
                            ? "lightgrey"
                            : "teal"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <CustomSlider
                    value={vitals.pulse}
                    onValueChange={(value) =>
                      handleChange("pulse", value.toString())
                    }
                    minValue={20}
                    maxValue={200}
                  />
                  {vitals.pulse !== "" &&
                    !/^([2-9]\d{1}|1\d{2}|200)$/.test(vitals.pulse) &&
                    renderErrorMessage(
                      "Pulse must be a positive number between 20 and 200"
                    )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Blood Pressure:<Text style={styles.redStar}>*</Text>
                  </Text>
                  <View style={styles.InputContainer}>
                    <View style={styles.bpInputWrapper}>
                      <View style={styles.bpinputWithIcon}>
                        <TouchableOpacity
                          onPress={() => handleDecrement("systolic", 70)}
                        >
                          <FontAwesome
                            name="minus"
                            size={20}
                            color={
                              parseFloat(vitals.systolic) === 70
                                ? "lightgrey"
                                : "teal"
                            }
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input} // Add styles.bpInputSmall
                          onChangeText={(text) =>
                            handleChange("systolic", text)
                          }
                          value={vitals.systolic}
                          placeholder="Systolic"
                          keyboardType="numeric"
                          maxLength={3}
                        />
                        <TouchableOpacity
                          onPress={() => handleIncrement("systolic", 300)}
                        >
                          <FontAwesome
                            name="plus"
                            size={20}
                            color={
                              parseFloat(vitals.systolic) === 300
                                ? "lightgrey"
                                : "teal"
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.bpDivider}> / </Text>
                      <View style={styles.bpinputWithIcon}>
                        <TouchableOpacity
                          onPress={() => handleDecrement("diastolic", 30)}
                        >
                          <FontAwesome
                            name="minus"
                            size={20}
                            color={
                              parseFloat(vitals.diastolic) === 30
                                ? "lightgrey"
                                : "teal"
                            }
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input} // Add styles.bpInputSmall
                          onChangeText={(text) =>
                            handleChange("diastolic", text)
                          }
                          value={vitals.diastolic}
                          placeholder="Diastolic"
                          keyboardType="numeric"
                          maxLength={3}
                        />
                        <TouchableOpacity
                          onPress={() => handleIncrement("diastolic", 260)}
                        >
                          <FontAwesome
                            name="plus"
                            size={20}
                            color={
                              parseFloat(vitals.diastolic) === 260
                                ? "lightgrey"
                                : "teal"
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.slideContainer}>
                      <View style={styles.slideText}>
                        <Slider
                          style={{ width: 190, height: 40 }}
                          minimumValue={70}
                          maximumValue={300}
                          step={1}
                          value={parseFloat(vitals.systolic)}
                          onValueChange={(value) =>
                            handleChange("systolic", value.toString())
                          }
                          minimumTrackTintColor="lightseagreen"
                          maximumTrackTintColor="plum"
                          thumbTintColor="teal"
                        />
                        <View style={styles.sliderRangeContainer}>
                          <Text style={styles.rangeText}>Min: 70</Text>
                          <Text style={styles.rangeText}> Max: 300</Text>
                        </View>
                        {vitals.systolic !== "" &&
                          vitals.systolic !== null &&
                          vitals.systolic !== undefined &&
                          !/^([7-9]\d|1\d{2}|2\d{2}|300)(\.\d)?$/.test(
                            vitals.systolic
                          ) &&
                          renderErrorMessage(
                            "Systolic BP must a positive number between 70 and 300, with up to 1 decimal place."
                          )}
                      </View>
                      <View style={styles.slideText}>
                        <Slider
                          style={{ width: 190, height: 40, marginRight: 0 }}
                          minimumValue={30}
                          maximumValue={260}
                          step={1}
                          value={parseFloat(vitals.diastolic)}
                          onValueChange={(value) =>
                            handleChange("diastolic", value.toString())
                          }
                          minimumTrackTintColor="lightseagreen"
                          maximumTrackTintColor="plum"
                          thumbTintColor="teal" 
                        />
                        <View
                          style={[
                            styles.sliderRangeContainer,
                            (marginLeft = 20),
                          ]}
                        >
                          <Text
                            style={[
                              styles.rangeText,
                              (paddingHorizontal = -20),
                            ]}
                          >
                            Min: 30
                          </Text>
                          <Text style={styles.rangeText}>Max: 260</Text>
                        </View>
                        {vitals.diastolic !== "" &&
                          vitals.diastolic !== null &&
                          vitals.diastolic !== undefined &&
                          !/^([3-9]\d|1\d{2}|2[0-5]\d|260)(\.\d)?$/.test(
                            vitals.diastolic
                          ) &&
                          renderErrorMessage(
                            "Diastolic BP must a positive number between 30 and 260, with up to 1 decimal place."
                          )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.inputColumn}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Height (<Text style={styles.italicText}>in cm</Text>):
                    <Text style={styles.redStar}>*</Text>
                  </Text>
                  <View style={styles.inputWithIcon}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("height", 40)}
                    >
                      <FontAwesome
                        name="minus"
                        size={20}
                        color={
                          parseFloat(vitals.height) === 40
                            ? "lightgrey"
                            : "teal"
                        }
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => handleChange("height", text)}
                      value={vitals.height}
                      placeholder="Height"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <TouchableOpacity
                      onPress={() => handleIncrement("height", 300)}
                    >
                      <FontAwesome
                        name="plus"
                        size={20}
                        color={
                          parseFloat(vitals.height) === 300
                            ? "lightgrey"
                            : "teal"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <CustomSlider
                    value={vitals.height}
                    onValueChange={(value) =>
                      handleChange("height", value.toString())
                    }
                    minValue={40}
                    maxValue={300}
                  />
                  {vitals.height !== "" &&
                    !/^([4-9]\d|1\d{2}|2\d{2}|300)(\.\d{1,2})?$/.test(
                      vitals.height
                    ) &&
                    renderErrorMessage(
                      "Height must be a positive number between 40 and 300, with up to 2 decimal place."
                    )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    SpO2:<Text style={styles.redStar}>*</Text>
                  </Text>
                  <View style={styles.inputWithIcon}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("spo2", 70)}
                    >
                      <FontAwesome
                        name="minus"
                        size={20}
                        color={
                          parseFloat(vitals.spo2) === 70 ? "lightgrey" : "teal"
                        }
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => handleChange("spo2", text)}
                      value={vitals.spo2}
                      placeholder="SpO2"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <TouchableOpacity
                      onPress={() => handleIncrement("spo2", 100)}
                    >
                      <FontAwesome
                        name="plus"
                        size={20}
                        color={
                          parseFloat(vitals.spo2) === 100 ? "lightgrey" : "teal"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <CustomSlider
                    value={vitals.spo2}
                    onValueChange={(value) =>
                      handleChange("spo2", value.toString())
                    }
                    minValue={70}
                    maxValue={100}
                  />
                  {vitals.spo2 !== "" &&
                    !/^(100(\.0+)?|[3-9]\d|100)$/.test(vitals.spo2) &&
                    renderErrorMessage(
                      "SpO2 must be a positive number between 30 and 100"
                    )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Temperature (
                    <Text style={styles.italicText}>in Fahrenheit</Text>):
                    <Text style={styles.redStar}>*</Text>
                  </Text>
                  <View style={styles.inputWithIcon}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("temperature", 90)}
                    >
                      <FontAwesome
                        name="minus"
                        size={20}
                        color={
                          parseFloat(vitals.temperature) === 90
                            ? "lightgrey"
                            : "teal"
                        }
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => handleChange("temperature", text)}
                      value={vitals.temperature}
                      placeholder="Temperature"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <TouchableOpacity
                      onPress={() => handleIncrement("temperature", 108)}
                    >
                      <FontAwesome
                        name="plus"
                        size={20}
                        color={
                          parseFloat(vitals.temperature) === 108
                            ? "lightgrey"
                            : "teal"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <CustomSlider
                    value={vitals.temperature}
                    onValueChange={(value) =>
                      handleChange("temperature", value.toString())
                    }
                    minValue={90}
                    maxValue={108}
                  />
                </View>
                {vitals.temperature !== "" &&
                  !/^([9]\d|[1][0-0][0-5])(\.\d)?$/.test(vitals.temperature) &&
                  renderErrorMessage(
                    "Temperature must be a positive number between 90 and 105, with up to 1 decimal place."
                  )}
              </View>
            </View>
            <View style={styles.inputRow}></View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            {/* Back button */}
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

            {/* View button */}
            {/* <SemicircleBackground style={styles.rbackground}>
              <TouchableOpacity
                onPress={() => navigation.navigate("viewVitals", { patientId })}
                style={styles.footerItem}
              >
                <View style={styles.rfooterIconContainer}>
                  <FontAwesome name="eye" size={24} color="teal" />
                </View>
                <Text style={styles.footerText2}>View</Text>
              </TouchableOpacity>
            </SemicircleBackground> */}
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
    //resizeMode: 'cover', // Cover the entire screen
    //justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -10,
    marginBottom: 20,
    textAlign: "center",
    color: "teal",
  },
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    height: 35,
    width: 400,
  },
  bpinputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    height: 35,
    width: 195,
  },

  submitButton: {
    backgroundColor: "teal",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
    marginTop: -10,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  formcontent: {
    alignItems: "center",
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
    marginTop: -40,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputColumn: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 25,
    marginRight: 10,
  },
  bpInputSmall: {
    width: 145, // Set the width according to your preference
  },
  bpInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  italicText: {
    fontStyle: "italic",
  },
  redStar: {
    color: "red",
  },
  sliderRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingLeft: -50,
    marginTop: 10,
  },
  rangeText: {
    marginTop: -15,
    color: "black",
    fontWeight: "bold",
    marginRight: 50,
  },
  slideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});
