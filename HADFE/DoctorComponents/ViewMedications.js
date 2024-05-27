import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConsent } from '../Context/ConsentContext';
import { useEmail } from '../Context/EmailContext';
import { Table, Row, Rows } from 'react-native-table-component';
import LoadingScreen from '../Loading';


const previousIcon = '<<';
const nextIcon = '>>';

export default function ViewMedications({ navigation, route }) {

    const [itemsPerPage, setItemsPerPage] = useState(4); 
    const [currentPage, setCurrentPage] = useState(1);

    const SemicircleBackground = ({ children, style }) => {
        return (
            <View style={[styles.background, style]}>
                {children}
            </View>
        );
    };

    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [medications, setMedications] = useState([]);
    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;
    const { consentToken } = useConsent();
    const [isLoading, setIsLoading] = useState(true);

    const fetchMedications = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/viewMedications/${patientId}/${consentToken}/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMedications(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching medications:', error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedications();
    }, [fetchMedications]);

    const handleEdit = (medicationId) => {
        navigation.navigate('EditMedication', { patientId, medicationId, onView: fetchMedications });
    };

    const handleAdd = () => {
        navigation.navigate('AddMedications', { patientId, onView: fetchMedications });
    };

    const handleDelete = async (medicationId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/doctor/deleteMedication/${patientId}/${medicationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Alert.alert("Medication Deleted successfully");
            fetchMedications();
        } catch (error) {
            console.error('Error deleting medication:', error);
        }
    };

    if (isLoading) {
        return (
          <LoadingScreen />
        );
      }
    


    const totalPages = Math.ceil(medications.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMedications = medications.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSideBar navigation={navigation} activeRoute="DoctorPatientDetails"/>}
                <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.heading}>Medications</Text>
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
                    { medications.length > 0 ? (
                        <>
                            <Table>
                                <Row data={['S.No', 'Medication Name', 'Dosage', 'Frequency', 'Duration', 'Special Instructions', 'Prescribed On', 'Action']} style={styles.tableHeader} textStyle={styles.headerText} flexArr={[0.75, 2, 1.25, 1.25, 1.25, 4, 2, 2]}/>
                                {currentMedications.map((medication, index) => (
                                    <Row
                                        key={medication.medicineId}
                                        data={[
                                            (currentPage-1)*4+index + 1,
                                            medication.medicineName,
                                            medication.dosage,
                                            medication.frequency,
                                            medication.duration,
                                            medication.specialInstructions,
                                            medication.prescribedOn,
                                            <View style={styles.actionContainer}>
                                                <TouchableOpacity onPress={() => handleEdit(medication.medicineId)}>
                                                    <MaterialIcons name="edit" size={24} color="blue" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleDelete(medication.medicineId)}>
                                                    <MaterialIcons name="delete" size={24} color="red" />
                                                </TouchableOpacity>
                                            </View>
                                        ]}
                                        textStyle={styles.tableText}
                                        style={styles.tableRow}
                                        flexArr={[0.75, 2, 1.25, 1.25, 1.25, 4, 2, 2]}
                                    />
                                ))}
                            </Table>
                            <View style={styles.pagination}>
                                <TouchableOpacity onPress={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    <Text style={[styles.paginationText, currentPage === 1 && styles.disabled]}>{previousIcon} Previous</Text>
                                </TouchableOpacity>
                                <Text style={styles.paginationText}>
                                    Page {currentPage} of {totalPages}
                                </Text>
                                <TouchableOpacity onPress={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                    <Text style={[styles.paginationText, currentPage === totalPages && styles.disabled]}>Next {nextIcon}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>No medications available for this patient.</Text>
                    )}


                    <View style={styles.footerContainer}>
                        {/* Back button */}
                        <SemicircleBackground style={styles.lbackground}>
                            <TouchableOpacity onPress={() => navigation.navigate('DoctorPatientDashboard', { patientId })} style={styles.footerItem}>
                                <View style={styles.lfooterIconContainer}>
                                <FontAwesome name="arrow-left" size={24} color="teal" />
                                </View>
                                <Text style={styles.footerText1}>Back</Text>
                            </TouchableOpacity>
                            </SemicircleBackground>

                            {/* View button */}
                            <SemicircleBackground style={styles.rbackground}>
                        <TouchableOpacity onPress={handleAdd}style={styles.footerItem}>
                            <View style={styles.rfooterIconContainer}>
                            <FontAwesome name="plus" size={24} color="teal" />
                            </View>
                            <Text style={styles.footerText2}>Add</Text>
                        </TouchableOpacity>
                        </SemicircleBackground>

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
        justifyContent: 'space-between',
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
});