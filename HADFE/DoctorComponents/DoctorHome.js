import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity,ImageBackground, Image } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import DoctorSideBar from './DoctorSideBar';
import DoctorHeader from './DoctorHeader';
import { API_BASE_URL } from '../config';
import {useEmail} from '../Context/EmailContext';
import { useConsent } from '../Context/ConsentContext';
import LoadingScreen from '../Loading';
import { LineChart } from 'react-native-gifted-charts';
import { PieChart ,BarChart} from 'react-native-gifted-charts';
import Doctor_Profile_BG from '../Doctor_Comp_Images/BG_Doctor_Profile.gif'

const DoctorHome = ({  route,navigation }) => {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  
  const { updateConsent } = useConsent();
  
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [generalPatients, setGeneralPatients] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const { shouldFetchData: shouldFetchDataParam } = route.params.shouldFetchData;
  const [doctorDetails,setDoctorDetails] = useState(null); 
  const [currentEmergencyPage, setCurrentEmergencyPage] = useState(1);
  const [currentGeneralPage, setCurrentGeneralPage] = useState(1);
  const [patientsPerPage] = useState(3);
  const [generalPatientsCount, setGeneralPatientsCount] = useState(0); // initializing to 0

  const [patientCounts, setPatientCounts] = useState({
    emergencyChecked: 0,
    emergencyUnchecked: 0,
    generalChecked: 0,
    generalUnchecked: 0
  });

  const [checkedStatusCounts, setCheckedStatusCounts] = useState({
    totalChecked: 0,
    totalUnchecked: 0
  });

  const [statusCounts, setStatusCounts] = useState({
    emergencyChecked: 0,
    emergencyUnchecked: 0,
    generalChecked: 0,
    generalUnchecked: 0
  });
  
  const [genderCounts, setGenderCounts] = useState({
    emergency: { male: 0, female: 0 },
    general: { male: 0, female: 0 }
  });
  
  
  
  useEffect(() => {
    setPatientCounts(countPatientStatus());
  }, [emergencyPatients, generalPatients]);
  
  // And then use these counts in your JSX to display them

  const fetchData = async () => {
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

      // Fetching emergency patients
      const generalPatientsCountResponse = await fetch(`${API_BASE_URL}/doctor/checkGeneralPatientCount/${email}`, {
        // method: 'GET',  // Ensure this is the method expected by the API
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(generalPatientsCountResponse);
      if (generalPatientsCountResponse.status === 500) {
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
      console.log(generalPatientsCountResponse);
      const generalCount = await generalPatientsCountResponse.json();
      setGeneralPatientsCount(generalCount); 
  
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
      
      // Count genders
    const emergencyGenderCounts = countGenders(emergencyPatientsWithColors);
    const generalGenderCounts = countGenders(generalPatientsWithColors);

    setGenderCounts({
      total: {
        male: emergencyGenderCounts.male + generalGenderCounts.male,
        female: emergencyGenderCounts.female + generalGenderCounts.female
      },
      emergency: emergencyGenderCounts,
      general: generalGenderCounts
    });

      setEmergencyPatients(emergencyPatientsWithColors);
      setGeneralPatients(generalPatientsWithColors);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch patient data. Please check your network connection.');
    }
  };

  const countCheckedStatus = () => {
    const totalChecked = emergencyPatients.concat(generalPatients).reduce((acc, patient) => {
      return acc + (patient.color === 'palegreen' ? 1 : 0);
    }, 0);
  
    const totalUnchecked = emergencyPatients.concat(generalPatients).reduce((acc, patient) => {
      return acc + (patient.color === 'tomato' ? 1 : 0);
    }, 0);
  
    // Update the state with the new counts
    setCheckedStatusCounts({
      totalChecked,
      totalUnchecked
    });
  };
  
  
  const countPatientStatus = () => {
    const countPatients = (patients) => ({
      checked: patients.filter(patient => patient.color === 'palegreen').length,
      unchecked: patients.filter(patient => patient.color === 'tomato').length
    });
  
    const emergencyStatusCounts = countPatients(emergencyPatients);
    const generalStatusCounts = countPatients(generalPatients);
  
    // Update the state with the computed values
    setStatusCounts({
      emergencyChecked: emergencyStatusCounts.checked,
      emergencyUnchecked: emergencyStatusCounts.unchecked,
      generalChecked: generalStatusCounts.checked,
      generalUnchecked: generalStatusCounts.unchecked
    });
  };
  
  const countGenders = (patients) => {
    const genderCounts = { male: 0, female: 0 };
    patients.forEach(patient => {
      if (patient.sex === 'Male') {
        genderCounts.male++;
      } else if (patient.sex === 'Female') {
        genderCounts.female++;
      }
    });
    return genderCounts;
  };
  
  // Call this function within useEffect where you update your patients data
  useEffect(() => {
    countCheckedStatus();
    countPatientStatus();
  }, [emergencyPatients, generalPatients]); // Ensure this includes all dependencies that affect the count

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const defaultPatientVisits = [
    { x: '05-05-2024', y: 5 },
    { x: '06-05-2024', y: 3 },
    { x: '07-05-2024', y: 6 },
    { x: '08-05-2024', y: 7 },
    { x: '09-05-2024', y: 2 },
    { x: '10-05-2024', y: 8 },
    { x: '11-05-2024', y: 4 },
  ];

  const [patientVisits, setPatientVisits] = useState(defaultPatientVisits);
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

  const fetchPatientVisitStats = async () => {
    const token = await AsyncStorage.getItem('token');
    const statsUrl = `${API_BASE_URL}/doctor/weeklyPatientVisits/${email}`;
    try {
      const response = await fetch(statsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setPatientVisits(data.map(item => ({
          value: item.count,
          dataPointText: item.count,
          label: item.date,
          showXAxisIndex: true
        })));
        console.log(patientVisits);
      } else {
        throw new Error('Failed to fetch patient visit stats');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  
 


  useFocusEffect(
    React.useCallback(() => {
      if (shouldFetchData || shouldFetchDataParam) {
        fetchData();
        fetchDoctorDetails();
        fetchPatientVisitStats();
        setShouldFetchData(false);
      }
    }, [shouldFetchData, shouldFetchDataParam])
  );
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.shouldFetchData || shouldFetchDataParam) {
        setShouldFetchData(true);
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params?.shouldFetchData, shouldFetchDataParam]);


  useEffect(() => {
    // const { totalChecked, totalUnchecked } = countCheckedStatus();
    // console.log("Checked Patients:", totalChecked);
    // console.log("Unchecked Patients:", totalUnchecked);

    // const statusCounts = countPatientStatus();
    // console.log("Emergency Checked:", statusCounts.emergencyChecked);
    // console.log("Emergency Unchecked:", statusCounts.emergencyUnchecked);
    // console.log("General Checked:", statusCounts.generalChecked);
    // console.log("General Unchecked:", statusCounts.generalUnchecked);
    // Optionally set these in state if needed for rendering
  }, [emergencyPatients, generalPatients]);
  

  // useEffect(() => {
  //   const { totalChecked, totalUnchecked } = countCheckedStatus();
  //   console.log("Checked Patients:", totalChecked);
  //   console.log("Unchecked Patients:", totalUnchecked);
  //   // You can also set these in state if you need to display them in your component
  // }, [emergencyPatients, generalPatients]);
  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (shouldFetchData || shouldFetchDataParam) {
        
  //       fetchDoctorDetails();
  //       setShouldFetchData(false);
  //     }
  //   }, [shouldFetchData, shouldFetchDataParam])
  // );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setShouldFetchData(true);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  
  const staticData = [
    { x: '01', y: 10 },
    { x: '02', y: 20 },
    { x: '03', y: 30 },
    { x: '04', y: 40 },
    { x: '05', y: 50 }
  ];
  const chartData = [
    { x: '05-05', y: 5 },
    { x: '06-05', y: 3 },
    { x: '07-05', y: 6 },
    { x: '08-05', y: 7 },
    { x: '09-05', y: 2 },
    { x: '10-05', y: 8 },
    { x: '11-05', y: 4 },
  ];const lineData = [
    {value: 0, dataPointText: '0',label: '2005', showXAxisIndex: true},
    {value: 10, dataPointText: '10', label: '2005', showXAxisIndex: true},
    {value: 8, dataPointText: '8',label: '2005', showXAxisIndex: true},
    {value: 58, dataPointText: '58',label: '2005', showXAxisIndex: true},
    {value: 56, dataPointText: '56',label: '2005', showXAxisIndex: true},
    {value: 78, dataPointText: '78',label: '2005', showXAxisIndex: true},
    {value: 74, dataPointText: '74',label: '2005', showXAxisIndex: true},
    {value: 98, dataPointText: '98',label: '2005', showXAxisIndex: true},
  ];

  const lineData2 = [
    {value: 0, dataPointText: '0'},
    {value: 20, dataPointText: '20'},
    {value: 18, dataPointText: '18'},
    {value: 40, dataPointText: '40'},
    {value: 36, dataPointText: '36'},
    {value: 60, dataPointText: '60'},
    {value: 54, dataPointText: '54'},
    {value: 85, dataPointText: '85'},
  ];

  const getTotalPatients = () => {
    return generalPatients.length + emergencyPatients.length;
  };

  const getEmergencyPatientsCount = () => {
    return emergencyPatients.length;
  };

  const getNonEmergencyPatientsCount = () => {
    return generalPatients.length;
  };

  const barData = [
    { value: genderCounts.emergency.male, label: 'E. Males', frontColor: 'dodgerblue' },
    { value: genderCounts.emergency.female, label: 'E. Females', frontColor: 'mediumorchid' },
    { value: genderCounts.general.male, label: 'G. Males', frontColor: 'dodgerblue' },
    { value: genderCounts.general.female, label: 'G. Females', frontColor: 'mediumorchid' },
  ];

  useEffect(() => {
    console.log("Emergency Patients - Males:", genderCounts.emergency.male);
    console.log("Emergency Patients - Females:", genderCounts.emergency.female);
    console.log("Non-Emergency Patients - Males:", genderCounts.general.male);
    console.log("Non-Emergency Patients - Females:", genderCounts.general.female);
  }, [genderCounts]);
  

  return (
    <View style={styles.container}>
      <DoctorHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && <DoctorSideBar navigation={navigation} activeRoute="DoctorHome"/>}
        <ScrollView contentContainerStyle={styles.formContainer}>
        <ImageBackground source={Doctor_Profile_BG} style={styles.detailsContainer}>
                        {doctorDetails ? (
                            <>
                                <Text style={styles.detailHeading}>Your Profile Overview...</Text>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Name:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.name}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Age:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.age}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Sex:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.sex}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Contact:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.contact}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Email:</Text>
                                    <Text style={styles.detailValue}>{doctorDetails.email}</Text>
                                </View>
                                <Image
                                    source={{ uri: doctorDetails.photo }}
                                    style={styles.doctorImage}
                                />
                            </>
                        ) : (
                            <Text>Loading doctor details...</Text>
                        )}
                    </ImageBackground>
            {/* <Text style={styles.chartTitle}>Gender Distribution: Emergency vs General</Text>
      <BarChart
        data={barData}
        barWidth={40}
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={5}
        barBorderRadius={5}
        frontColor="tomato"
        yAxisTextStyle={{ color: 'gray' }}
        xAxisTextStyle={{ color: 'gray' }}
        height={250}
        horizontal
      /> */}
            {/* <LineChart
          data={lineData}
          data2={lineData2}
          height={500}
          showVerticalLines
          spacing={88}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          textColor1="green"
          dataPointsHeight={6}
          dataPointsWidth={6}
          dataPointsColor1="blue"
          dataPointsColor2="red"
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
      /> */}

<View style={styles.legendWrapper}>
            <View style={styles.legendContainer}>
              {/* Legend for Emergency vs Non-Emergency Patients */}
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: 'seagreen' }]} />
                <Text style={styles.legendText}>Emergency Patients</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: 'steelblue' }]} />
                <Text style={styles.legendText}>Non-Emergency Patients</Text>
              </View>

              {doctorDetails && doctorDetails.department === 'OP' ? (

            <>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: 'palegreen' }]} />
                <Text style={styles.legendText}>Checked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: 'tomato' }]} />
                <Text style={styles.legendText}>Not Checked</Text>
              </View>
              </>
              
              ):(
                <>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: 'skyblue' }]} />
                <Text style={styles.legendText}>Male Patients</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: 'pink' }]} />
                <Text style={styles.legendText}>Female Patients</Text>
              </View>
              </>
              )}
            </View>
          </View>

          <View style={styles.pieChartsContainer}>
  {/* Pie Chart 1: Emergency vs Non-Emergency */}
  <View style={styles.pieChartItem}>
    <Text style={styles.chartTitle}>Emergency vs Non-Emergency Patients</Text>
    <PieChart
  data={[
    {
      value: getEmergencyPatientsCount(),
      color: 'seagreen',
      text: `${getEmergencyPatientsCount()}`, // Show count value instead of text
      textColor: 'white',
    },
    {
      value: getNonEmergencyPatientsCount(),
      color: 'steelblue',
      text: `${getNonEmergencyPatientsCount()}`, // Show count value instead of text
      textColor: 'white',
    },
  ]}
  donut={true}
  radius={90}
  showText={true}
  textSize={20}
  strokeWidth={3}
  strokeColor={'white'}
  //isThreeD={true}
  //tilt={1}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightblue'}
  textStyle={{ fontWeight: 'bold' }}
  textBackgroundColor={'transparent'}
  innerRadius={40}
  innerCircleColor={'white'}
  innerCircleBorderColor={'white'}
  innerCircleBorderWidth={3}  
  onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
