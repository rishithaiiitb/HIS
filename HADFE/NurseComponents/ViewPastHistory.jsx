import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import { MaterialIcons } from '@expo/vector-icons';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import { Table, Row, Rows } from 'react-native-table-component';
import { FontAwesome } from '@expo/vector-icons';
import BG_PastHistory from "../Nurse_Comp_Images/BG_PastHistory.png";
import { useConsent } from '../Context/ConsentContext';
import LoadingScreen from '../Loading';

// Define icons for previous and next
const previousIcon = '<<';
const nextIcon = '>>';

export default function ViewPastHistory({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [pastHistories, setPastHistories] = useState([]);
    const patientId = route.params.patientId;
    const {consentToken} = useConsent();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6); // Example value
    const photo = null;
    const[loading,setLoading] = useState(false);

    const SemicircleBackground = ({ children, style }) => {
        return (
            <View style={[styles.background, style]}>
                {children}
            </View>
        );
    };


    useEffect(() => {
        const fetchPastHistories = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/nurse/viewPastHistory/${patientId}/${consentToken}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsLoading(false);
                setPastHistories(response.data);
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
                console.error('Error fetching past histories:', error);
              }}
            };
        if (isLoading)
            fetchPastHistories();
    }, [patientId, isLoading]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsLoading(true);
        });

        return unsubscribe;
    }, [navigation]);

    const totalPages = Math.ceil(pastHistories.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPastHistories = pastHistories.slice(indexOfFirstItem, indexOfLastItem);

    const handleEdit = (historyId) => {
        console.log(historyId);
        navigation.navigate('EditPastHistory', { patientId, historyId });
    };

    const handleImage = (historyId) => {
        navigation.navigate('AddPastImage', { patientId, historyId, photo});
    };

    const handleDelete = async (historyId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/nurse/deletePastHistory/${historyId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsLoading(true);
            setPastHistories(prevHistories => prevHistories.filter(history => history.id !== historyId));
            navigation.navigate('viewPastHistory',{ patientId });
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
            console.error('Error deleting past history:', error);
          }}
    };

    const showAlert = (title, message) => {
        Alert.alert(title, message, [{ text: 'OK' }]);
    };

    if(loading || !pastHistories)
    {
        return <LoadingScreen/>
    }

    return (
        <View style={styles.container}>
            <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={BG_PastHistory} style={styles.content}>
                {isSidebarOpen && <NurseSidebar navigation={navigation} email={email} isSidebarOpen={isSidebarOpen} activeRoute="NursePatient_Details" />}
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.heading}>Previous Medical Records</Text>
                    <View style={styles.tableContainer}>
                        <Table>
                            <Row data={['S.No', 'Disease', 'Medicine', 'Dosage', 'Recorded On', 'Remarks', 'Action']} style={styles.tableHeader} textStyle={styles.headerText} />
                            {currentPastHistories && currentPastHistories.map((history, index) => (
                                <Row
                                    key={index}
                                    data={[
                                        (currentPage-1)*5+index + 1,
                                        history.disease,
                                        history.medicine,
                                        history.dosage,
                                        history.recordedAt,
                                        history.remarks,
                                        // Action buttons
                                        <View style={styles.actionContainer}>
                                            <TouchableOpacity onPress={() => handleImage(history.historyId)}>
                                                <MaterialIcons name="file-upload" size={24} color="blue" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleEdit(history.historyId)}>
                                                <MaterialIcons name="edit" size={24} color="blue" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(history.historyId)}>
                                                <MaterialIcons name="delete" size={24} color="red" />
                                            </TouchableOpacity>
                                        </View>
                                    ]}
                                    textStyle={styles.tableText}
                                    style={styles.tableRow}
                                />
                            ))}
                        </Table>
                    </View>
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
                    <View style={styles.footerContainer}>
                        {/* Back button */}
                        <SemicircleBackground style={styles.lbackground}>
                    <TouchableOpacity onPress={() => navigation.navigate('NursePatient_Dashboard', { patientId })} style={styles.footerItem}>
                        <View style={styles.lfooterIconContainer}>
                        <FontAwesome name="arrow-left" size={24} color="teal" />
                        </View>
                        <Text style={styles.footerText1}>Back</Text>
                    </TouchableOpacity>
                    </SemicircleBackground>

                    {/* View button */}
                    <SemicircleBackground style={styles.rbackground}>
                <TouchableOpacity onPress={() => navigation.navigate('AddPastHistory', { patientId })} style={styles.footerItem}>
                    <View style={styles.rfooterIconContainer}>
                    <FontAwesome name="plus" size={24} color="teal" />
                    </View>
                    <Text style={styles.footerText2}>Add</Text>
                </TouchableOpacity>
                </SemicircleBackground>

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
        justifyContent: 'center',
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
    heading: {
        fontSize: 30,
        padding: 20,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 10,
        textAlign: 'center',
        color: 'teal',
    },
    tableContainer: {
        flex: 1,
        marginBottom: 0,
    },
    tableHeader: {
        height: 50,
        backgroundColor: 'lightseagreen',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: 1,
        borderColor: 'teal',
        borderRadius: 4, // Rounded corners
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
        marginTop: -100,
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
});
