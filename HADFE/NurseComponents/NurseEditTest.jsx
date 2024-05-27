import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView ,Alert, ImageBackground} from 'react-native';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import BG_Tests from "../Nurse_Comp_Images/BG_Tests.png";

export default function NurseEditTest({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [test, setTest] = useState({
        testName: '',
        prescribedOn: '',
        result: '',
    });
    const [editableResult, setEditableResult] = useState('');
    const id = route.params.id;
    console.log(id);
    const patientId=route.params.patientId;
    const SemicircleBackground = ({ children, style }) => {
        return (
            <View style={[styles.background, style]}>
                {children}
            </View>
        );
    };

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/nurse/viewTestById/${patientId}/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                });
                const testDetails = response.data;
                setTest({
                    testName: testDetails.testName,
                    prescribedOn: testDetails.prescribedOn,
                    result: testDetails.result,
                });
                setEditableResult(testDetails.result);
            } catch (error) {
                if(error.response && error.response.status===500)
                {
                Alert.alert(
                  'Error',
                  'Session Expired !!Please Log in again',
                  [
                    { text: 'OK', onPress: () => {
                      AsyncStorage.removeItem('token');
                      navigation.navigate("HomePage")} }
                  ],
                  { cancelable: false }
                );
              }else{
                console.error('Error fetching test details:', error);
            }}
        };

        fetchTestDetails();
    }, [id]);

    const handleChange = (value) => {
        setEditableResult(value);
        setTest({ ...test, result: value });
    };

    const renderErrorMessage = (errorMessage) => (
        <Text style={[styles.errorMessage, { color: 'red' }]}>{errorMessage}</Text>
    );
    

    const handleSubmit = async () => {
        try {
            const resultRegex = /^[a-zA-Z0-9\s]*$/; 
        
            if (!resultRegex.test(editableResult)) {
                Alert.alert('Invalid Result', 'Please enter a valid result.');
                return;
            }
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/nurse/editTestResult/${id}`, {
                result: editableResult},{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });

        console.log('Test edited successfully:', response.data);
        Alert.alert("Test edited sucessfully");
        setTest([]);
        setEditableResult('');
        } catch (error) {
            if(error.response && error.response.status===500)
            {
            Alert.alert(
              'Error',
              'Session Expired !!Please Log in again',
              [
                { text: 'OK', onPress: () => {
                  AsyncStorage.removeItem('token');
                  navigation.navigate("HomePage")} }
              ],
              { cancelable: false }
            );
          }else{
            console.error('Error editing test details:', error);
        }}
    };

    return (
        <View style={styles.container}>
            <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={BG_Tests} style={styles.content}>
                {isSidebarOpen && <NurseSidebar navigation={navigation} email={email}  activeRoute="NursePatient_Details" />}
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <View style={styles.formcontent}>
                        <Text style={styles.heading}>Edit Test</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Test Name:</Text>
                            <TextInput
                                style={styles.input}
                                value={test.testName}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Prescribed On:</Text>
                            <TextInput
                                style={styles.input}
                                value={test.prescribedOn}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Result:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange}
                                value={editableResult}
                                placeholder="Enter Result"
                            />
                        </View>
                        {test.result !== '' && !/^[a-zA-Z0-9\s]+$/.test(test.result) && renderErrorMessage('Test Result  must contain only alphabets,numbers and spaces.')}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footerContainer}>
    {/* Back button */}
    <SemicircleBackground style={styles.lbackground}>
  <TouchableOpacity onPress={() => navigation.navigate('NursePatient_Dashboard', { patientId })} style={styles.footerItem}>
    <View style={styles.lfooterIconContainer}>
      <FontAwesome name="arrow-left" size={24} color="teal" />
    </View>
    <Text style={styles.footerText1}>Back</Text>
  </TouchableOpacity>
</SemicircleBackground>

{/* View button */}
<SemicircleBackground style={styles.rbackground}>
  <TouchableOpacity onPress={() => navigation.navigate('ViewTest', { patientId })} style={styles.footerItem}>
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
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center', 
        //alignItems: 'center', 
    },
    formContainer: {
        padding: 20,
    },
    heading: {
        fontSize: 30,
        padding: 20,
        fontWeight: 'bold',
        marginTop: -10,
        marginBottom: 20,
        textAlign: 'center',
        color: 'teal',
    },
    inputContainer: {
        marginBottom: 20,
        //flexDirection: 'row', // Align label and input horizontally
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'teal',
        backgroundColor: 'lightgoldenrodyellow',
        paddingHorizontal: 10,
        height: 50,
        width: 300,
        fontSize: 16,
    },
    disabledInput: {
        opacity: 0.7, // Reduce opacity to indicate disabled state
    },
    // Add style for the DateTimePicker container
dateTimePickerContainer: {
    flex: 1, // Ensure it takes up remaining space
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'teal',
    backgroundColor: 'lightgoldenrodyellow',
    paddingHorizontal: 20,
    height: 35,
    width: 200,
},

    submitButton: {
        backgroundColor: 'teal',
        paddingVertical: 15,
        borderRadius: 5,
        width: 200,
        marginBottom: 10,
        marginTop: 20,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    formcontent:{
        alignItems:'center'
    },
    footerText1: {
        textAlign: 'left',
        marginTop: 10,
        color: 'teal',
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footerText2: {
        textAlign: 'right',
        marginTop: 10,
        color: 'teal',
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 90,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inputColumn: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 25,
        marginRight: 10,
    },lfooterIconContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginRight: 5, // Adjust this margin as needed
    }, 
    rfooterIconContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: 5, // Adjust this margin as needed
    },
    lbackground: {
        backgroundColor: 'cornsilk',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 500,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 0,
      },
      rbackground: {
        backgroundColor: 'cornsilk',
        borderTopLeftRadius: 500,
        borderTopRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 0,
      },   

});