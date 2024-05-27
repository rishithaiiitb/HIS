import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image,ImageBackground, ScrollView} from 'react-native';
import axios from 'axios'; // Import axios library
import { useNavigation} from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';

const AdminSidebar = ({ activeRoute }) => {
  const [loading, setLoading] = useState(true);
  const [hospitalDetails, setHospitalDetails] = useState(null);
  const navigation = useNavigation();
  const {email} = useEmail();

  const logoutUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/admin/logout/${email}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          await AsyncStorage.removeItem('token');
          navigation.navigate('HomePage');
        } else {
          console.error('Failed to log out:', response.statusText);
        }
      } else {
        console.error('Token not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigateToScreen = (route) => () => {
    if (route === 'HomePage') {
      logoutUser();
    } else {
      navigation.navigate(route);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospital details and counts data
        const token = await AsyncStorage.getItem('token');
        const hospitalDetailsResponse = await axios.get(`${API_BASE_URL}/admin/getHospitalDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const hospitalDetailsData = hospitalDetailsResponse.data; 
        setHospitalDetails(hospitalDetailsData);        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }; 
    fetchData();
  }, []); // Trigger effect whenever isFocused changes

  

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{uri: "https://blogassets.leverageedu.com/blog/wp-content/uploads/2019/12/26200156/Healthcare-Management-Courses.png"}} style={styles.profileImage} />
      {hospitalDetails ? (
              <>
      <Text style={styles.profileText}>{hospitalDetails.name}</Text>
      <Text style={styles.profileText}>Contact: {hospitalDetails.contact}</Text>
                <Text style={styles.profileText}>Email: {hospitalDetails.email}</Text>
                </>
      ) : (
        <Text>Loading hospitals details...</Text>
      )}
       <Text style={styles.profileText}>Admin</Text>
      </View>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen('AdminHome')}>
      <Text style={[styles.item, activeRoute === 'AdminHome' && styles.activeItem]}>Home</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen('AddEmployee')}>
      <Text style={[styles.item, activeRoute === 'AddEmployee' && styles.activeItem]}>Add Employee</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={() => navigation.navigate('RoleSelection', { roles: "default" })}>
      <Text style={[styles.item, activeRoute === 'RoleSelection' && styles.activeItem]}>Employee Details</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={() => navigation.navigate('ViewSpecialization')}>
      <Text style={[styles.item, activeRoute === 'ViewSpecialization' && styles.activeItem]}>View Specialization</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen('HomePage')}>
      <Text style={[styles.item, activeRoute === 'HomePage' && styles.activeItem]}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: -1,
    backgroundColor: '#008080', // Sidebar background color
    width: 260, // Sidebar width
    alignItems: 'center', // Center items horizontally
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 10, // Add padding to the top
    marginTop: 0, // Adjust margin to overlap with NurseHeader
    //paddingHorizontal: 20, // Horizontal padding for items
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    
    color: 'lightcyan', // Very light yellow 
  },
  item: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'lavender', // Light teal colorgive
  },
  activeItem: {
    color: 'lightsalmon', // Change color for active item
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'lavender',
    marginTop: 5,
    marginBottom: 5,
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarClosed: {
    left: -200,
  },
});
export default AdminSidebar;
