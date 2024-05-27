import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ImageBackground,Image } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import NurseHeader from "./NurseHeader";
import NurseSidebar from "./Sidebar";
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConsent } from '../Context/ConsentContext';
import { Table, Row, Rows } from 'react-native-table-component';
import LoadingScreen from '../Loading';



export default function Medications({ navigation, route }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [medications, setMedications] = useState([]);
    const [canvasList, setCanvasList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const patientId = route.params.patientId;
    const { consentToken } = useConsent();

    const fetchData = async () => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const medsResponse = await axios.get(`${API_BASE_URL}/nurse/getMedications/${patientId}/${consentToken}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedications(medsResponse.data);

            const canvasResponse = await fetch(`${API_BASE_URL}/nurse/getCanvas/${patientId}/${consentToken}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!canvasResponse.ok) throw new Error(`Failed to fetch canvases: ${canvasResponse.status}`);
            const canvasResult = await canvasResponse.json();
            setCanvasList(canvasResult);
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", error.message || "Failed to fetch data");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [patientId]);

    if (isLoading) {
        return <LoadingScreen />;
    }
    

    return (
        <View style={styles.container}>
        <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
            {isSidebarOpen && (
                <NurseSidebar
                    navigation={navigation}
                    isSidebarOpen={isSidebarOpen}
                    activeRoute="NursePatient_Details"
                />
                )}
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.heading}>Medications</Text>
                    { medications.length > 0 ? (
                        <>
                            <Table>
                                <Row data={['S.No', 'Medication Name', 'Dosage', 'Frequency', 'Duration', 'Special Instructions', 'Prescribed On']} style={styles.tableHeader} textStyle={styles.headerText} flexArr={[0.75, 2, 1.25, 1.25, 1.25, 4, 2]}/>
                                {medications.map((medication, index) => (
                                    <Row
                                        key={medication.medicineId}
                                        data={[
                                            index + 1,
                                            medication.medicineName,
                                            medication.dosage,
                                            medication.frequency,
                                            medication.duration,
                                            medication.specialInstructions,
                                            medication.prescribedOn,
                                        ]}
                                        textStyle={styles.tableText}
                                        style={styles.tableRow}
                                        flexArr={[0.75, 2, 1.25, 1.25, 1.25, 4, 2]}
                                    />
                                ))}
                            </Table>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>No medications available for this patient.</Text>
                    )}
                    { canvasList.length > 0 ? (
                            <>
                                {canvasList.map((canvas, index) => (
                                    <Image source={{ uri: `data:image/png;base64,${canvas.image}` }} style={styles.canvasImage} />
                                ))}
                            </>
                        ) : (
                            <Text style={styles.noDataText}>No prescription available for this patient.</Text>
                    )}
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
        justifyContent: 'center',
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
        fontSize: 30,
        color: 'red',
        marginTop: 20
    },
    canvasImage: {
      width: "130%",
      height: 640,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 10,
      marginTop: 10,
    },
    footerText: {
        marginTop: 0,
        color: 'teal',
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});