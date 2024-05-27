import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import {useConsent} from '../Context/ConsentContext';
import prescriptionImage from '../Doctor_Comp_Images/Generate_Prescription.png';
import medicationImage from '../Doctor_Comp_Images/Medications.png';
import testImage from '../Doctor_Comp_Images/Tests.png';
import pastHistoryImage from '../Doctor_Comp_Images/Past_History.png';
import ipImage from '../Doctor_Comp_Images/Recommend_to_IP.png';
import progressImage from '../Doctor_Comp_Images/Record_Progress.png'

import LoadingScreen from '../Loading';


const DoctorPatientDashboard = ({ route, navigation }) => {
  const { patientId } = route.params;
  const { email } = useEmail();
  const {consentToken} = useConsent();
  const [patientDetails, setPatientDetails] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [symptoms, setSymptoms] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [disease, setDisease] = useState(null);
  const [newDisease, setNewDisease] = useState(null);
  const [editing,setEditing] = useState(false);
  const [imageData,setImageData ]= useState(null);


  const fetchDoctorDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/home/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if(response.status==500){
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
      }
      const fetchedDoctorDetails = await response.json();
      setDoctorDetails(fetchedDoctorDetails);
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
      console.error('Error fetching doctor details:', error);
    }}
  };

 
  const fetchPatientDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/patientDetails/${patientId}/${consentToken}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if(response.status==500){
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
      }
      const data = await response.json();
      setPatientDetails(data);
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
      console.error('Error fetching patient details:', error);
    }}
  };

  const fetchVitals = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/patientVitals/${patientId}/${consentToken}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVitals(data);
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
      console.error('Error fetching vitals:', error);
    }}
  };

  const fetchSymptoms = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/patientSymptoms/${patientId}/${consentToken}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSymptoms(data);
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
      console.error('Error fetching symptoms:', error);
    }}
  };

  const fetchImageData = async () => {

    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/doctor/viewCanvas/${patientId}/${consentToken}/${email}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.image);

        setImageData(result.image);
    } catch (error) {
        console.error('Fetching image failed:', error);
        Alert.alert('Fetch Failed', error.message);
    } 
};
  
  const fetchDisease = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/getDisease/${patientId}/${consentToken}/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.text();
      setDisease(data);
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
      console.error('Error fetching disease:', error);
    }}
  };

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { shouldFetchData: shouldFetchDataParam } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      if (shouldFetchData || shouldFetchDataParam) {
        fetchDoctorDetails();
        fetchPatientDetails();
        fetchVitals();
        fetchSymptoms();
        fetchDisease();
        fetchImageData();
        setShouldFetchData(false);
      }
    }, [shouldFetchData, shouldFetchDataParam])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShouldFetchData(true);
    });

    return unsubscribe;
  }, [navigation]);

  if (!patientDetails || !vitals || !symptoms) {
    return (
      <LoadingScreen />
    );
  }

  const handleAddDisease = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/setDisease/${patientId}/${newDisease}/${email}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const responseData = await response.text();
  
        if (responseData) {
          setDisease(responseData);
          Alert.alert("Disease Updated successfully");
        } else {
          console.error('Invalid response data:', responseData);
        }
      } 
      else{
        console.error('Failed to add disease. Status:', response.status);
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
      console.error('Error adding disease:', error);
  }}
  };

  const handleEditDisease = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/editDisease/${patientId}/${newDisease}/${email}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const responseData = await response.text();
  
        if (responseData) {
          setDisease(responseData);
          Alert.alert("Disease Updated successfully");
          setEditing(false);                                                                                                                                                
        } else {
          console.error('Invalid response data:', responseData);
        }
      } 
      else{
        console.error('Failed to add disease. Status:', response.status);
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
      console.error('Error adding disease:', error);
  }}
  };


  
  const handleMedications = () => {
    navigation.navigate("ViewMedications", { patientId, patientDetails })
  }
  const handleTests = () => {
    navigation.navigate("ViewTests", { patientId, patientDetails })
  }

  const handlePrescription = () => {
    fetchImageData();
    console.log(imageData);
    if(!imageData){
      navigation.navigate("WriteCanvas", { patientId })
    }
    else{
       navigation.navigate("ViewCanvas", { patientId })
    }
  }

  const handlePastHistory = () => {
    navigation.navigate("PastHistory", { patientId, patientDetails })
  }
  const handleSymptomImages = () => {
    navigation.navigate("SymptomsImages", { patientId })
  }
  const handleIP = () => {
    fetchDoctorDetails();
    const spec = doctorDetails.specialization;
    if (patientDetails.department === 'IP') {
      Alert.alert(
        'Alert',
        'Patient is already in IP department.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }    
    else{
      navigation.navigate("RecommendIP", { patientId, patientDetails, spec : spec.specializationName})
    }
  }

  const handleProgress = () => {
    navigation.navigate("RecordProgress", { patientId, patientDetails })
  }

  const handleDischarge = async () => {
    Alert.alert(
      'Confirm Discharge',
      'Are you sure you want to discharge this patient?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_BASE_URL}/doctor/discharge/${patientId}/${email}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                navigation.navigate("DoctorPatientDetails", { shouldFetchData: true })
              }
              else{
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
              console.error('Error discharging patient:', error);
          }}
          },
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.flexContainer}>
        {isSidebarOpen && (
          <DoctorSideBar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="DoctorPatientDetails" />
        )}
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Patient Details</Text>
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Department:</Text>
                <Text style={styles.detailValue}>{patientDetails.department}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Patient ID:</Text>
                <Text style={styles.detailValue}>{patientDetails.patientId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{patientDetails.patientName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sex:</Text>
                <Text style={styles.detailValue}>{patientDetails.sex}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age:</Text>
                <Text style={styles.detailValue}>{patientDetails.age} years</Text>
              </View>
              {patientDetails.department === 'IP' && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bed ID:</Text>
                  <Text style={styles.detailValue}>{patientDetails.bed.bId}</Text>
                </View>
              )}
            </View>

            <View style={styles.horizontalGap} />

            <View style={styles.vitalsContainer}>
              <Text style={styles.sectionHeader}>Vitals</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Temperature:</Text>
                <Text style={styles.detailValue}>{vitals.temperature}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pulse:</Text>
                <Text style={styles.detailValue}>{vitals.pulse}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Blood Pressure:</Text>
                <Text style={styles.detailValue}>{vitals.bp}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Oxygen:</Text>
                <Text style={styles.detailValue}>{vitals.spo2}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weight:</Text>
                <Text style={styles.detailValue}>{vitals.weight}</Text>
              </View>
            </View>

            <View style={styles.horizontalGap} />

            <View style={styles.symptomsContainer}>
              <Text style={styles.sectionHeader}>Symptoms</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>1.</Text>
                <Text style={styles.detailValue}>{symptoms.symptom1}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>2.</Text>
                <Text style={styles.detailValue}>{symptoms.symptom2}</Text>
              </View>
              {symptoms.symptom4 !== null && symptoms.symptom4 !== ""&& (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>3.</Text>
                <Text style={styles.detailValue}>{symptoms.symptom3}</Text>
              </View>
              )}
              {symptoms.symptom4 !== null && symptoms.symptom4 !== ""&& (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>4.</Text>
                  <Text style={styles.detailValue}>{symptoms.symptom4}</Text>
                </View>
              )}
              {symptoms.symptom5 !== null && symptoms.symptom5 !== ""&& (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>5.</Text>
                  <Text style={styles.detailValue}>{symptoms.symptom5}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.ButtonContainer}
                onPress={handleSymptomImages}
              >
                <Text style={styles.ButtonText}>View Images</Text>
              </TouchableOpacity>
            </View>
          </View>
          {disease ? (
            <View style={styles.diseaseView}>
              {editing ? (
              <View style={styles.emptyView}>
                <Text style={styles.emptyText}>Set disease:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => setNewDisease(text)}
                    value={newDisease}
                    placeholder="Enter new disease"
                  />
                  <TouchableOpacity onPress={handleEditDisease} style={styles.ButtonContainer}>
                    <Text style={styles.ButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyView}>
                  <Text>
                    <Text style={styles.diseaseText}>Disease:</Text> {disease}
                  </Text>
                  <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButtonContainer}>
                    <Text style={styles.ButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>Set disease:</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setNewDisease(text)}
                value={newDisease}
                placeholder="Enter disease"
              />
              <TouchableOpacity onPress={handleAddDisease} style={styles.ButtonContainer}>
                <Text style={styles.ButtonText}>Add Disease</Text>
              </TouchableOpacity>
            </View>
          )}

          
          <TouchableOpacity
            style={styles.disButtonContainer}
            onPress={handleDischarge}
          >
            <Text style={styles.ButtonText}>Discharge</Text>
          </TouchableOpacity>

          <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.addButtonContainer} onPress={handlePastHistory}>
            <Image source={pastHistoryImage} style={styles.addButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButtonContainer} onPress={handleMedications}>
            <Image source={medicationImage} style={styles.addButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButtonContainer} onPress={handleTests}>
            <Image source={testImage} style={styles.addButtonIcon} />
          </TouchableOpacity>
          {doctorDetails && doctorDetails.department === 'IP' ? (
          <TouchableOpacity style={styles.addButtonContainer} onPress={handleProgress}>
            <Image source={progressImage} style={styles.addButtonIcon} />
          </TouchableOpacity>
          ): (

            <TouchableOpacity
            style={[styles.addButtonContainer, patientDetails.department === 'IP' ? styles.disabledButton : {}]}
            onPress={handleIP}
            disabled={patientDetails.department === 'IP'}  // Disable button if the patient is  inpatient
          >
            <Image source={ipImage} style={styles.addButtonIcon} />
          </TouchableOpacity>
          

          )}
          <TouchableOpacity style={styles.addButtonContainer} onPress={handlePrescription}>
            <Image source={prescriptionImage} style={styles.addButtonIcon} />
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    paddingTop: 20,
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContainer :{
    flex: 1, 
    flexDirection: "row" ,
    borderWidth: 1,
    borderColor: '#339999',
    borderRadius: 4,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: '#e6fafa',
    padding: 10,

  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
  },
  headerText: {
    fontSize: 30,
    padding: 20,
    fontWeight: 'bold',
    color: 'teal',
    alignItems: 'center',
  },

  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'mediumpurple',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
    marginLeft: 20,
    marginTop: 30,
  },
  vitalsContainer: {
    flex: 1,
    marginRight: 10,
  },
  symptomsContainer: {
    flex: 1,
  },
  horizontalGap: {
    marginHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
    fontSize: 15, 
    
  },
  detailValue: {
    flex: 1,
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14, 
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  radioLabel: {
    marginLeft: 10,
    color: '#007BFF',
  },
  ButtonContainer: {
    backgroundColor: 'teal',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 140,
    marginRight: 20,
    textAlign: 'center',
  },
  editButtonContainer: {
    backgroundColor: 'teal',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 140,
    marginRight: 20,
    textAlign: 'center',
    marginLeft: 10,
  },

  disButtonContainer: {
    backgroundColor: 'teal',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 140,
    marginRight: 20,
    textAlign: 'center',
    marginLeft: 25,
    marginTop: 20,
    marginBottom: -30,
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 'auto',
  },
  emptyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
    marginRight: 10, 
    marginLeft: 15,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    height: 40,
    width: 400,
    marginRight: 5,
  },
  diseaseView: {
    marginTop: 0,
    marginLeft: 20,
  },
  diseaseText: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
    fontSize: 18, 
  },
  actionContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //flexWrap: 'wrap',
    //justifyContent: 'space-around',
},
addButtonContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '17%', // Adjust the width as needed
    //height: 80, // Adjust the height as needed
    aspectRatio: 1, // Maintain aspect ratio to make the images square
    borderRadius: 8, // Rounded corners to make it look like a button
    backgroundColor: '#99ccdd', // Background color to make it look like a button
    borderColor: '#339999', // Border color
    borderWidth: 2, // Border width
    justifyContent: 'center', // Center the image
    alignItems: 'center',
},
disabledButton: {
  marginBottom: 20,
  alignItems: 'center',
  width: '17%', // Adjust the width as needed
  //height: 80, // Adjust the height as needed
  aspectRatio: 1, // Maintain aspect ratio to make the images square
  borderRadius: 8, // Rounded corners to make it look like a button
  backgroundColor: '#99ccdd', // Background color to make it look like a button
  borderColor: '#339999', // Border color
  borderWidth: 2, // Border width
  justifyContent: 'center', // Center the image
  alignItems: 'center',
  opacity: 0.5,
},
addButtonIcon: {
    //width: 70, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    alignSelf: 'center', // Align the icon to the center
    //width: '80%', // Adjust the width to occupy 80% of the container width
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 8, 
},
Icon: {
  //width: 70, // Adjust the width as needed
  height: 260, // Adjust the height as needed
  alignSelf: 'center', // Align the icon to the center
  //width: '80%', // Adjust the width to occupy 80% of the container width
  aspectRatio: 1, // Maintain aspect ratio
  borderRadius: 8, 
},
});

export default DoctorPatientDashboard;