/>

    <Text style={styles.countText}>Total: {getTotalPatients()}</Text>
    </View>


    {doctorDetails && doctorDetails.department === 'OP' ? (
      <>
    <View style={styles.pieChartItem}>
  <Text style={styles.chartTitle}>Checked Status for All Patients</Text>
  <PieChart
    data={[
      { value: checkedStatusCounts.totalChecked, color: 'palegreen', text: `${checkedStatusCounts.totalChecked}`, textColor: 'teal' },
      { value: checkedStatusCounts.totalUnchecked, color: 'tomato', text: `${checkedStatusCounts.totalUnchecked}`, textColor: 'teal' }
    ]}
    donut={true}
    radius={90}
    showText={true}
    textSize={20}
    strokeWidth={3}
  strokeColor={'white'}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightgoldenrodyellow'}
    textStyle={{ fontWeight: 'bold' }}
    textBackgroundColor={'transparent'}
    innerRadius={40}
    innerCircleColor={'white'}
    innerCircleBorderColor={'white'}
    innerCircleBorderWidth={3}  
    onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
  />
  <Text style={styles.countText}>Total: {getTotalPatients()}</Text>
</View>
  <View style={styles.pieChartItem}>
  <Text style={styles.chartTitle}>Checked Status for Emergency Patients</Text>
  <PieChart
    data={[
      { value: statusCounts.emergencyChecked, color: 'palegreen', text: statusCounts.emergencyChecked, textColor: 'teal' },
      { value: statusCounts.emergencyUnchecked, color: 'tomato', text: statusCounts.emergencyUnchecked, textColor: 'teal' },
    ]}
    donut={true}
    radius={90}
    showText={true}
    textSize={20}
    strokeWidth={3}
  strokeColor={'white'}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightgoldenrodyellow'}
    textStyle={{ fontWeight: 'bold' }}
    textBackgroundColor={'transparent'}
    innerRadius={40}
    innerCircleColor={'white'}
    innerCircleBorderColor={'white'}
    innerCircleBorderWidth={3}  
    onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
  />
  <Text style={styles.countText}>Total: {getEmergencyPatientsCount()}</Text>
</View>

<View style={styles.pieChartItem}>
  <Text style={styles.chartTitle}>Checked Status for General Patients</Text>
  <PieChart
    data={[
      { value: statusCounts.generalChecked, color: 'palegreen', text: statusCounts.generalChecked, textColor: 'teal' },
      { value: statusCounts.generalUnchecked, color: 'tomato', text: statusCounts.generalUnchecked, textColor: 'teal' },
    ]}
    donut={true}
    radius={90}
    showText={true}
    textSize={20}
    strokeWidth={3}
  strokeColor={'white'}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightgoldenrodyellow'}
    textStyle={{ fontWeight: 'bold' }}
    textBackgroundColor={'transparent'}
    innerRadius={40}
    innerCircleColor={'white'}
    innerCircleBorderColor={'white'}
    innerCircleBorderWidth={3}  
    onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
  />
  <Text style={styles.countText}>Total: {getNonEmergencyPatientsCount()}</Text>
</View>
</>
    ):(
<>

<View style={styles.pieChartItem}>
  <Text style={styles.chartTitle}>Gender Status for All Patients</Text>
  <PieChart
    data={[
      { value: genderCounts.emergency.male+genderCounts.general.male, color: 'skyblue', text: `${genderCounts.emergency.male+genderCounts.general.male}`, textColor: 'teal' },
      { value: genderCounts.emergency.female+genderCounts.general.female, color: 'pink', text: `${genderCounts.emergency.female+genderCounts.general.female}`, textColor: 'teal' }
    ]}
    donut={true}
    radius={90}
    showText={true}
    textSize={20}
    strokeWidth={3}
  strokeColor={'white'}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightgoldenrodyellow'}
    textStyle={{ fontWeight: 'bold' }}
    textBackgroundColor={'transparent'}
    innerRadius={40}
    innerCircleColor={'white'}
    innerCircleBorderColor={'white'}
    innerCircleBorderWidth={3}  
    onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
  />
  <Text style={styles.countText}>Total: {getTotalPatients()}</Text>
</View>
  <View style={styles.pieChartItem}>
  <Text style={styles.chartTitle}>Gender Status for Emergency Patients</Text>
  <PieChart
    data={[
      { value: genderCounts.emergency.male, color: 'skyblue', text: genderCounts.emergency.male, textColor: 'teal' },
      { value: genderCounts.emergency.female, color: 'pink', text: genderCounts.emergency.female, textColor: 'teal' },
    ]}
    donut={true}
    radius={90}
    showText={true}
    textSize={20}
    strokeWidth={3}
  strokeColor={'white'}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightgoldenrodyellow'}
    textStyle={{ fontWeight: 'bold' }}
    textBackgroundColor={'transparent'}
    innerRadius={40}
    innerCircleColor={'white'}
    innerCircleBorderColor={'white'}
    innerCircleBorderWidth={3}  
    onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
  />
  <Text style={styles.countText}>Total: {genderCounts.emergency.male + genderCounts.emergency.female}</Text>
</View>

<View style={styles.pieChartItem}>
  <Text style={styles.chartTitle}>Gender Status for General Patients</Text>
  <PieChart
    data={[
      { value: genderCounts.general.male, color: 'skyblue', text: genderCounts.general.male, textColor: 'teal' },
      { value: genderCounts.general.female, color: 'pink', text: genderCounts.general.female, textColor: 'teal' },
    ]}
    donut={true}
    radius={90}
    showText={true}
    textSize={20}
    strokeWidth={3}
  strokeColor={'white'}
  focusOnPress={true}
  toggleFocusOnPress={true}
  showGradient={true}
  gradientCenterColor={'lightgoldenrodyellow'}
    textStyle={{ fontWeight: 'bold' }}
    textBackgroundColor={'transparent'}
    innerRadius={40}
    innerCircleColor={'white'}
    innerCircleBorderColor={'white'}
    innerCircleBorderWidth={3}  
    onPress={(item, index) => console.log(`Pressed: ${item.text}`)}
  />
  <Text style={styles.countText}>Total: {genderCounts.general.male + genderCounts.general.female}</Text>
</View>
</>
    )}

