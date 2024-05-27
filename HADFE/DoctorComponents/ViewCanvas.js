import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Text, Alert, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSideBar';
import { API_BASE_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEmail } from '../Context/EmailContext';
import { useConsent } from '../Context/ConsentContext';
import LoadingScreen from '../Loading';
import { useFocusEffect } from '@react-navigation/native';


const ViewCanvas = ({navigation,route}) => {
    const [paths, setPaths] = useState([]); // Store all paths
    const [currentPath, setCurrentPath] = useState(''); // Store current drawing path
    const [color, setColor] = useState('black'); // Current color
    const [allPaths, setAllPaths] = useState([]); // History for undo/redo
    const canvasRef = useRef();
    const [imageData, setImageData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchData, setFetchData] = useState(true);

    const patientId = route.params.patientId;
    const {email} = useEmail();
    const {consentToken} = useConsent();

    const handleEdit = () => {
        navigation.navigate('EditCanvas', { patientId});
    };

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/deleteCanvas/${patientId}/${email}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete canvas');
            }
            const responseData =  response.text;
            Alert.alert('Deleted successfully', responseData.message, [
                { text: "OK", onPress: () => navigation.navigate('DoctorPatientDashboard',{patientId: patientId} )}
            ]);
        } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Delete failed', error.message || 'Failed to delete image');
        }
    };

   

    // const CanvasImage = ({ base64Image }) => {
    //     return (
    //         <View style={styles.container}>
    //             <Image
    //                 style={styles.image}
    //                 source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
    //             />
    //         </View>
    //     );
    // };
    useFocusEffect(
        React.useCallback(() => {
            fetchImageData();
            return () => {
            };
        }, [])
    );

    const fetchImageData = async () => {
        
        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/viewCanvas/${patientId}/${consentToken}/${email}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.image) {
                setImageData(result.image);
            } else {
                throw new Error('No image data found');
            }
        } catch (error) {
            console.error('Fetching image failed:', error);
            Alert.alert('Fetch Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    if(isLoading){
        return <LoadingScreen />
    }
    return (
        <View style={styles.container}>
            <DoctorHeader />
            <View style={styles.content}>
                <DoctorSidebar activeRoute="DoctorPatientDetails"/>
                <View style={styles.canvasContainer}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : imageData ? (
                <Image
                    source={{ uri: `data:image/jpg;base64,${imageData}` }}
                    style={styles.image}
                />
            ) : (
                <Text>No Image to Display</Text>
            )}
            </View>
            <View style={styles.controls}>
                    <TouchableOpacity style={styles.button} onPress={handleEdit}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleDelete}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DoctorPatientDashboard',{patientId: patientId})}><Text style={styles.buttonText}>Back</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
    },
    content: {
        flexDirection: 'row',
    },
    canvasContainer: {
        marginVertical: 25,
        marginLeft: 25,
        height: 595, // A4 width in pixels at 72 DPI
        width: 842, // A4 height in pixels at 72 DPI
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: 'teal',
        backgroundColor: '#fff', // Canvas background
    },
    image: {
        width: '100%',  // Set your desired width
        height: '100%', // Set your desired height
        resizeMode: 'contain', // Ensures the image fits within the view bounds
    },    
    canvas: {
        width: '100%',
        height: '100%',
    },
    controls: {
        flexDirection: 'column',
        padding: 20,
        justifyContent: 'space-around',
        width: '8%',
    },
    button: {
        padding: 8,
        backgroundColor: 'teal',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        alignContent: 'center',
        marginHorizontal: 'auto',
    },
});

export default ViewCanvas;
