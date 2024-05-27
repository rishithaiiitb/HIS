import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,route,
  ImageBackground, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEmail} from './Context/EmailContext';
import { API_BASE_URL } from './config';
import LogoImage from "./Nurse_Comp_Images/Logo.jpg";
import { NativeModules, Platform } from 'react-native';
import Aes from 'react-native-aes-crypto'
import CryptoJs from 'react-native-crypto-js';

import LoginPage from "./Nurse_Comp_Images/LoginPage.jpg";

const Login= ({ navigation,route }) => {
  const { updateEmail } = useEmail();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOTPVerified, setIsOtpVerified] = useState(false);
  

  const role=route.params.role;
  const key="6290456838123456";
  const iv="1999455819994558";
  let isLogin=true;

  useEffect(() => {
    if (route.params?.isOTPVerified) {
      setIsOtpVerified(route.params.isOTPVerified);
    }
  }, [route.params]);


  const handleVerifyOTP = () => {
    navigation.navigate('OTPVerify', {
      email,
      role,
      isOTPVerified,
      isLogin
    });
  };

  const handleForgotPassword = () => {
    navigation.navigate('ChangePasswordPage', { role}); 
  };


  const encryptData = async (text) => {
    const keyWordArray=CryptoJs.enc.Utf8.parse(key);
    const ivWordArray = CryptoJs.enc.Utf8.parse(iv);
    const data=CryptoJs.AES.encrypt(text,keyWordArray,{
      iv:ivWordArray,
      mode:CryptoJs.mode.CBC,
      padding:CryptoJs.pad.Pkcs7
    })

    return data.toString();
}
  
  
  const handleLogin = async() => {
    if (role === 'Nurse') {
      try {
        const response = await axios.post(`${API_BASE_URL}/nurse/login`, {
          email: await encryptData(email),
          password: await encryptData(password),
        });
        console.log(response.data.message); // Print the message for debugging
    
        if (response.data.message === "Login Successful") {
          // Login was successful
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('NurseHome');
        } else if (response.data.message === 'Already logged in') {
          // User is already logged in
          Alert.alert(
            'Error',
            'User Already logged In',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else if (response.data.message === 'Password not matched') {
          // Invalid email or password
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else if (response.data.message === "WARNING!! You can't login outside your schedule time.") {
          // Attempt to log in outside of schedule time
          Alert.alert(
            'Warning',
            "You can't login outside your schedule time",
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else {
          // Generic error handling for any other cases
          Alert.alert(
            'Error',
            response.data.message,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          Alert.alert(
            'Server Error',
            'An error occurred on the server. Please try again later.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else if (error.request) {
          console.error('No Response from Server:', error.request);
          Alert.alert(
            'Network Error',
            'No response from server. Please check your network connection and try again.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else {
          console.error('Request Error:', error.message);
          Alert.alert(
            'Request Error',
            'An error occurred while sending the request. Please try again.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      }
    }
    if(role=='Doctor'){
      try {
        const response = await axios.post(`${API_BASE_URL}/doctor/login`, {
          email: await encryptData(email),
          password: await encryptData(password),
        });
        console.log(response.data.status);
        if (response.data.status) {
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('DoctorHome', { shouldFetchData: true });
        }else if(response.data.status===false){
          Alert.alert(
            'Error',
            'User Already Logged In',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
        else if(response.data.status===null) {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
      } else if (error.request) {
          console.error('No Response from Server:', error.request);
      } else {
          console.error('Request Error:', error.message);
      }
      
      }
    }
    if(role==='Admin'){
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/login`, {
          email:await encryptData(email),
          password:await encryptData(password),
        });
        console.log(response.data.status);
        if (response.data.status) {
          const token = response.data.token;
          updateEmail(email);
          console.log(token);
          await AsyncStorage.setItem('token', token);
          navigation.navigate('AdminHome');
        } else if(response.data.status===false){
          Alert.alert(
            'Error',
            'User Already Logged In',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
        else if(response.data.status===null){
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );

        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
      } else if (error.request) {
          console.error('No Response from Server:', error.request);
      } else {
          console.error('Request Error:', error.message);
      }
      
      }
    }
    if (role === 'Receptionist') {
      try {
        const response = await axios.post(`${API_BASE_URL}/receptionist/login`, {
          email: await encryptData(email),
          password: await encryptData(password),
        });
        console.log(response.data.message); // Print the message for debugging
    
        if (response.data.message === "Login Successful") {
          // Login was successful
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('ReceptionistHome');
        } else if (response.data.message === 'Already logged in') {
          // User is already logged in
          Alert.alert(
            'Error',
            'User Already logged In',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else if (response.data.message === 'Password not matched') {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else if (response.data.message === "WARNING!! You can't login outside your schedule time.") {
          Alert.alert(
            'Warning',
            "You can't login outside your schedule time",
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Error',
            response.data.message,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          Alert.alert(
            'Server Error',
            'An error occurred on the server. Please try again later.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else if (error.request) {
          console.error('No Response from Server:', error.request);
          Alert.alert(
            'Network Error',
            'No response from server. Please check your network connection and try again.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else {
          console.error('Request Error:', error.message);
          Alert.alert(
            'Request Error',
            'An error occurred while sending the request. Please try again.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      }
    }

    if(role==='Pharmacy')
    {
      try {
        const response = await axios.post(`${API_BASE_URL}/pharmacy/login`, {
          email: await encryptData(email),
          password: await encryptData(password),
        });
        console.log(response.data.status);
        if (response.data.status) {
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('pharmacytoken', token);
          navigation.navigate('PharmacyHome'); 
        } else if(response.data.status==false){
          Alert.alert(
            'Error',
            'User Already Logged In',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
        else if(response.data.status===null) {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
        } else if (error.request) {
          console.error('No Response from Server:', error.request);
        } else {
          console.error('Request Error:', error.message);
        }
        Alert.alert('Error', 'Failed to log in. Please try again.'); 
      }
    }
  };


return (
    <View style={styles.container}>
      <View style={styles.background}>
        <ImageBackground
          source={{
            uri: "https://st3.depositphotos.com/1832477/17001/v/450/depositphotos_170013084-stock-illustration-vector-flat-doctor-nurse-surgeon.jpg",
          }}
          style={styles.backgroundImage}
        >
          {/* Your existing content inside the ImageBackground */}

          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Image source={LogoImage} style={styles.logo} />
            </View>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputContainer}>
            <Text style={styles.requiredText}>Enter your Email ID:
  <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {role !== 'Admin' && (
              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={!email.trim()} 
                style={email.trim() ? styles.verifyOtpLink : [styles.verifyOtpLink, styles.disabledLink]}
              >
                <Text style={styles.verifyOtpText}>Verify OTP</Text>
              </TouchableOpacity>
            )}

             </View>
            <View style={styles.inputContainer}>
              
              <Text style={styles.requiredText}>Enter your Password: 
  <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            /></View>
           {role !== 'Admin' && (
              <TouchableOpacity style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {role !== 'Admin' ? (
              <TouchableOpacity style={[styles.button, isOTPVerified ? {} : styles.disabledButton]} onPress={handleLogin} disabled={!isOTPVerified}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "lightblue", // Background color for the screen
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ensure the image covers the entire screen
    justifyContent: "center",
    alignItems: "center",
    //zIndex: 0, // Set a lower zIndex for the background image
    //pointerEvents: 'auto', // Enable touch interactions
  },
  logoContainer: {
    flexDirection: "row", // Align the logo and buttons in a row
    alignItems: "center",
    marginBottom: 80, // Add margin between the logo and buttons
    marginTop: -60,
  },
  logo: {
    width: 280, // Adjusted width to make it smaller
    height: 100, // Adjusted height to make it smaller
    marginTop: 10,
    marginBottom: -10,
    borderRadius: 5, // Half of the width and height to make it circular
    borderWidth: 1, // Adjust border width as needed
    borderColor: "teal", // Border color
    overflow: "hidden", // Clip the content inside the border
    shadowColor: "black", // Shadow color
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8, // Adjust shadow opacity as needed
    shadowRadius: 10, // Adjust shadow radius as needed
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: -10,
    marginTop: 20,
    color: "#339999",
  },
  inputContainer: {
    //flexDirection: "row",
    marginTop: 30,
    //alignItems: "center",
  },
  requiredText: {
    color: "#1e6666", // Set the color of "Enter your Email" to black
    marginRight: 5,
    marginLeft: 10,
    marginTop: 10,
  },
  asterisk: {
    color: "red", // Set the color of "*" to red
  },
  input: {
    width: 400,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 0,
    backgroundColor: "rgba(51, 153, 153, 0.1)",
    marginLeft: 10, // Adjust marginLeft to shift input boxes to the right
  },
  button: {
    backgroundColor: "#339999",
    width: 150,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: 'goldenrod',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end', // Aligns the link to the right side
    marginTop: 5, // Adds some space between the password input and the link
  },
  forgotPasswordText: {
    color: '#1e90ff', // Adjust the color of the text for the link
  },
  verifyOtpText: {
    color: '#1e90ff',
    alignSelf: 'flex-end',
    marginBottom: -20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledLink: {
    opacity: 0.5,  // Makes the link appear faded when disabled
  },

});

export default Login;