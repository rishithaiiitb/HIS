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
import { API_BASE_URL } from "./config";
import { useNavigation } from '@react-navigation/native';

function OTPVerify({ route }) {
  const { email } = route.params;
  const { role } = route.params;
  const {isOTPVerified} =route.params;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isfetched,setIsfetched] =useState(false);
  const [isLogin,setIsLogin]=useState(false);

  useEffect(() => {
    if (route.params?.isLogin) {
      setIsLogin(true);
    }
  }, [route.params]);
  

  useEffect(() => {
    if(!isfetched){
    fetchPhoneNumber();
  }
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

  const fetchPhoneNumber = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${role.toLowerCase()}/getContactFromEmail/${email}`);
      const phone=response.data;
      setPhoneNumber(phone); 
      setIsfetched(true);
    } catch (error) {
      console.error('Failed to fetch phone number:', error);
      Alert.alert('Error', 'Failed to fetch phone number');
    }
  };


  const navigation = useNavigation();
  const handleSendOTP = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/${role.toLowerCase()}/sendOtpforpassword/${phoneNumber}`,
        {},
      );
      setOTPSent(true);
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP");
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${role.toLowerCase()}/verifyOtpforpassword/${phoneNumber}/${otp}`,
        {},
      );
      const { data } = response;
      Alert.alert("OTP Verification", data);
      if (data === "OTP verification successful.") {
    if(!isLogin){
       navigation.navigate("ChangePasswordPage", {
        email:email,
        role:role,
        isOTPVerified: true });
      }
    else{
        navigation.navigate("Login", {
            email:email,
            role:role,
            isOTPVerified: true });
          }
    } }catch (error) {
      Alert.alert("Error", "Failed to verify OTP");
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResendOTP = async () => {
    setSecondsLeft(120); 
    await handleSendOTP(); 
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
    
    export default OTPVerify;