import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button, Alert,ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';

export default function RecommendIP({ navigation, route }) {
    const spec = route.params.spec;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState(spec);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;
    const {email} = useEmail();

    useEffect(() => {
        fetchSpecializations();
    }, []);

    useEffect(() => {
        if (selectedSpecialization) {
            setSelectedDoctor(null);
            fetchDoctors();
        }
      }, [selectedSpecialization]);

    
    

    const fetchSpecializations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/getAllSpecializations`,{
                headers: {
                        Authorization: `Bearer ${token}`
                    }
            });
            setSpecializations(response.data);
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
            console.error('Error fetching specializations:', error);
        }}
    };


    const fetchDoctors = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/getSpecializationDoctors/${selectedSpecialization}`,{
                headers: {
                        Authorization: `Bearer ${token}`
                    }
            });
            setDoctors(response.data);
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
            console.error('Error fetching doctors:', error);
        }}
    };

    const handleSave = async () => {
        try {
            if (selectedDoctor) {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/doctor/changetoIP/${patientId}/${selectedDoctor}/${email}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                
    
                if (response.ok) {
                    Alert.alert("Changed to IP successfully");
                    navigation.navigate('DoctorPatientDetails',{shouldFetchData: true});
                } else {
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
                    console.error('Failed to change to IP:', response.status);
                    Alert.alert('Failed to change to IP. Please try again later.');
                }
            } else {
                console.log('No doctor selected'); 
                Alert.alert("Please select a doctor.");
            }
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
            console.error('Error while changing to IP:', error);
            Alert.alert('An error occurred while changing to IP. Please try again later.');
        }}
    };
    
    

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={{ uri: 'https://i.pinimg.com/736x/93/9d/ca/939dca745f61a98f38f240ced8583f3a.jpg' }} style={styles.content}>

            <View style={styles.content}>
                {isSidebarOpen && <DoctorSideBar navigation={navigation} activeRoute="DoctorPatientDetails"/>}
                <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.heading}>Recommendation for Inpatient Treatment</Text>
                    <View style={styles.patientDetailsContainer}>
                        {patientDetails && (
                            <View style={styles.detailsContainer}>
                                <Text style={styles.heading1}>Patient Details</Text>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Patient ID:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.patientId}</Text>
                                    <Text style={styles.detailLabel}>Name:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.patientName}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Age:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.age}</Text>
                                    <Text style={styles.detailLabel}>Sex:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.sex}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.headerText}>Select Specialization:</Text>
                        <Picker
                            selectedValue={selectedSpecialization}
                            style={styles.dropdown}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedSpecialization(itemValue);
                            }}
                        >
                            {specializations.map((spec, index) => (
                                <Picker.Item key={index.toString()} label={spec} value={spec} />
                            ))}
                        </Picker>
                        <Text style={styles.headerText}>Select Doctor:</Text>
                        <Picker
                            selectedValue={selectedDoctor}
                            style={styles.dropdown}
                            onValueChange={(itemValue, itemIndex) => setSelectedDoctor(itemValue)}
                        >
                            <Picker.Item key="selectDoctor" label="Select Doctor" value={null} />

                            {doctors.map((doc, index) => (
                                <Picker.Item key={index} label={doc.name} value={doc.doctorId} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        justifyContent: 'center', // Ensures content is centered horizontally
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
   
    detailsContainer: {
        marginTop: 10,
        borderWidth: 1,
          borderColor: 'plum',
          borderBottomWidth: 1,
          borderRadius: 4,
        //   shadowColor: '#000',
        //   shadowOffset: { width: 0, height: 2 },
        //   shadowOpacity: 0.8,
        //   shadowRadius: 2,
        //   elevation: 1,
          marginLeft: 25,
          marginRight: 25,
          marginTop: 10,
          backgroundColor: 'ghostwhite',
          padding: 10,
    },
      detailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 5,
          marginBottom: 5,
          //borderBottomWidth: 1,
          //borderBottomColor: '#339999', // Adjust the color as needed
      },
      
      heading: {
        fontFamily: 'Verdana', // Example font family
        fontSize: 20, // Increase font size for emphasis
        fontWeight: 'bold', // Make the text bold
        color: '#333', // Change text color to a darker shade
        marginTop: 10, // Increase bottom margin for spacing
        marginBottom: 5, // Increase bottom margin for spacing
        textAlign: 'center', // Center-align the text
        //textTransform: 'uppercase', // Convert text to uppercase for emphasis
        //textDecorationLine: 'underline',
      },
      detailLabel: {
          fontWeight: 'bold',
          width: '15%',
          color: '#333',
          fontFamily: 'Verdana', // Example font family
          fontSize: 14, // Example font size
      },
      detailValue: {
        fontWeight: 'bold',
          width: '20%',
          color: '#666',
          fontFamily: 'Verdana', // Example font family
          fontSize: 12, // Example font size
      },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'teal',
    },
    heading1: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'mediumpurple',
        textDecorationLine: 'underline',
    },
    headerText: {
        fontWeight: 'bold',
        color: 'teal',
        marginBottom: 10, // Provides space below the header text
    },
    buttonContainer: {
        flexDirection: 'row', // This will lay out the buttons in a row.
  justifyContent: 'space-around', // This will distribute extra space evenly around the items.
//   alignItems: 'center', // This will center the buttons vertically.
  marginTop: 20, // A
    },
    backButton: {
        height: 40,
        borderRadius: 5,
        justifyContent: 'center', // Center the text vertically inside the button
        padding: 10,
        // Remove width here if you want to use it directly in the component for better flexibility
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
    dropdownContainer: {
        // marginBottom: 20,
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 5,
        backgroundColor: 'ivory',
        marginLeft: 25,
        marginRight: 25,
        marginTop: 10,
        //backgroundColor: 'white',
        padding: 10,
        // alignItems:'center',
        justifyContent:'center'
    },
    dropdown: {
        borderWidth: 5,
        borderColor: 'teal',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 30,
        justifyContent:'center',
        backgroundColor:'white',
    },
    saveButton: {
        backgroundColor: 'teal',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width:'15%',
        borderRadius: 5,
        marginTop: 10,
        marginLeft: -190,
    },
    cancelButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width:'15%',
        borderRadius: 5,
        marginTop: 10,
        alignContent:'flex-start',
        marginRight: -190,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        alignContent:'center'
    },
    patientDetailsContainer: {
        marginBottom: 10,
    },
});