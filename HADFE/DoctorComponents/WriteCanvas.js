import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Text, Alert, Image } from 'react-native';
import Svg, { Path, Text as SvgText, Image as SvgImage } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSideBar';
import { API_BASE_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEmail } from '../Context/EmailContext';
import LogoImage from "../Nurse_Comp_Images/Logo.jpg";

const WriteCanvas = ({navigation,route}) => {
    const [paths, setPaths] = useState([]); // Store all paths
    const [currentPath, setCurrentPath] = useState(''); // Store current drawing path
    const [color, setColor] = useState('black'); // Current color
    const [allPaths, setAllPaths] = useState([]); // History for undo/redo
    const canvasRef = useRef();
    const patientId = route.params.patientId;
    const [patientDetails, setPatientDetails] = useState({
        name: 'N/A', // Default values
        age: 'N/A',
        sex: 'N/A'
    }); // Defaults to avoid null

    const [doctorDetails, setDoctorDetails] = useState(null);
    const {email} = useEmail();

    const changeColor = (newColor) => {
        setColor(newColor);
    };

    const fetchDoctorDetails = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/doctor/home/${email}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(response.status==500){
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
          const fetchedDoctorDetails = await response.json();
          setDoctorDetails(fetchedDoctorDetails);
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
          console.error('Error fetching doctor details:', error);
        }}
      };
    
     
      const fetchPatientDetails = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/doctor/patientDetails/${patientId}/${consentToken}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(response.status==500){
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
          const data = await response.json();
          setPatientDetails(data);
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
          console.error('Error fetching patient details:', error);
        }}
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
            const response = await fetch(`${API_BASE_URL}/doctor/addCanvas/${patientId}/${email}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64String }),
            });
    
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
                <DoctorSidebar activeRoute="DoctorPatientDetails"/>
                <View style={styles.canvasContainer} {...panResponder.panHandlers} ref={canvasRef}>
                    <Svg style={styles.canvas}>
                    <SvgImage
                            x="10" // Adjust this value to align the image
                            y="10" // Set to '0' to position it at the top
                            width="120px"  // Use percentage to cover the full canvas width
                            height="60px"  // Adjust the height as needed
                            href={LogoImage}
                            //style={styles.logo}
                            preserveAspectRatio="xMidYMid slice"  // Adjusts the aspect ratio
                        />
                        <SvgImage
                            x="0" // Adjust this value to align the image
                            y="500" // Set to '0' to position it at the top
                            width="99%"  // Use percentage to cover the full canvas width
                            height="20%"  // Adjust the height as needed
                            href="https://preview.redd.it/how-do-i-make-these-on-photoshop-a-line-that-goes-from-thin-v0-57c7ki3hy6a91.png?width=1080&crop=smart&auto=webp&s=23f44a3b1d2cafda6c60747a14bcbc0bbc43e660"
                            //style={styles.logo}
                            preserveAspectRatio="xMidYMid slice"  // Adjusts the aspect ratio
                        />
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
                        {/* <SvgText
                            fill="red"
                            stroke="purple"
                            fontSize="32"
                            fontWeight="bold"
                            x="100"
                            y="50"
                            textAnchor="middle">
                            Hello, SVG!
                        </SvgText> */}
                    {/* <SvgText fill="black" fontSize="20" x="10" y="30">Name: {patientDetails.name || 'N/A'}</SvgText>
                    <SvgText fill="black" fontSize="20" x="10" y="60">Age: {patientDetails.age || 'N/A'}</SvgText>
                    <SvgText fill="black" fontSize="20" x="10" y="90">Sex: {patientDetails.sex || 'N/A'}</SvgText>
                 */}
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

export default WriteCanvas;
