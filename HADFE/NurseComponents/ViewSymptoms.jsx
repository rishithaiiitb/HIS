import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ImageBackground,Image, FlatList  } from 'react-native';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import { MaterialIcons } from '@expo/vector-icons';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import LoadingScreen from '../Loading';
import BG_Symptoms from "../Nurse_Comp_Images/BG_Symptoms.jpg";
import View_Symptom from "../Nurse_Comp_Images/View_Symptom.gif";
import { useConsent } from '../Context/ConsentContext';


export default function ViewSymptoms({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [symptoms, setSymptoms] = useState([]);
    const patientId = route.params.patientId;
    const {consentToken} = useConsent();
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/nurse/viewSymptoms/${patientId}/${consentToken}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                });
                setSymptoms([response.data]);
                setIsLoading(false);
                setLoading(false); 
            } catch (error) {
                setLoading(false);
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
                console.error('Error fetching patient symptoms:', error);
                setIsLoading(false);
              }}
        };
        if (isLoading) {
            fetchSymptoms();
        }
    }, [isLoading, patientId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsLoading(true); 
        });

        return unsubscribe;
    }, [navigation]);


    const handleEdit = (symptomid) => {
        
        navigation.navigate('EditSymptoms', { patientId,symptomid });
    };
    const handleadd = (patientId) => {
        
        navigation.navigate('AddSymptoms', { patientId});
    };


    const handleDelete = async (symptomid) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/nurse/deleteSymptoms/${symptomid}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            setIsLoading(true);
            navigation.navigate('viewSymptoms',{patientId})
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
            console.error('Error deleting symptoms:', error);
          }}
    };

    if(loading)
    {
        return <LoadingScreen/>
    }

    return (
        <View style={styles.container}>
            <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={BG_Symptoms} style={styles.content}>
                {isSidebarOpen && <NurseSidebar navigation={navigation} email={email} activeRoute="NursePatient_Details" />}
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.heading}>Symptom Snapshot</Text>
                    <View style={styles.symptomsList}>
                        {symptoms && symptoms.map((item, index) => (
                            <View key={index} style={styles.symptomsContainer}>
                                {item.symptom1 && (
                                    <Text style={styles.symptomText}>{item.symptom1}</Text>
                                )}
                                {item.symptom2 && (
                                    <Text style={styles.symptomText}>{item.symptom2}</Text>
                                )}
                                {item.symptom3 && (
                                    <Text style={styles.symptomText}>{item.symptom3}</Text>
                                )}
                                {item.symptom4 && (
                                    <Text style={styles.symptomText}>{item.symptom4}</Text>
                                )}
                                {item.symptom5 && (
                                    <Text style={styles.symptomText}>{item.symptom5}</Text>
                                )}
                                
                                <View style={styles.actionContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => handleEdit(item.symptomid)}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                        <MaterialIcons name="edit" size={24} color="white" />
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.symptomid)}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                        <MaterialIcons name="delete" size={24} color="white" />
                                    </TouchableOpacity> */}
                                </View>
                                </View>))}
                    </View>
                    <View style={styles.footerContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('NursePatient_Dashboard', { patientId })}>
                                    <Text style={styles.footerText}>Back</Text>
                                </TouchableOpacity>
                                <Image source={View_Symptom} style={styles.Icon} />
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
    scrollView: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -20,
        marginBottom: 20,
        textAlign: 'center',
        color: 'teal',
        padding: 20,
    },
    symptomsList: {
        marginBottom: 10,
        textAlign: 'center',
    },
    symptomsContainer: {
        marginVertical: 0,
        textAlign: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        width: 400, // 60% of screen width
        //borderWidth: 1,
        //borderColor: 'teal',
        //backgroundColor: 'lightgoldenrodyellow',
    },
    symptomText: {
       // marginBottom: 5,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        width: 400, // 60% of screen width
        padding: 10,
        margin: 3,
        borderRadius: 10,
        width: 400, // 60% of screen width
        borderWidth: 1,
        borderColor: 'teal',
        backgroundColor: 'lightgoldenrodyellow',
        //color: 'teal',
        fontSize: 16,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'teal',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        margin: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginRight: 5,
    },
    footerContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        marginTop: 0,
        color: 'teal',
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    Icon: {
        marginTop: 30,
        width: 240, // Adjust the width as needed
        height: 200, // Adjust the height as needed
        alignSelf: 'center', // Align the icon to the center
        //width: '80%', // Adjust the width to occupy 80% of the container width
        //aspectRatio: 1, // Maintain aspect ratio
        borderRadius: 8, 
    },    
});