
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground, FlatList } from 'react-native';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import { MaterialIcons } from '@expo/vector-icons';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import LoadingScreen from '../Loading';
import BG_Vitals from "../Nurse_Comp_Images/BG_Vitals.png";
import View_Vitals from "../Nurse_Comp_Images/View_Vitals.jpg";
import { useConsent } from '../Context/ConsentContext';

export default function ViewVitals({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [vitals, setVitals] = useState([]);
    const patientId = route.params.patientId;
    const {consentToken} = useConsent();
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const fetchVitals = async () => {
            
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/nurse/viewVitals/${patientId}/${consentToken}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVitals([response.data]);
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
                console.error('Error fetching vitals:', error);
                setIsLoading(false);
              }}
        };

        
        if (isLoading) {
            fetchVitals();
        }
    }, [isLoading, patientId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsLoading(true); 
        });

        return unsubscribe;
    }, [navigation]);

    const handleEdit = (vitalid) => {
        
        navigation.navigate('EditVitals', { patientId,vitalid });
    };
    const handleadd = (patientId) => {
        
        navigation.navigate('AddVitals', { patientId});
    };


    const handleDelete = async (vitalId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/nurse/deleteVitals/${vitalId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            setIsLoading(true);
            navigation.navigate('viewVitals',{patientId}) 
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
            console.error('Error deleting vitals:', error);
          }}
    };

    if(loading)
    {
        return <LoadingScreen/>
    }
    
    const renderItem = ({ item }) => (
        <View style={styles.vitalContainer}>
        <View style={styles.vitalItem}>
            <View style={styles.column}>
            <View style={styles.vital}>
                <Text style={styles.label}>Weight: </Text>
                <Text style={styles.value}>{item.weight} kg</Text>
            </View>
            <View style={styles.vital}>
                <Text style={styles.label}>Temperature: </Text>
                <Text style={styles.value}>{item.temperature} °F</Text>
                </View>
                <View style={styles.vital}>
                <Text style={styles.label}>BP: </Text>
                <Text style={styles.value}>{item.bp}</Text>
                </View>
            </View>
            <View style={styles.column}>
            <View style={styles.vital}>
                <Text style={styles.label}>Height: </Text>
                <Text style={styles.value}>{item.height} cm</Text>
                </View>
                <View style={styles.vital}>
                <Text style={styles.label}>SpO2: </Text>
                <Text style={styles.value}>{item.spo2}</Text>
                </View>
                <View style={styles.vital}>
                <Text style={styles.label}>Pulse: </Text>
                <Text style={styles.value}>{item.pulse}</Text>
                </View>
            </View>
            </View>
            <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleEdit(item.vitalid)}>
                <Text style={styles.buttonText}>Edit</Text>
                <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.vitalid)}>
                <Text style={styles.buttonText}>Delete</Text>
                <MaterialIcons name="delete" size={24} color="white" />
            </TouchableOpacity> */}

        </View>
    </View>
    );

    return (
        <View style={styles.container}>
            <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={BG_Vitals} style={styles.content}>
                {isSidebarOpen && <NurseSidebar navigation={navigation} email={email} activeRoute="NursePatient_Details"/>}
                {vitals.length === 0 ? ( // Check if vitals array is empty
                    <Text style={styles.noVitalsMessage}>No vitals recorded for this patient.</Text>
                ) : (
                    <FlatList
                        data={vitals}
                        renderItem={renderItem}
                        keyExtractor={item => item.vitalid}
                        contentContainerStyle={styles.scrollView}
                        ListHeaderComponent={<Text style={styles.heading}>Current Patient Health Metrics</Text>}
                        ListFooterComponent={
                            <View style={styles.footerContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('NursePatient_Dashboard', { patientId })}>
                                    <Text style={styles.footerText}>Back</Text>
                                </TouchableOpacity>
                                <Image source={View_Vitals} style={styles.Icon} />
                            </View>
                        }
                    />
                )}
                
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
        alignItems: 'center',
        paddingBottom: 30,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 9,
        marginBottom: 25,
        textAlign: 'center',
        color: 'teal',
    },
    vitalContainer: {
        alignItems: 'center',
        //backgroundColor: '#f0f0f0',
        //borderRadius: 10,
        paddingBottom: 10,
       // borderWidth: 1,
        //borderColor: '#ccc',
        //padding: 20,
        width: '80%', // 60% of screen width
        //marginLeft: 20,
    },
    vitalItem: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        width: 800, // 60% of screen width
        height: 200,
        padding: 20,
        paddingLeft: 30,
        paddingRight: -30,
        borderWidth: 1,
        borderColor: 'teal',
        backgroundColor: 'lightgoldenrodyellow',
    },
    column: {
        flex: 1,
    },
    vital: {
        flexDirection: 'row',
        marginBottom: 5, // Add margin bottom to create space between columns
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'teal',
        marginRight: 10,
    },
    value: {
        fontSize: 20,
        marginBottom: 10,
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
        width: 300, // Adjust the width as needed
        height: 260, // Adjust the height as needed
        alignSelf: 'center', // Align the icon to the center
        //width: '80%', // Adjust the width to occupy 80% of the container width
        //aspectRatio: 1, // Maintain aspect ratio
        borderRadius: 8, 
    },
});
