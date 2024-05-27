import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground ,Alert} from 'react-native';
import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useEmail } from '../Context/EmailContext';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import { Table, Row } from 'react-native-table-component';
import { FontAwesome } from '@expo/vector-icons';
import Patient_Details from "../Nurse_Comp_Images/Patient_Details.png";
import { useConsent } from '../Context/ConsentContext';
import LoadingScreen from "../Loading";

const previousIcon = '<<';
const nextIcon = '>>';

export default function NursePatient_Details({ navigation }) {
  const { email } = useEmail();
  const { updateConsent } = useConsent();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [generalPatients, setGeneralPatients] = useState([]);
  const [currentEmergencyPage, setCurrentEmergencyPage] = useState(1);
  const [currentGeneralPage, setCurrentGeneralPage] = useState(1);
  const [patientsPerPage] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handlePatientDetailClick = (patient) => {
    updateConsent(patient.consent.token);
    navigation.navigate('NursePatient_Dashboard', { patientId: patient.patientId });
  };

  const handleEmergencyButtonClick = async (patient) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/nurse/emergencyAlert/${patient.patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        Alert.alert(
          'Success',
          'Emergency Alert sent to assigned doctor succesfully',
        
        );
      
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
      console.error('Error fetching data:', error);
    }}
  };
  

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const emergencyResponse = await axios.get(`${API_BASE_URL}/nurse/getEmergencyPatients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderedEmergencyPatients = emergencyResponse.data.sort((a, b) => a.order - b.order);

      await Promise.all(
        orderedEmergencyPatients.map(async (patient) => {
          const response = await axios.get(`${API_BASE_URL}/nurse/vitals-and-symptoms/${patient.patientId}/${patient.consent.token}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          patient.colorData = response.data;
        })
      );
      setEmergencyPatients(orderedEmergencyPatients);

      const patientsResponse = await axios.get(`${API_BASE_URL}/nurse/getAllPatients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderedPatients = patientsResponse.data.sort((a, b) => a.order - b.order);

      await Promise.all(
        orderedPatients.map(async (patient) => {
          const response = await axios.get(`${API_BASE_URL}/nurse/vitals-and-symptoms/${patient.patientId}/${patient.consent.token}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          patient.colorData = response.data;
        })
      );
      setGeneralPatients(orderedPatients);
      setIsLoading(false);
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
      console.error('Error fetching data:', error);
    }}
  };


  // Fetch data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      // return () => {};
    }, [])
  );

  const indexOfLastEmergencyPatient = currentEmergencyPage * patientsPerPage;
  const indexOfFirstEmergencyPatient = indexOfLastEmergencyPatient - patientsPerPage;
  const currentEmergencyPatients = emergencyPatients.slice(indexOfFirstEmergencyPatient, indexOfLastEmergencyPatient);

  const indexOfLastGeneralPatient = currentGeneralPage * patientsPerPage;
  const indexOfFirstGeneralPatient = indexOfLastGeneralPatient - patientsPerPage;
  const currentGeneralPatients = generalPatients.slice(indexOfFirstGeneralPatient, indexOfLastGeneralPatient);

  const getStatusColor = (colorData) => {
    const { symptomsFilled, vitalsFilled } = colorData;
    if (symptomsFilled && vitalsFilled) return 'palegreen';
    if (symptomsFilled || vitalsFilled) return 'gold';
    return 'tomato';
  };

  

  const renderPatientRows = (patientList) => {
    return patientList.map((patient) => (
      <TouchableOpacity key={patient.patientId} onPress={() => handlePatientDetailClick(patient)}>
        <Row
          data={[
            <FontAwesome name="flag" size={20} color={getStatusColor(patient.colorData)} style={styles.flagIcon} />,
            patient.patientId,
            patient.patientName,
            String(patient.age),
            patient.sex,
            patient.department,
            patient.email,
            patient.contact,
            <TouchableOpacity 
              onPress={() => handleEmergencyButtonClick(patient)} 
              style={patient.department === 'OP' ? [styles.emergencyButton, styles.disabledButton] : styles.emergencyButton}
              disabled={patient.department === 'OP'}
            >
              <Text style={styles.emergencyButtonText}>Alert</Text>
            </TouchableOpacity>
,
          ]}
          style={styles.tableRow}
          textStyle={styles.tableText}
          flexArr={[1, 1, 3, 1, 1, 2, 3, 2]} // Adjust the width of each column here
        />
      </TouchableOpacity>
    ));
  };

  const paginateEmergency = (pageNumber) => setCurrentEmergencyPage(pageNumber);
  const paginateGeneral = (pageNumber) => setCurrentGeneralPage(pageNumber);

  if (!generalPatients || !emergencyPatients || isLoading) {
    return <LoadingScreen />;
  }


  return (
    <View style={styles.container}>
      <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ImageBackground source={Patient_Details} style={styles.content}>
        {isSidebarOpen && <NurseSidebar navigation={navigation} email={email} isSidebarOpen={isSidebarOpen} activeRoute="NursePatient_Details" />}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.legendWrapper}>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <FontAwesome name="flag" size={20} color="palegreen" style={styles.legendIcon} />
                <Text style={styles.legendText}>Both Symptoms & Vitals Filled</Text>
              </View>
              <View style={styles.legendItem}>
                <FontAwesome name="flag" size={20} color="gold" style={styles.legendIcon} />
                <Text style={styles.legendText}>Partially Filled</Text>
              </View>
              <View style={styles.legendItem}>
                <FontAwesome name="flag" size={20} color="tomato" style={styles.legendIcon} />
                <Text style={styles.legendText}>Not Filled</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableContainer}>
            {/* Emergency Patients Table */}
      <Text style={styles.tableName}>Emergency Patients</Text>
      <Table borderStyle={{ borderWidth: 0, borderColor: 'transparent' }} marginBottom={50}>
        <Row data={['Status', 'PatientId', 'Name', 'Age', 'Sex', 'Dept', 'Email', 'Contact','Action']} style={styles.tableHeader} textStyle={styles.headerText} flexArr={[1, 1, 3, 1, 1, 2, 3, 2]}/>
        {renderPatientRows(currentEmergencyPatients)}
      </Table>
      {/* Emergency Pagination */}
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


      {/* Add some space between tables */}
      <View style={{ marginBottom: 10 }} />

      {/* General Patients Table */}
      <Text style={styles.tableName}>General Patients</Text>
      <Table borderStyle={{ borderWidth: 0, borderColor: 'transparent' }}>
        <Row data={['Status', 'PatientId', 'Name', 'Age', 'Sex', 'Dept', 'Email', 'Contact','Action']} style={styles.tableHeader} textStyle={styles.headerText} flexArr={[1, 1, 3, 1, 1, 2, 3, 2]}/>
        {renderPatientRows(currentGeneralPatients)}
      </Table>
      {/* General Pagination */}
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
}

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
  emergencyButton: {
    backgroundColor: 'red',
    paddingVertical: 2,
    marginHorizontal: 5,
    marginVertical: 2,
    borderRadius: 5,
    alignItems: 'center', // Center the content horizontally
  justifyContent: 'center', 
  },
  
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
    maxWidth: '90%', 
  },disabledButton: {
    opacity: 0.5,
  }
});