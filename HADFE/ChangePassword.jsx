

import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,ImageBackground,Image, } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { useNavigation } from '@react-navigation/native';
import LogoImage from "./Nurse_Comp_Images/Logo.jpg";

const ChangePasswordPage = ({ route }) => {
  const { role } = route.params;
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (route.params?.isOTPVerified) {
      setIsOTPVerified(route.params.isOTPVerified);
    }
  }, [route.params]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/${role.toLowerCase()}/passwordChange`, {
        email: email,
        password: newPassword,
      });
      Alert.alert("Password changed successfully, please try to login again");
      navigation.navigate('Login', { role });
    } catch (error) {
      console.error('Error changing password:', error.message);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
  };

  const handleVerifyOTP = () => {
    navigation.navigate('OTPVerify', {
      email: email,   
      role: role,     
      isOTPVerified:false, 
    });
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

      <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image source={LogoImage} style={styles.logo} />
          </View>    
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
  onPress={handleVerifyOTP}
  disabled={!email.trim()} // Disables the button if email is empty
  style={email.trim() ? styles.linkButton : [styles.linkButton, styles.disabledLink]}
>
        <Text style={styles.linkText}>Verify OTP</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, isOTPVerified ? {} : styles.disabledButton]}
        onPress={handleChangePassword}
        disabled={!isOTPVerified}
      >
        <Text>Change Password</Text>
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
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  
  disabledButton: {
    backgroundColor: '#ccc',
  },
  linkButton: {
    marginBottom: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  disabledLink: {
    opacity: 0.5,  // Makes the button appear faded when disabled
  },
  background: {
    flex: 1,
    backgroundColor: "lightblue", // Background color for the screen
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop:20,
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
    width: 200,
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
    marginTop: 30,
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
});

export default ChangePasswordPage;