</View>

          
         
      
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    // flex: 1, Remove this line to allow ScrollView to take up the entire space
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'lightcyan',
    marginBottom: 20,
    fontSize: 14,
  },
  detailHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 20,
    color: 'crimson',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    width: 100,
    fontSize: 14,
    color: 'lavenderblush',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: 'lavenderblush',
  },
  scheduleContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  scheduleHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
  },
  nurseImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'white',
  },
  scheduleLabels: {
    marginTop: 10,
    textAlign: 'center',
  },
  // Style for table header (head)
  head: { 
    height: 40, 
    backgroundColor: '#b2f5ea', 
    justifyContent: 'center', // Center align the content vertically
    flexDirection: 'row', // Make the content of the header row aligned horizontally
  },
  // Style for table cell text (text)
  text: { 
    margin: 6, 
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center', // Center align the text
    padding: 10, // Add padding here
  },
  
  row: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  barChart: {
    height: 200,
    marginTop: 20, // Adjust as needed to create space between the table and the bar chart
  },
  rightImage: {
    marginLeft: 10,
    width: 240,
    height: 450,
    resizeMode: 'cover',
    borderRadius: 50,
    marginTop: 20,
    marginRight: 20,
  },
  pieChartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 25,
    marginTop: 0,
  },
  pieChartItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pieLegend: {
    flexDirection: 'column',
  },
  colorKeyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  colorKeyText: {
    padding: 5,
    borderRadius: 5,
    color: 'teal',
    fontWeight: 'bold',
  },

  tableContainer: {
    flex: 1,
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    marginTop: -10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    color: 'teal',
    backgroundColor: '#b2f5ea', // Change to light teal color
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  headerText: {
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center',
    fontSize: 14, // Smaller font size
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    alignItems: 'center',
    fontSize: 12, // Smaller font size
    textAlign: 'center', // Center align the text horizontally
  },
  tableName: {
    fontSize: 16, // Smaller font size
    fontWeight: 'bold',
    marginBottom: 10, // Added margin bottom
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  paginationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'teal',
  },
  countButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  countButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
legendWrapper: {
  //position: 'absolute',
  // top: 10,
  // right: 10,
  margin: 20,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 15,
  backgroundColor: '#fff',
},
legendContainer: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},
legendItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  //marginBottom: 5,
  marginHorizontal: 100,
  marginRight: 0,
},
legendColorBox: {
  width: 15,
  height: 15,
  marginRight: 5,
},
legendText: {
  fontSize: 11,
},
legendBox: {
  width: 30,
  height: 20,
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 2,
},
legendBoxText: {
  color: 'white',
  fontWeight: 'bold',
},
countText: {
  fontSize: 14,
  fontWeight: 'bold',
  marginLeft: 10, // Add some left margin for spacing
  color: 'teal', // Change the text color to teal
},doctorImage: {
  width: 200,
  height: 200,
  position: 'absolute',
  top: 20,
  right: 40,
  borderRadius: 100,
  borderWidth: 2,
  borderColor: 'white',
},
});

export default DoctorHome;