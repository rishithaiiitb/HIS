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

const EditCanvas = ({navigation,route}) => {
    // const [paths, setPaths] = useState([]); // Store all paths
    // const [currentPath, setCurrentPath] = useState(''); // Store current drawing path
    const [color, setColor] = useState('black'); // Current color
    const [allPaths, setAllPaths] = useState([]); // History for undo/redo
    const canvasRef = useRef();
    const patientId = route.params.patientId;
    const {email} = useEmail();
    const [imageData, setImageData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paths, setPaths] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    
    const {consentToken} = useConsent();
    useEffect(() => {
        fetchImageData();
    }, []);
    const changeColor = (newColor) => {
        setColor(newColor);
    };

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

    const handleUndo = () => {
        const newPaths = [...paths];
        if (newPaths.length > 0) {
            newPaths.pop();
            setPaths(newPaths);
            setAllPaths(prev => [...prev, paths]);
        }
    };

    const handleRedo = () => {
        if (allPaths.length > 0) {
            const lastPaths = allPaths.pop();
            setPaths(lastPaths);
        }
    };

    const handleClear = () => {
        setPaths([]);
        setAllPaths([]);
    };

    const handleSave = async () => {
        console.log('Saving drawing...');
        if (canvasRef.current) {
            try {
                const base64String = await captureRef(canvasRef.current, {
                    format: 'jpg',
                    quality: 0.8,
                    result: 'base64',
                });
                console.log('Drawing saved as base64 string');
                uploadImage(base64String);
            } catch (error) {
                Alert.alert('Error capturing canvas', error.message);
            }
        } else {
            Alert.alert('Canvas Reference Missing', 'No canvas reference available for capture.');
        }
    };

    const uploadImage = async (base64String) => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token);
            const response = await fetch(`${API_BASE_URL}/doctor/editCanvas/${patientId}/${email}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64String }),
            });
    console.log(base64String);
    console.log(response);
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
    
            const responseData = await response.json();
            Alert.alert('Upload successful', responseData.message, [
                { text: "OK", onPress: () => navigation.navigate('ViewCanvas',{patientId: patientId} )}
            ]);
        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert('Upload failed', error.message || 'Failed to upload image');
        }
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            const { x0, y0 } = gestureState; // Start of touch, adjusted for canvas position
            setCurrentPath(`M${x0 - (Dimensions.get('window').width - 595) / 2},${y0 - 170}`);
        },
        onPanResponderMove: (evt, gestureState) => {
            const { moveX, moveY } = gestureState; // Move of touch, adjusted for canvas position
            setCurrentPath(prev => `${prev} L${moveX - (Dimensions.get('window').width - 595) / 2},${moveY - 170}`);
        },
        onPanResponderRelease: () => {
            setPaths(prev => [...prev, currentPath]);
            setCurrentPath('');
        },
    });

    return (
        <View style={styles.container}>
            <DoctorHeader />
            <View style={styles.content}>
                <DoctorSidebar />
                <View style={styles.canvasContainer} {...panResponder.panHandlers} ref={canvasRef}>
                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${imageData}` }}
                        style={styles.image}
                    />
                )}
                <Svg style={styles.canvas}>
                        {paths.map((path, index) => (
                            <Path
                                key={index}
                                d={path}
                                stroke={color} // Use color state
                                strokeWidth={2}
                                fill="none"
                            />
                        ))}
                        {currentPath && (
                            <Path
                                d={currentPath}
                                stroke={color} // Use color state
                                strokeWidth={2}
                                fill="none"
                            />
                        )}
                    </Svg>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.button} onPress={handleUndo}><Text style={styles.buttonText}>Undo</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleRedo}><Text style={styles.buttonText}>Redo</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleClear}><Text style={styles.buttonText}>Clear</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
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
        borderWidth: 1,
        borderColor: 'teal',
        backgroundColor: '#fff', // Canvas background
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    canvas: {
        position: 'absolute',
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

export default EditCanvas;
