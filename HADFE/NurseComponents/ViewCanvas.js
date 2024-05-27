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


const ViewCanvas = ({navigation,route}) => {
    const [paths, setPaths] = useState([]); // Store all paths
    const [currentPath, setCurrentPath] = useState(''); // Store current drawing path
    const [color, setColor] = useState('black'); // Current color
    const [allPaths, setAllPaths] = useState([]); // History for undo/redo
    const canvasRef = useRef();
    const [imageData, setImageData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const patientId = route.params.patientId;
    const {email} = useEmail();
    const {consentToken} = useConsent();

    useEffect(() => {
        fetchImageData();
    }, []);

    const fetchImageData = async () => {
        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/nurse/viewCanvas/${patientId}/${consentToken}/${email}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result.image);

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
    
    return (
        <View style={styles.container}>
            <DoctorHeader />
            <View style={styles.content}>
                <DoctorSidebar />
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
        padding: 10,
        backgroundColor: 'teal',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
});

export default ViewCanvas;