import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useConsent } from '../Context/ConsentContext';
import { useEmail } from '../Context/EmailContext';
import LoadingScreen from '../Loading';

export default function PastHistory({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [pastMedicalHistory, setPastMedicalHistory] = useState(null);
    const [medications, setMedications] = useState(null);
    const [tests, setTests] = useState(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'pastMedicalHistory', title: 'Past Medical History' },
        { key: 'pastMedications', title: 'Past Medications' },
        { key: 'pastTests', title: 'Past Tests' },
    ]);
    const { consentToken } = useConsent();
    const layout = Dimensions.get('window');

    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;

    useEffect(() => {
        fetchPastHistory();
        fetchPastMedications();
        fetchPastTests();
    }, [patientId]);

    const fetchPastHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/pastHistory/${patientId}/${consentToken}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPastMedicalHistory(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const fetchPastTests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/pastTests/${patientId}/${consentToken}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTests(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const fetchPastMedications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/pastMedications/${patientId}/${consentToken}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMedications(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleFetchError = (error) => {
        if (error.response && error.response.status === 500) {
            Alert.alert(
                'Error',
                'Session Expired !!Please Log in again',
                [
                    {
                        text: 'OK', onPress: () => {
                            AsyncStorage.removeItem('token');
                            navigation.navigate("HomePage")
                        }
                    }
                ],
                { cancelable: false }
            );
        } else {
            console.error('Error fetching data:', error);
        }
    };

    const handleTestImages = (testId) => {
        navigation.navigate('TestImages', { testId, patientId });
    };

    const handlePastImages = (historyId) => {
        navigation.navigate('PastImages', { historyId, patientId });
    };

    const renderTable = (option) => {
        switch (option) {
            case 'pastMedicalHistory':
                if (pastMedicalHistory.length === 0) {
                    return <Text style={styles.noDataText}>No Past Medical History Available.</Text>;
                }
                return (
                    <Table>
                        <Row
                            data={['S.No', 'Disease', 'Medicine', 'Dosage', 'Remarks', 'Recorded At', 'Images']}
                            style={styles.tableHeader}
                            textStyle={styles.headerText}
                            flexArr={[0.75, 2, 2, 2, 2, 2, 3]}
                        />
                        {pastMedicalHistory.map((history, index) => (
                            <Row
                                key={index}
                                data={[
                                    index + 1,
                                    history.disease,
                                    history.medicine,
                                    history.dosage,
                                    history.remarks,
                                    history.recordedAt,
                                    <TouchableOpacity onPress={() => handlePastImages(history.historyId)}>
                                        <Text style={{ color: 'blue', textDecorationLine: 'underline' , textAlign: 'center',fontWeight: 'bold',fontSize: 14,padding: 5, }}>View Images</Text>
                                    </TouchableOpacity>
                                ]}
                                textStyle={styles.tableText}
                                style={styles.tableRow}
                                flexArr={[0.75, 2, 2, 2, 2, 2, 3]}
                            />
                        ))}
                    </Table>
                );
            case 'pastMedications':
                if (medications.length === 0) {
                    return <Text style={styles.noDataText}>No Past Medications Available.</Text>;
                }
                return (
                    <Table>
                        <Row
                            data={['S.No', 'Treated By', 'Disease', 'Medication Name', 'Dosage', 'Frequency', 'Duration', 'Special Instructions', 'Prescribed On']}
                            style={styles.tableHeader}
                            textStyle={styles.headerText}
                            flexArr={[1, 2, 2, 2, 2, 2, 2, 3, 2]}
                        />
                        {medications.map((medication, index) => (
                            <Row
                                key={medication.medicineId}
                                data={[
                                    index + 1,
                                    "Dr." + medication.visit.doctor.name,
                                    medication.visit.disease,
                                    medication.medicineName,
                                    medication.dosage,
                                    medication.frequency,
                                    medication.duration,
                                    medication.specialInstructions,
                                    medication.prescribedOn
                                ]}
                                textStyle={styles.tableText}
                                style={styles.tableRow}
                                flexArr={[1, 2, 2, 2, 2, 2, 2, 3, 2]}
                            />
                        ))}
                    </Table>
                );
            case 'pastTests':
                if (tests.length === 0) {
                    return <Text style={styles.noDataText}>No Past Tests Available.</Text>;
                }
                return (
                    <Table>
                        <Row
                            data={['S.No', 'Treated By', 'Disease', 'Test Name', 'Prescribed On', 'Test Result', 'Test Images']}
                            style={styles.tableHeader}
                            textStyle={styles.headerText}
                            flexArr={[0.75, 2, 2, 2, 2, 2, 3]}
                        />
                        {tests.map((test, index) => (
                            <Row
                                key={test.id}
                                data={[
                                    index + 1,
                                    "Dr." + test.visit.doctor.name,
                                    test.visit.disease,
                                    test.testName,
                                    test.prescribedOn,
                                    test.result,
                                    <TouchableOpacity onPress={() => handleTestImages(test.id)}>
                                        <Text style={{ color: 'blue', textDecorationLine: 'underline' , textAlign: 'center',fontWeight: 'bold',fontSize: 14,padding: 5, }}>View Images</Text>
                                    </TouchableOpacity>
                                ]}
                                textStyle={styles.tableText}
                                style={styles.tableRow}
                                flexArr={[0.75, 2, 2, 2, 2, 2, 3]}
                            />
                        ))}
                    </Table>
                );
            default:
                return null;
        }
    };

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: 'teal', width: '95.9%', alignSelf: 'center' }}
            labelStyle={{ color: 'white' }}
        />
    );

   

      if (!pastMedicalHistory || !medications || !tests) {
        return (
          <LoadingScreen />
        );
      }

      else{
        return (
            <View style={styles.container}>
                <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
                <View style={styles.content}>
                    {isSidebarOpen && <DoctorSideBar navigation={navigation} activeRoute="DoctorPatientDetails" />}
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <Text style={styles.heading}>Past Medical History</Text>
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
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={SceneMap({
                                pastMedicalHistory: () => renderTable('pastMedicalHistory'),
                                pastMedications: () => renderTable('pastMedications'),
                                pastTests: () => renderTable('pastTests'),
                            })}
                            onIndexChange={setIndex}
                            initialLayout={{ width: layout.width }}
                            renderTabBar={renderTabBar}
                        />
                        <View style={styles.footerContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.footerText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
      }
    
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
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
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
    patientDetailsContainer: {
        marginBottom: 10,
    },
    detailsContainer: {
        marginTop: 10,
        borderWidth: 1,
          borderColor: 'teal',
          borderBottomWidth: 1,
          borderRadius: 4,
          marginLeft: 25,
          marginRight: 25,
          marginTop: 10,
          backgroundColor: 'lightgoldenrodyellow',
          padding: 10,
          marginBottom: 30,
    },
      detailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 5,
          marginBottom: 5,
      },
    detailLabel: {
        fontWeight: 'bold',
        width: '15%',
        color: '#333',
        fontSize: 14, 
    },
    detailValue: {
      fontWeight: 'bold',
        width: '20%',
        color: '#666',
        fontFamily: 'Verdana', // Example font family
        fontSize: 12, // Example font size
    },
    tableContainer: {
        flex: 1,
        marginBottom: 100,
        marginTop: 30,
    },
    tableHeader: {
        height: 50,
        backgroundColor: 'lightseagreen',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: 1,
        borderColor: 'teal',
        borderRadius: 4, // Rounded corners
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
      },
      headerText: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        marginLeft: 5,
        marginRight: 5,
        color: 'ivory',
      },
    tableRow: {
        height: 40,
        backgroundColor: 'ghostwhite',
        borderWidth: 1,
        borderColor: 'plum',
        marginVertical: 5,
        borderRadius: 8, // Rounded corners
        marginLeft: 20,
        marginRight: 20,
    },
    tableText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
        marginLeft: 40,
    },
    addButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: -500,
      },
      paginationText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'teal',
      },
    disabled: {
        opacity: 0.5,
    },
    footerText: {
        marginTop: 0,
        color: 'teal',
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginHorizontal: 'auto',
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
        alignSelf: 'center',
        marginTop: 20,
    },
    lfooterIconContainer: {
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
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginHorizontal: 10,
      },
      paginationText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'teal',
      },
    disabled: {
        opacity: 0.5,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 20,
        color: 'red',
        marginTop: 20
    },
});