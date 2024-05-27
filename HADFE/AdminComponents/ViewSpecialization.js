import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView,TouchableOpacity,ImageBackground} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Table, Row, Rows } from 'react-native-table-component';


export default function ViewSpecialization() {
  const [specializations, setSpecializations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Use useIsFocused hook to determine if the screen is focused

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddSpecialization = () => {
    navigation.navigate('AddSpecialization'); 
  };

  useEffect(() => {
    if(isFocused)
    {
      fetchDoctorCountsBySpecialization();
    }
  },[isFocused]);
  const fetchDoctorCountsBySpecialization = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/admin/doctorCountsBySpecialization`, { headers });
      setSpecializations(response.data.map(item => [
        item.specializationName, 
        item.opDoctorCount.toString(),
        item.ipDoctorCount.toString()
      ]));
    } catch (error) {
      console.error('Error fetching doctor counts by specialization:', error);
      Alert.alert("Error", error.message || "Failed to fetch data");
    }
  }, []);

  useEffect(() => {
    fetchDoctorCountsBySpecialization();
  }, []);

  return (
    <View style={styles.container}>
      <AdminHeader onPressMenu={toggleSidebar} showBackButton={false} />
      <ImageBackground source={{uri: "https://www.wchcd.org/wp-content/uploads/2014/04/healthcare-background.jpg"}} style={styles.content}>
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} activeRoute="ViewSpecialization"/>
        )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>Doctor Counts by Specialization</Text>
          <View style={styles.mainContent}>
          <Table borderStyle={{ borderWidth: 0, borderColor: "transparent", padding: 20 }}>
            <Row data={['Specialization', 'OP Doctors', 'IP Doctors']} 
              style={styles.tableHeader}
              textStyle={styles.headerText}/>
            <Rows data={specializations} 
                  style={styles.tableRow}
                  textStyle={styles.tableText}/>
          </Table>

          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddSpecialization}>
            <Text style={styles.addButtonText}>Add Specialization</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //alignItems: 'center',
    //paddingTop: 50,
    //marginTop: 20,
    //justifyContent: 'center',
  },
  content: {
     flex: 1,
    flexDirection: 'row',
    //width: '100%',
    //backgroundColor: '#ffffff',
    //paddingHorizontal: 20,
    //paddingTop: 20,
  },
  scrollContainer: {
    // flex: 1,
    padding: 40,
    marginVertical: 20,
   //alignItems: 'center',
    // paddingTop: 0,
    width: 100,
  },
  innerContent: {
    flex: 1,
    // padding: 20,
  },
  heading: {
    fontSize: 30, // Increase font size for emphasis
    fontWeight: "bold", // Make the text bold
    color: "teal", // Change text color to a darker shade
    marginTop: 20, // Increase bottom margin for spacing
    marginBottom: 5, // Increase bottom margin for spacing
    textAlign: "center", 
    padding: 20,
  },
  head: { 
    height: 40, 
    backgroundColor: '#f1f8ff' 
  },
  text: { 
    margin: 6,
    textAlign: 'center',
  },
  mainContent:{
    padding: 30,
  },
  addButton: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20, 
    width: '15%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },tableHeader: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "lightseagreen",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "teal",
    borderRadius: 4, // Rounded corners
    marginBottom: 3,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginLeft: 5,
    marginRight: 5,
    color: "ivory",
  },
  tableRow: {
    flexDirection: "row",
    height: 35,
    backgroundColor: "ghostwhite",
    borderWidth: 1,
    borderColor: "plum",
    marginVertical: 3,
    borderRadius: 8, // Rounded corners
  },
  tableText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

