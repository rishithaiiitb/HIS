import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ViewReceptionists from './viewReceptionists';
import ViewPharmacies from './viewPharmacies';
import ViewDoctors from './viewDoctors';
import ViewNurses from './viewNurses';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native';
import { Table, Row, Rows } from "react-native-table-component";


const RoleSelection = ({ route, navigation }) => {
  const [selectedRole, setSelectedRole] = useState(route.params.roles);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // setSelectedRole(route.params.roles);

  console.log(selectedRole);;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole("default"); // Reset the selected role to default
  };

  let viewComponent = null;

  switch (selectedRole) {
    case 'receptionist':
      viewComponent = <ViewReceptionists handleBack={handleBack}/>;
      break;
    case 'pharmacy':
      viewComponent = <ViewPharmacies handleBack={handleBack}/>;
      break;
    case 'doctor':
      viewComponent = <ViewDoctors handleBack={handleBack}/>;
      break;
    case 'nurse':
      viewComponent = <ViewNurses handleBack={handleBack}/>;
      break;
    default:
      viewComponent = (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Select Role</Text>
          <View style = {styles.pickerContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => handleRoleSelect(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Role" value="default" />
            <Picker.Item label="Doctor" value="doctor" />
            <Picker.Item label="Receptionist" value="receptionist" />
            <Picker.Item label="Pharmacy" value="pharmacy" />
            <Picker.Item label="Nurse" value="nurse" />
          </Picker>
          </View>
        </ScrollView>
      );
  }

  return (
    <View style={styles.container}>
<AdminHeader onPressMenu={toggleSidebar} showBackButton={false} />
<ImageBackground source={{uri: "https://www.wchcd.org/wp-content/uploads/2014/04/healthcare-background.jpg"}} style={styles.content}>
        {isSidebarOpen && <AdminSidebar isSidebarOpen={isSidebarOpen} activeRoute="RoleSelection"/>}
        {viewComponent}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // marginTop: 20,
    // justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center', 
    // width: "100%",
    // backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -10,
    marginBottom: 20,
    textAlign: 'center',
    color: 'teal',
  },pickerContainer: {
    borderColor: 'teal',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: 200,
    overflow: 'hidden', // This is important to make borderRadius work on Android
  },
  picker: {
    height: 50,
    backgroundColor: 'lightgoldenrodyellow',
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
  },
  noDataText: {
    textAlign: "center",
    fontSize: 30,
    color: "red",
    marginTop: 20,
  },
});

export default RoleSelection;

