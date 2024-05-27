import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import BG_Tests from "../Nurse_Comp_Images/BG_Tests.png";
import { useConsent } from '../Context/ConsentContext';
import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function AddTestResult({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [id, setId] = useState('');
    const [testName,setTestName]= useState("");
    const [prescribedDate, setPrescribedDate] = useState('');
    const {consentToken} = useConsent();
    const [testResults, setTestResults] = useState({
        testName: '',
        prescribedOn: '',
        result: '',
    });
    const patientId = route.params.patientId;
    const isFocused = useIsFocused();

    const SemicircleBackground = ({ children, style }) => {
        return (
            <View style={[styles.background, style]}>
                {children}
            </View>
        );
    };
    
    useEffect(() => {
        fetchTests(patientId);
    }, [patientId]);

    useEffect(() => {
        if (isFocused) {
          fetchTests(patientId);
        }
      }, [isFocused]);

    const renderErrorMessage = (errorMessage) => (
        <Text style={[styles.errorMessage, { color: 'red' }]}>{errorMessage}</Text>
    );
    
    const fetchTests = async (patientId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/nurse/viewTestName/${patientId}/${consentToken}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const testsData = await response.json();
            setTests(testsData);
            // navigation.navigate("ViewTest", { patientId });
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
            console.error('Error fetching tests:', error);
        }}
    };
    

    const handleChange = (key, value) => {
        setTestResults({ ...testResults, [key]: value });
    };

    const handleSubmit = async () => {
        try {
           // const resultRegex = /^[a-zA-Z0-9\s]*$/; 
           const resultRegex = /^[a-zA-Z0-9\s.]*$/;

        
            if (!resultRegex.test(testResults.result)) {
                Alert.alert('Invalid Result', 'Please enter a valid result.');
                return;
            }
            const token = await AsyncStorage.getItem('token');
            const doctorResponse = await axios.get(`${API_BASE_URL}/nurse/getDoctorEmail/${patientId}/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            const doctorEmail = doctorResponse.data;
            const res=testName;
            const notificationBody = {
                body: `Test result added successfully for the patientId :${patientId}  for ${res}`,
                doctorEmail: doctorEmail, 
                patientId: patientId,
              };
              await axios.post(`${API_BASE_URL}/nurse/notifyDoctor`, notificationBody, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
          
          
            const response = await axios.post(`${API_BASE_URL}/nurse/addTestResult/${id}`, 
                testResults,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            console.log('Test Results added successfully:', response.data);
            Alert.alert("Test Added sucessfully");
            setTestResults({
                testName: '',
                prescribedOn: '',
                result: '',
            });
            setPrescribedDate('');
            setSelectedTest('');
            navigation.navigate('ViewTest',{patientId})
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
            console.error('Error adding Test Result:', error);
        }}
    };

    return (
        <View style={styles.container}>
            <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={BG_Tests} style={styles.content}>
                {isSidebarOpen && <NurseSidebar navigation={navigation} email={email}  activeRoute="NursePatient_Details" />}
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <View style={styles.formcontent}>
                        <Text style={styles.heading}>Add Test Results</Text>
                        
                        <View style={styles.inputContainer}>
    <Text style={styles.label}>Test Name:</Text>
    <TextInput
    style={[styles.input, styles.disabledInput]}
    value={(tests.length === 0 ? 'No tests available' : '')}
    editable={false}
    //placeholder="-- Select Test --"
/>

{tests.length > 0 ?(<Picker
                                selectedValue={selectedTest}
                                style={{ position: 'absolute', top: 25, left: -10, height: 30, width: 320, zIndex: 1 }}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedTest(itemValue);
                                    const selectedTestDetails = tests.find(test => test.testName === itemValue);
                                    console.log(selectedTestDetails);
                                    setTestName(selectedTestDetails.testName);
                                    if (selectedTestDetails) {
                                        setId(selectedTestDetails.id); // Add conditional check here
                                        setPrescribedDate(selectedTestDetails.prescribedOn);
                                    } else {
                                        setId(''); // Set id to an appropriate value when selectedTestDetails is undefined
                                        setPrescribedDate('');
                                    }
                                }}>
                                <Picker.Item label="-- Select Test --" value="" />
                                {tests.map((test, index) => (
                                    <Picker.Item key={index} label={test.testName} value={test.testName} />
                                ))}
                            </Picker>
):(
    <Text></Text>
)}
                            
                           
    
</View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Prescribed Date:</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={prescribedDate}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Test Result:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleChange('result', text)}
                                value={testResults.result}
                                placeholder="Test Result"
                numberOfLines={4}
                            />
                        </View>
                        {testResults.result !== '' && !/^[a-zA-Z0-9\s.]*$/.test(testResults.result) && renderErrorMessage('Test Result  must contain only alphabets,numbers and spaces.')}
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