import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import { useConsent } from '../Context/ConsentContext';
import { Table, Row } from 'react-native-table-component';
import { FontAwesome } from '@expo/vector-icons';
import Patient_Details from "../Nurse_Comp_Images/Patient_Details.png";
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from '../Loading';

const previousIcon = '<<';
const nextIcon = '>>';

const DoctorPatientDetails = ({ navigation, route }) => {
  const { email } = useEmail();
  const { updateConsent } = useConsent();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [generalPatients, setGeneralPatients] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const { shouldFetchData: shouldFetchDataParam } = route.params.shouldFetchData;
  const [doctorDetails,setDoctorDetails] = useState(null); 
  const [currentEmergencyPage, setCurrentEmergencyPage] = useState(1);
  const [currentGeneralPage, setCurrentGeneralPage] = useState(1);
  const [patientsPerPage] = useState(3);
  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
  
      // Fetching emergency patients
      const emergencyResponse = await fetch(`${API_BASE_URL}/doctor/viewEmergencyPatients/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (emergencyResponse.status === 500) {
        Alert.alert(
          'Error',
          'Session Expired !! Please Log in again',
          [{ text: 'OK', onPress: () => {
            AsyncStorage.removeItem('token');
            navigation.navigate("HomePage");
          }}],
          { cancelable: false }
        );
        return;
      }
  
      const emergencyData = await emergencyResponse.json();
  
      // Fetching general patients
      const patientsResponse = await fetch(`${API_BASE_URL}/doctor/viewPatients/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (patientsResponse.status === 500) {
        Alert.alert(
          'Error',
          'Session Expired !! Please Log in again',
          [{ text: 'OK', onPress: () => {
            AsyncStorage.removeItem('token');
            navigation.navigate("HomePage");
          }}],
          { cancelable: false }
        );
        return;
      }
  
      const patientsData = await patientsResponse.json();
  
      // Function to fetch color for each patient
      const fetchPatientColor = async (patient) => {
        const response = await fetch(`${API_BASE_URL}/doctor/getChecked/${patient.patientId}/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 500) {
          Alert.alert(
            'Error',
            'Session Expired !! Please Log in again',
            [{ text: 'OK', onPress: () => {
              AsyncStorage.removeItem('token');
              navigation.navigate("HomePage");
            }}],
            { cancelable: false }
          );
          return 'gray'; // default color in case of session error
        }
        if (!response.ok) {
          throw new Error('Failed to fetch checked status');
        }
        const data = await response.json();
        return data ? 'palegreen' : 'tomato';
      };
  
      // Adding color to each emergency patient data
      const emergencyPatientsWithColors = await Promise.all(emergencyData.map(async patient => ({
        ...patient,
        color: await fetchPatientColor(patient)
      })));
  
      // Adding color to each general patient data
      const generalPatientsWithColors = await Promise.all(patientsData.map(async patient => ({
        ...patient,
        color: await fetchPatientColor(patient)
      })));
  
      setEmergencyPatients(emergencyPatientsWithColors);
      setGeneralPatients(generalPatientsWithColors);

      setIsLoading(false);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch patient data. Please check your network connection.');
    }
  };
  

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
      console.log(error.response);
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

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true; 

      const intervalId = setInterval(() => {
        if (isActive) {
          fetchData();
        }
      }, 30000); 

      fetchData(); 

      return () => {
        clearInterval(intervalId);
        isActive = false; 
      };
    }, [email])
  );


  useFocusEffect(
    React.useCallback(() => {
      if (shouldFetchData || shouldFetchDataParam) {
        fetchData();
        fetchDoctorDetails();
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

  const getColor = async (patient) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/getChecked/${patient.patientId}/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch checked status');
      }
      const data = await response.json();
      return data ? 'palegreen' : 'tomato';
    } catch (error) {
      console.log(error.response);
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
      console.error('Failed to fetch checked status:', error);
    }}
  };

  // const emergencyPatientsWithColor = await Promise.all(emergencyPatients.map(async patient => ({
  //   ...patient,
  //   color: await getColor(patient)
  // })));

  // const generalPatientsWithColor = await Promise.all(generalPatients.map(async patient => ({
  //   ...patient,
  //   color: await getColor(patient)
  // })));

  const handlePatientDetailClick = async (patient) => {
    updateConsent(patient.consent.token);
    if (patient.color === 'tomato' && doctorDetails && doctorDetails.department === 'OP') {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/doctor/checkPatient/${patient.patientId}/${email}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          navigation.navigate('DoctorPatientDashboard', {
            patientId: patient.patientId,
          });
        } else {
          Alert.alert(
            'Error',
            'Session Expired!! Please Log in again',
            [
              { text: 'OK', onPress: () => {
                AsyncStorage.removeItem('token');
                navigation.navigate("HomePage");
              } }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error('Failed to check patient:', error);
        if (error.response && error.response.status === 500) {
          Alert.alert(
            'Error',
            'Session Expired!! Please Log in again',
            [
              { text: 'OK', onPress: () => {
                AsyncStorage.removeItem('token');
                navigation.navigate("HomePage");
              } }
            ],
            { cancelable: false }
          );
        } else {
          console.error('Failed to check patient:', error);
        }
      }
    }
    else{
      navigation.navigate('DoctorPatientDashboard', {
        patientId: patient.patientId,
      });
    }
  };
  
  
  const indexOfLastEmergencyPatient = currentEmergencyPage * patientsPerPage;
  const indexOfFirstEmergencyPatient = indexOfLastEmergencyPatient - patientsPerPage;
  const currentEmergencyPatients = emergencyPatients.slice(indexOfFirstEmergencyPatient, indexOfLastEmergencyPatient);

  const indexOfLastGeneralPatient = currentGeneralPage * patientsPerPage;
  const indexOfFirstGeneralPatient = indexOfLastGeneralPatient - patientsPerPage;
  const currentGeneralPatients = generalPatients.slice(indexOfFirstGeneralPatient, indexOfLastGeneralPatient);

  // const getIconColor = (patient) => {
  //   return patient.checked ? 'palegreen' : 'tomato';
  // };



  const renderPatientRows = (patientList) => {
    return patientList.map((patient) => (
      <TouchableOpacity key={patient.patientId} onPress={() => handlePatientDetailClick(patient)}>
        <Row
          data={[
            doctorDetails && doctorDetails.department === "OP" ? (
              <FontAwesome
                name="flag"
                size={20}
                color={patient.color}
                style={styles.flagIcon}
              />
            ) : null, 
            patient.patientId,
            patient.patientName,
            String(patient.age),
            patient.sex,
            patient.contact,
            patient.email,
            doctorDetails && doctorDetails.department === "IP" ? patient.bed.bId : "", // If doctor department is "IP", show bedId
          ]}
          style={styles.tableRow}
          textStyle={styles.tableText}
          flexArr={[1, 1, 2, 1, 1, 2, 2, 1]} // Adjust the width of each column here
        />
      </TouchableOpacity>
    ));
  };

  const paginateEmergency = (pageNumber) => setCurrentEmergencyPage(pageNumber);
  const paginateGeneral = (pageNumber) => setCurrentGeneralPage(pageNumber);

  if (!emergencyPatients || !generalPatients || isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={Patient_Details} style={styles.content}>
        {isSidebarOpen && <DoctorSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="DoctorPatientDetails" />}
        <ScrollView contentContainerStyle={styles.formContainer}>
        {doctorDetails && doctorDetails.department === "OP" && (
          <View style={styles.legendWrapper}>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <FontAwesome name="flag" size={20} color="palegreen" style={styles.legendIcon} />
                <Text style={styles.legendText}>Already Checked</Text>
              </View>
              <View style={styles.legendItem}>
                <FontAwesome name="flag" size={20} color="tomato" style={styles.legendIcon} />
                <Text style={styles.legendText}>Not Checked</Text>
              </View>
            </View>
          </View>
        )}

          <View style={styles.tableContainer}>
            <Text style={styles.tableName}>Emergency Patients</Text>
            <Table borderStyle={{ borderWidth: 0, borderColor: 'transparent' }} marginBottom={50}>
              <Row data={[doctorDetails && doctorDetails.department === "OP" ? 'Status' : '', 'PatientId', 'Name', 'Age', 'Sex', 'Contact', 'Email' , doctorDetails && doctorDetails.department === "IP" ? 'Bed ID' : '']} style={styles.tableHeader} textStyle={styles.headerText} flexArr={[1, 1, 2, 1, 1, 2, 2, 1]}/>
              {renderPatientRows(currentEmergencyPatients)}
            </Table>
            <View style={styles.pagination}>
              <TouchableOpacity 
                  onPress={() => paginateEmergency(currentEmergencyPage - 1)}
                  disabled={currentEmergencyPage === 1}
                  style={[styles.paginationButton, currentEmergencyPage === 1 && styles.disabledButton]}>
                  <Text style={styles.paginationText}>{previousIcon} Previous</Text>
              </TouchableOpacity>

              <Text style={styles.paginationText}>Page {currentEmergencyPage} of {Math.ceil(emergencyPatients.length / patientsPerPage)}</Text>

              <TouchableOpacity 
                  onPress={() => paginateEmergency(currentEmergencyPage + 1)}
                  disabled={currentEmergencyPage === Math.ceil(emergencyPatients.length / patientsPerPage)}
                  style={[styles.paginationButton, currentEmergencyPage === Math.ceil(emergencyPatients.length / patientsPerPage) && styles.disabledButton]}>
                  <Text style={styles.paginationText}>Next {nextIcon}</Text>
              </TouchableOpacity>
          </View>
            <View style={{ marginBottom: 10 }} />
            <Text style={styles.tableName}>General Patients</Text>
            <Table borderStyle={{ borderWidth: 0, borderColor: 'transparent' }}>
              <Row data={[doctorDetails && doctorDetails.department === "OP" ? 'Status' : '', 'PatientId', 'Name', 'Age', 'Sex', 'Contact', 'Email' , doctorDetails && doctorDetails.department === "IP" ? 'Bed ID' : '']} style={styles.tableHeader} textStyle={styles.headerText} flexArr={[1, 1, 2, 1, 1, 2, 2, 1]}/>
              {renderPatientRows(currentGeneralPatients)}
            </Table>
            <View style={styles.pagination}>
              <TouchableOpacity 
                  onPress={() => paginateGeneral(currentGeneralPage - 1)}
                  disabled={currentGeneralPage === 1}
                  style={[styles.paginationButton, currentGeneralPage === 1 && styles.disabledButton]}>
                  <Text style={styles.paginationText}>{previousIcon} Previous</Text>
              </TouchableOpacity>

              <Text style={styles.paginationText}>Page {currentGeneralPage} of {Math.ceil(generalPatients.length / patientsPerPage)}</Text>

              <TouchableOpacity 
                  onPress={() => paginateGeneral(currentGeneralPage + 1)}
                  disabled={currentGeneralPage === Math.ceil(generalPatients.length / patientsPerPage)}
                  style={[styles.paginationButton, currentGeneralPage === Math.ceil(generalPatients.length / patientsPerPage) && styles.disabledButton]}>
                  <Text style={styles.paginationText}>Next {nextIcon}</Text>
              </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    flexGrow: 1,
    paddingVertical: 10, 
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 30,
  },
  tableName: {
    fontSize: 25,
    padding: 5,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'teal',
  },
  tableHeader: {
    height: 50,
    backgroundColor: 'lightseagreen',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: 'teal',
    borderRadius: 4, // Rounded corners
    marginBottom: 3,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
    color: 'ivory',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'teal',
  },

  disabledButton: {
    opacity: 0.5,
},
  tableRow: {
    height: 35,
    backgroundColor: 'ghostwhite',
    borderWidth: 1,
    borderColor: 'plum',
    marginVertical: 3,
    borderRadius: 8, // Rounded corners
  },
  tableText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
  legendWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 80,
    marginBottom: 10,
  },
  legendIcon: {
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: 'teal',
  },
  flag: {
    width: 20,
    height: 20,
    borderRadius: 2,
    marginRight: 10,
  },
  flagIcon: {
    marginRight: 10,
    marginLeft: 25,
  },
});


export default DoctorPatientDetails;
