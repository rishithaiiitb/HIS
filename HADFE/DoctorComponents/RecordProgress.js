import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-gifted-charts';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import { useConsent } from '../Context/ConsentContext';

export default function RecordProgress({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [progress, setProgress] = useState({
        status: '',
    });
    
    const { consentToken } = useConsent();
    const [showProgressTable, setShowProgressTable] = useState(false);
    const [progressHistory, setProgressHistory] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(true);
    const [viewingProgress, setViewingProgress] = useState(false); // Indicates if currently viewing progress or not

    const handleSave = async (selectedStatus) => {
        setProgress({ ...progress, status: selectedStatus }); 
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/recordProgress/${patientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(progress)
            });
            if(response.ok){
                Alert.alert("Progress saved successfully");
                setProgress({ status: null });
                handleViewProgress();
                setShowProgressTable(true);
                setShowCheckboxes(false); // Hide checkboxes after recording progress
            }
            else{
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
        } catch (error) {
            console.error('Error saving progress:', error);
            Alert.alert('Error', 'Could not save progress. Please try again.');
        }
    };

    const handleViewProgress = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/progressHistory/${patientId}/${consentToken}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if(response.ok){
                const data = await response.json();
                setProgressHistory(data);
                setShowProgressTable(true);
                setShowCheckboxes(false);
                setViewingProgress(true); // Set the flag to indicate currently viewing progress
            }
            else{
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
        } catch (error) {
            console.error('Error fetching progress history:', error);
            Alert.alert('Error', 'Could not fetch progress history. Please try again.');
        }
    };

    const toggleProgressView = () => {
        if (viewingProgress) {
            setShowProgressTable(false);
            setShowCheckboxes(true);
            setViewingProgress(false);
        } else {
            handleViewProgress();
        }
    };

    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;

    const prepareChartData = () => {
        return progressHistory.map((item, index) => ({
            value: getStatusValue(item.status),
            label: `${item.date} ${item.time}`,
            labelTextStyle: {
                color: 'plum', 
                fontSize: 7, 
                marginRight: -10,
                marginTop: 10,
                marginBottom: 0 ,
                transform: [{ rotate: '0deg' }] // Rotate labels
            },
            frontColor: getBarColor(item.status),
        }));
    };

    

    function getStatusValue(status) {
        switch (status) {
            case 'Improved': return 24;  // Green maps to 10
            case 'Stable': return 16;     // Yellow maps to 6
            case 'Declined': return 10;   // Red maps to 2
            default: return 0;
        }
    }
    
    

    function getBarColor(status) {
        switch (status) {
            case 'Improved': return 'palegreen'; // Green
            case 'Stable': return 'wheat'; // Yellow
            case 'Declined': return 'tomato'; // Red
            default: return '#BDBDBD'; // Grey
        }
    }

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSideBar navigation={navigation} activeRoute="DoctorPatientDetails"/>}
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.heading}>{viewingProgress ? 'Progress History' : 'Record Progress'}</Text>
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
                    <View style={styles.progressContainer}>
                            {showProgressTable && (
                                <BarChart
                                data={prepareChartData()}
                                width={Dimensions.get('window').width} // Adjusted width
                                height={300} // Increased height
                                yAxisThickness={0}
                                xAxisThickness={0}
                                hideYAxisText={true}
                                hideRules={true}
                                initialSpacing={20} // Increased initial spacing
                                round={10} // Rounded corners
                                barWidth={50} 
                                // If adjustable, specify here
                                barHeight={300}
                                animated
                                animationDuration={2000}
                            />
                            )}

                    </View>

                    

                    {!showProgressTable && showCheckboxes && (
                        <View style={styles.proContainer}>
                            <Text style={styles.currentStatus}>Current Status</Text>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    title="Declined"
                                    checked={progress.status === 'Declined'}
                                    onPress={() => setProgress({ ...progress, status: 'Declined' })}
                                    containerStyle={styles.checkbox}
                                    textStyle={styles.checkboxText}
                                />
                                <CheckBox
                                    title="Stable"
                                    checked={progress.status === 'Stable'}
                                    onPress={() => setProgress({ ...progress, status: 'Stable' })}
                                    containerStyle={styles.checkbox}
                                    textStyle={styles.checkboxText}
                                />
                                <CheckBox
                                    title="Improved"
                                    checked={progress.status === 'Improved'}
                                    onPress={() => setProgress({ ...progress, status: 'Improved' })}
                                    containerStyle={styles.checkbox}
                                    textStyle={styles.checkboxText}
                                />
                                <TouchableOpacity
                                    style={styles.ButtonContainer}
                                    onPress={() => handleSave(progress.status)}
                                >
                                    <Text style={styles.ButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={toggleProgressView}
                    >
                        <Text style={styles.Text1}>{viewingProgress ? 'Record Progress' : 'View Progress'}</Text>     
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.backButton, { width: 80, backgroundColor: 'teal', alignItems: 'center' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.ButtonText}>Back</Text>
                    </TouchableOpacity>
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
        justifyContent: 'center', // Ensures content is centered horizontally
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
   
    detailsContainer: {
        marginTop: 10,
        borderWidth: 1,
          borderColor: 'plum',
          borderBottomWidth: 1,
          borderRadius: 4,
        //   shadowColor: '#000',
        //   shadowOffset: { width: 0, height: 2 },
        //   shadowOpacity: 0.8,
        //   shadowRadius: 2,
        //   elevation: 1,
          marginLeft: 25,
          marginRight: 25,
          marginTop: 10,
          backgroundColor: 'ghostwhite',
          padding: 10,
    },
      detailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 5,
          marginBottom: 5,
          //borderBottomWidth: 1,
          //borderBottomColor: '#339999', // Adjust the color as needed
      },
      
      heading: {
        fontFamily: 'Verdana', // Example font family
        fontSize: 20, // Increase font size for emphasis
        fontWeight: 'bold', // Make the text bold
        color: '#333', // Change text color to a darker shade
        marginTop: 10, // Increase bottom margin for spacing
        marginBottom: 5, // Increase bottom margin for spacing
        textAlign: 'center', // Center-align the text
        //textTransform: 'uppercase', // Convert text to uppercase for emphasis
        //textDecorationLine: 'underline',
      },
      detailLabel: {
          fontWeight: 'bold',
          width: '15%',
          color: '#333',
          fontFamily: 'Verdana', // Example font family
          fontSize: 14, // Example font size
      },
      detailValue: {
        fontWeight: 'bold',
          width: '20%',
          color: '#666',
          fontFamily: 'Verdana', // Example font family
          fontSize: 12, // Example font size
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
    checkboxContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 400, // or '100%' if it should be responsive
      marginBottom: 20,
    },
    checkbox: {
      backgroundColor: "lightgoldenrodyellow",
      borderColor: "teal",
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 15,
      width: 120,
      height: 50,
    },
    checkboxText: {
      fontSize: 14,
      color: "black",
    },
    progressContainer: {
        marginTop: -30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 'auto',
        marginLeft:270,
    },
    currentStatus: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        color: 'purple'
    },
    ButtonContainer: {
        backgroundColor: 'teal',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        width: 80,
        marginRight: 20,
        marginBottom: 20,
    },
    ButtonText: {
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold', 
    },
    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 100,
        height: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    Text1: {
        textAlign: 'center',
        marginTop: 20,
        color: 'teal',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    patientDetailsContainer: {
        marginTop: -10,
    },
    proContainer : {
        marginTop: 50,
        alignSelf: 'center'
    }
});
