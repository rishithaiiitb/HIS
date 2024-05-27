import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  Image
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { useNavigation } from '@react-navigation/native';
import IMG_Otp from "../Receptionist_Comp_Images/IMG_Otp.jpg";
import BG_Otp from "../Receptionist_Comp_Images/BG_Otp.jpg";

function OTPVerification({ route }) {
  const { phoneNumber } = route.params;
  const [otp, setOTP] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes = 120 seconds

  useEffect(() => {
    let interval;
    if (otpSent && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [otpSent, secondsLeft]);

  const navigation = useNavigation();

  const handleSendOTP = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/receptionist/sendOtp/${phoneNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOTPSent(true);
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP");
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/receptionist/verifyOtp/${phoneNumber}/${otp}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;
      Alert.alert("OTP Verification", data);
      if (data === "OTP verification successful.") {
       navigation.navigate("Appointment", { isOTPVerified: true });
       //otpVerified(true);
       //navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP");
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResendOTP = async () => {
    setSecondsLeft(120); // Reset the timer to 120 seconds
    await handleSendOTP(); // Send OTP again
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={{uri:"https://img.freepik.com/free-vector/watercolour-background-blue-tones_91008-275.jpg?size=626&ext=jpg&ga=GA1.1.553209589.1714521600&semt=ais"}} style={styles.backgroundImage}>
      <Text style={styles.heading}>OTP Verification</Text>
      <View style={styles.otpcontainer}>
      <Text style={styles.label}>
        Enter OTP sent to {phoneNumber} (expires in {formatTime(secondsLeft)}):
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setOTP(text)}
        value={otp}
        placeholder="Enter OTP"
      />
      </View>
      {!otpSent ? (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSendOTP}
        >
          <Text style={styles.submitButtonText}>Send OTP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleVerifyOTP}
        >
          <Text style={styles.submitButtonText}>Verify OTP</Text>
        </TouchableOpacity>
      )}
      {secondsLeft === 0 && (
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOTP}
        >
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      )}
      <Image source={{uri:"https://cdni.iconscout.com/illustration/premium/thumb/otp-verification-5152137-4309037.png?f=webp"}} style={styles.otpImage} />
      </ImageBackground>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'teal',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: 400,
    textAlign:'center'
  },
  submitButton: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  resendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  otpImage: {
    width: 250, 
    height: 250, 
    alignSelf: "center", 
    marginTop: 20, 
  },
  otpcontainer:{
    alignItems:'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  
},
  
});

export default OTPVerification;
