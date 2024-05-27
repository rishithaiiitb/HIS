import { NavigationContainer ,useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorHome from './DoctorComponents/DoctorHome';
import DoctorProfile from './DoctorComponents/DoctorProfile.js';
import DoctorPatientDashboard from './DoctorComponents/DoctorPatientDashboard';
import DoctorPatientDetails from './DoctorComponents/DoctorPatientDetails';
import AddMedications from './DoctorComponents/AddMedication';
import ViewMedications from './DoctorComponents/ViewMedications';
import EditMedication from './DoctorComponents/EditMedication';
import ViewTests from './DoctorComponents/ViewTests';
import AddTest from './DoctorComponents/AddTest';
import EditTest from './DoctorComponents/EditTest';
import PastHistory from './DoctorComponents/PastHistory';
import TestImages from './DoctorComponents/TestImages';
import SymptomsImages from './DoctorComponents/SymptomsImages';
import PastImages from './DoctorComponents/PastImages';
import RecommendIP from './DoctorComponents/RecommendIP';
import RecordProgress from './DoctorComponents/RecordProgress';
import ScanScreen from './DoctorComponents/QRScanner'
import ReceptionistHome from './ReceptionistComponents/ReceptionistHome';
import Appointment from './ReceptionistComponents/Appointment';
import EditPatientDetails from './ReceptionistComponents/EditPatientDetails';
import AddEmployee from './AdminComponents/addEmployee';
import AddSpecialization from './AdminComponents/AddSpecialization';
import RoleSelection from './AdminComponents/viewDetails';
import EditPharmacyScreen from './AdminComponents/editPharmacy';
import EditReceptionistScreen from './AdminComponents/editReceptionist';
import EditDoctorScreen from './AdminComponents/editDoctor';
import ViewDoctors from './AdminComponents/viewDoctors';
import EditNurseScreen from './AdminComponents/editNurse';
import ViewNurses from './AdminComponents/viewNurses';
import ViewReceptionists from './AdminComponents/viewReceptionists';
import ViewPharmacies from './AdminComponents/viewPharmacies';
import AdminHome from './AdminComponents/adminDashboard';
import ViewSpecialization from './AdminComponents/ViewSpecialization';
import PharmacyDetails from './PharmacyComponents/PharamcyHome';
import ViewMedication from './PharmacyComponents/ViewMedication';
import AddVitals from './NurseComponents/AddVitals';
import ViewVitals from './NurseComponents/ViewVitals';
import EditVitals from './NurseComponents/ EditVitals';
import AddSymptoms from './NurseComponents/AddSymptoms';
import ViewSymptoms from './NurseComponents/ViewSymptoms';
import EditSymptoms from './NurseComponents/EditSymptoms';
import NurseHome from './NurseComponents/NurseHome';
import React, { useState, useEffect } from 'react';
import NursePatient_Details from './NurseComponents/NursePatient_Details';
import NursePatient_Dashboard from './NurseComponents/NursePatient_Dashboard';
import AddPastHistory from './NurseComponents/AddPastHistory';
import ViewPastHistory from './NurseComponents/ViewPastHistory';
import EditPastHistory from './NurseComponents/EditPastHistory';
import AddSymptomimage from './NurseComponents/AddSymptomImage';
import ViewSymptomImage from './NurseComponents/ViewSymptomImage';
import EditSymptomImage from './NurseComponents/EditSymptomImage';
import AddPastImage from './NurseComponents/AddPastImage';
import ViewPastImage from './NurseComponents/ViewPastImage';
import EditPastImage from './NurseComponents/EditPastImage';
import AddTestResult from './NurseComponents/AddTestResult';
import ViewTest from './NurseComponents/ViewTest';
import NurseEditTest from './NurseComponents/NurseEditTest';
import AddTestImage from './NurseComponents/AddTestImage';
import ViewTestImage from './NurseComponents/ViewTestImage';
import EditTestImage from './NurseComponents/EditTestImage';
import NurseProfile from './NurseComponents/NurseProfile';
import HomePage from './Home';
import {EmailProvider} from './Context/EmailContext';
import { ConsentProvider } from './Context/ConsentContext';
import Login from './Login';
import { Alert, LogBox } from 'react-native';
import { AppState,Keyboard } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { PanResponder } from 'react-native';
import  { useRef } from 'react';
import AdminSidebar from './AdminComponents/AdminSidebar';
import PharmacySidebar from './PharmacyComponents/PharmacySidebar';
import NurseSidebar from './NurseComponents/Sidebar';
import ReceptionistSidebar from './ReceptionistComponents/Sidebar';
import DoctorSideBar from './DoctorComponents/DoctorSideBar';
import ChangePasswordPage from './ChangePassword';
import DoctorHeader from './DoctorComponents/DoctorHeader';
import DoctorNotificationPage from './DoctorComponents/DoctorNotificationPage';
import TermsAndConditions from './ReceptionistComponents/Termsandconditions';
import OTPVerification from './ReceptionistComponents/OTPVerification';
import OTPVerify from './OtpVerification';
import ViewCanvas from './DoctorComponents/ViewCanvas';
import EditCanvas from './DoctorComponents/EditCanvas';
import WriteCanvas from './DoctorComponents/WriteCanvas';
import CaptureTestImage from './NurseComponents/clickTestImg';
import CaptureImageScreen from './NurseComponents/clickSymptomImg';
import CapturePastImage from './NurseComponents/clickPastimg';
import Medications from './NurseComponents/Medications';



const App = () => {
  const Stack = createStackNavigator();
  LogBox.ignoreAllLogs();

  const [isInactive, setIsInactive] = useState(false);
  const lastInteraction = useRef(new Date());
  const inactivityTimer = useRef(null);
  const navigationRef = useRef(null);
  const IDLE_LOGOUT_TIME_LIMIT = 10 * 60 * 1000; 

    const getNetworkInfo = async () => {
      const networkState = await NetInfo.fetch();
      console.log("Connection type:", networkState.type);
      console.log("Is connected?", networkState.isConnected);
      if (networkState.details && networkState.details.ipAddress) {
        console.log("IP Address:", networkState.details.ipAddress);
      }
    };


  const checkInactive = () => {
    if (inactivityTimer.current) {
      return;
    }

    inactivityTimer.current = setTimeout(() => {
      setIsInactive(true);
      clearInterval(inactivityTimer.current);
      inactivityTimer.current = null;
      navigationRef.current?.navigate('HomePage');
    }, IDLE_LOGOUT_TIME_LIMIT);
  };

  const resetTimeout = () => {
    clearInterval(inactivityTimer.current);
    inactivityTimer.current = null;
    lastInteraction.current = new Date();

    const touchEndTimeout = setTimeout(() => {
      setIsInactive(true);
      clearInterval(inactivityTimer.current);
      inactivityTimer.current = null;
      navigationRef.current?.navigate('HomePage');
    }, IDLE_LOGOUT_TIME_LIMIT);

    inactivityTimer.current = touchEndTimeout;
  };


  useEffect(() => {
    checkInactive();

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        resetTimeout();
      }
    };

    const keyboardShowSubscription = Keyboard.addListener('keyboardDidShow', resetTimeout);
    const keyboardHideSubscription = Keyboard.addListener('keyboardDidHide', resetTimeout);

    const mylistner=AppState.addEventListener('change', handleAppStateChange);

    return () => {
      mylistner.remove();
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
      clearInterval(inactivityTimer.current);
    };
  }, [resetTimeout]);


  // Initialize PanResponder to track touch interactions
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false,
      onResponderGrant: () => {
        lastInteraction.current = new Date(); // Update last interaction time on touch
        resetTimeout(); // Reset inactivity timer on touch
      },
    })
  ).current;
 
 

  
  return (
    <NavigationContainer ref={navigationRef}>
      <EmailProvider>
      <ConsentProvider>
      <Stack.Navigator screenOptions={{ headerShown: false,
            ...panResponder.panHandlers }} initialRouteName="HomePage">
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage}/>
          <Stack.Screen name="DoctorHome" component={DoctorHome} />
          <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
          <Stack.Screen name="DoctorPatientDashboard" component={DoctorPatientDashboard} />
          <Stack.Screen name="DoctorPatientDetails" component={DoctorPatientDetails} />
          <Stack.Screen name="DoctorHeader" component={DoctorHeader} />
          <Stack.Screen name="DoctorNotificationPage" component={DoctorNotificationPage} />
          <Stack.Screen name="AddMedications" component={AddMedications} />
          <Stack.Screen name="ViewMedications" component={ViewMedications} />
          <Stack.Screen name="EditMedication" component={EditMedication} />
          <Stack.Screen name="AddTest" component={AddTest} />
          <Stack.Screen name="DoctorSidebar" component={DoctorSideBar} />
          <Stack.Screen name="ViewTests" component={ViewTests} />
          <Stack.Screen name="EditTest" component={EditTest} />
          <Stack.Screen name="PastHistory" component={PastHistory} />
          <Stack.Screen name="TestImages" component={TestImages} />
          <Stack.Screen name="SymptomsImages" component={SymptomsImages} />
          <Stack.Screen name="PastImages" component={PastImages} />
          <Stack.Screen name="RecommendIP" component={RecommendIP} />
          <Stack.Screen name="RecordProgress" component={RecordProgress} />
          <Stack.Screen name="QRScanner" component={ScanScreen} />
          <Stack.Screen name="WriteCanvas" component={WriteCanvas} />
          <Stack.Screen name="ViewCanvas" component={ViewCanvas} />
          <Stack.Screen name="EditCanvas" component={EditCanvas} />
          <Stack.Screen name="PharmacySidebar" component={PharmacySidebar} />
          <Stack.Screen name="ReceptionistHome" component={ReceptionistHome} />
          <Stack.Screen name="Appointment" component={Appointment} />
          <Stack.Screen name = "TermsAndConditions" component={TermsAndConditions} />
          <Stack.Screen name = "OTPVerification" component={OTPVerification} />
          <Stack.Screen name="ReceptionistSidebar" component={ReceptionistSidebar} />
          <Stack.Screen name="EditPatientDetails" component={EditPatientDetails} />
          <Stack.Screen name="AdminHome" component={AdminHome} /> 
          <Stack.Screen name="AdminSidebar" component={AdminSidebar} /> 
          <Stack.Screen name="AddEmployee" component={AddEmployee} />
          <Stack.Screen name="AddSpecialization" component={AddSpecialization} />
          <Stack.Screen name="RoleSelection" component={RoleSelection} />
          <Stack.Screen name="ViewDoctors" component={ViewDoctors} />
          <Stack.Screen name="EditDoctorScreen" component={EditDoctorScreen} />
          <Stack.Screen name="ViewNurses" component={ViewNurses} />
          <Stack.Screen name="EditNurseScreen" component={EditNurseScreen} />
          <Stack.Screen name="ViewReceptionists" component={ViewReceptionists} />
          <Stack.Screen name="EditReceptionistScreen" component={EditReceptionistScreen} />
          <Stack.Screen name="ViewPharmacies" component={ViewPharmacies} />
          <Stack.Screen name="EditPharmacyScreen" component={EditPharmacyScreen} />
          <Stack.Screen name="ViewSpecialization" component={ViewSpecialization} />
          <Stack.Screen name="PharmacyHome" component={PharmacyDetails} />
          <Stack.Screen name="PharmacyPatient_Details" component={ViewMedication} />
          <Stack.Screen name="NurseHome" component={NurseHome} />
          <Stack.Screen name="NurseProfile" component={NurseProfile} />
          <Stack.Screen name="NursePatient_Details" component={NursePatient_Details} />
          <Stack.Screen name="NursePatient_Dashboard" component={NursePatient_Dashboard} />
          <Stack.Screen name="AddVitals" component={AddVitals} />
          <Stack.Screen name="NurseSidebar" component={NurseSidebar} />
          <Stack.Screen name="viewVitals" component={ViewVitals} />
          <Stack.Screen name="EditVitals" component={EditVitals} />
          <Stack.Screen name="AddSymptoms" component={AddSymptoms} />
          <Stack.Screen name="viewSymptoms" component={ViewSymptoms} />
          <Stack.Screen name="EditSymptoms" component={EditSymptoms} />
          <Stack.Screen name="AddPastHistory" component={AddPastHistory} />
          <Stack.Screen name="viewPastHistory" component={ViewPastHistory} />
          <Stack.Screen name="EditPastHistory" component={EditPastHistory} />
          <Stack.Screen name="AddSymptomImages" component={AddSymptomimage} />
          <Stack.Screen name="ViewSymptomImage" component={ViewSymptomImage} />
          <Stack.Screen name="EditSymptomImage" component={EditSymptomImage} />
          <Stack.Screen name="AddPastImage" component={AddPastImage} />
          <Stack.Screen name="ViewPastImage" component={ViewPastImage} />
          <Stack.Screen name="EditPastImage" component={EditPastImage} />
          <Stack.Screen name="AddTestResult" component={AddTestResult} />
          <Stack.Screen name="ViewTest" component={ViewTest} />
          <Stack.Screen name="NurseEditTest" component={NurseEditTest} />
          <Stack.Screen name="AddTestImage" component={AddTestImage} />
          <Stack.Screen name="ViewTestImage" component={ViewTestImage} />
          <Stack.Screen name="EditTestImage" component={EditTestImage} />
          <Stack.Screen name="OTPVerify" component={OTPVerify} />
          <Stack.Screen name="CaptureTestImage" component={CaptureTestImage} />
          <Stack.Screen name="CaptureImageScreen" component={CaptureImageScreen} />
          <Stack.Screen name="CapturePastImage" component={CapturePastImage} />
          <Stack.Screen name="Medications" component={Medications} />
        </Stack.Navigator>
        </ConsentProvider>
      </EmailProvider>
    </NavigationContainer>
  );
};
export default App;