
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
//import Icon from 'react-native-vector-icons/FontAwesome';
import LogoImage from './Logo.jpg';
//import LogoVideo from './ab.mp4'; // Replace with your actual video file
//import FastImage from 'react-native-fast-image';
//import { ScrollView } from 'react-native-gesture-handler';
import SliderImage1 from './Landscape.jpg';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation

export default function Home() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigation = useNavigation(); 

  const handleLogin = (role) => {
    setSelectedRole(role);
    navigation.navigate('Login', {role}); 
    //navigation.navigate('Login',selectedRole);
    // Redirect to Nurse login page
    // if (role === 'Nurse') {
    //   navigation.navigate('NurseLogin'); // Replace 'NurseLogin' with the actual name of the Nurse login screen
    // }
    // if(role === 'Doctor') {
    //   navigation.navigate('DoctorLogin');
    // }
    // if(role === 'Receptionist') {
    //   navigation.navigate('ReceptionistLogin');
    // }
    // if(role === 'Admin') {
    //   navigation.navigate('LoginScreen');
    // }
    // if(role === 'Pharmacy') {
    //   navigation.navigate('PharmacyLogin');
    // }
  };

  // Reference for the Swiper component
  const swiperRef = useRef(null);

  useEffect(() => {
    // Function to automatically change slides every 5 seconds
    const changeSlide = () => {
      if (swiperRef.current) {
        swiperRef.current.scrollBy(1); // Move to the next slide
      }
    };

    // Set an interval to change slides every 5 seconds
    const interval = setInterval(changeSlide, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.loginContainer}>
          <ImageBackground
            source={{ uri: 'https://media.istockphoto.com/id/911633218/vector/abstract-geometric-medical-cross-shape-medicine-and-science-concept-background.jpg?s=612x612&w=0&k=20&c=eYz8qm5xa5wbWCWKgjOpTamavekYv8XqPTA0MC4tHGA=' }}
            style={styles.backgroundImage}
          >
            {/* Your existing content inside the ImageBackground */}
          </ImageBackground>
        </View>

        <View style={styles.slidesContainer}>
          {/* Swiper component for slides */}
          <Swiper
            style={styles.swiper}
            showsPagination={true}
            ref={swiperRef}
          >
            <Image
              source={SliderImage1}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://miro.medium.com/v2/resize:fit:1400/1*zljFWMmXM4vBg3yMZH6prQ.jpeg' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://jungleworks.com/wp-content/uploads/2021/10/shutterstock_1049387201.png' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://previews.123rf.com/images/pressmaster/pressmaster1207/pressmaster120700008/14436971-collage-of-successful-clinicians-in-hospital.jpg' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://thumbs.dreamstime.com/b/neurology-cardiology-ophthalmology-medicine-doctors-neurology-cardiology-ophthalmology-medicine-infectious-diseases-129507783.jpg' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://images01.nicepagecdn.com/page/27/74/website-template-preview-2774249.jpg' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://www.shutterstock.com/image-photo/outdoor-portrait-medical-team-600nw-168767282.jpg' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://www.asterhospitals.in/sites/default/files/2023-08/best-hospital-in-kollam.jpg' }}
              style={styles.slideImage}
            />
            <Image
              source={{ uri: 'https://www.mhwilliams.com/wp-content/uploads/2018/07/large-3.jpg' }}
              style={styles.slideImage}
            />
            {/* Add more slides as needed */}
          </Swiper>
        </View>
      </View>

      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={LogoImage}
            style={styles.logo}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedRole === 'Admin' && { backgroundColor: 'mediumaquamarine' }, // Change the color when Admin is selected
            ]}
            onPress={() => handleLogin('Admin')}
            disabled={false}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/256/1158/1158425.png' }}
              style={{ width: 40, height: 40, marginBottom: 5 }}
            />
            <Text style={styles.buttonText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedRole === 'Receptionist' && { backgroundColor: 'mediumaquamarine' }, // Change the color when Receptionist is selected
            ]}
            onPress={() => handleLogin('Receptionist')}
            disabled={false}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3073/3073790.png' }}
              style={{ width: 40, height: 40, marginBottom: 5 }}
            />
            <Text style={styles.buttonText}>Receptionist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedRole === 'Doctor' && { backgroundColor: 'mediumaquamarine' }, // Change the color when Doctor is selected
            ]}
            onPress={() => handleLogin('Doctor')}
            disabled={false}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://cdn.pixabay.com/photo/2020/12/09/16/40/doctor-5817903_1280.png' }}
              style={{ width: 40, height: 40, marginBottom: 5 }}
            />
            <Text style={styles.buttonText}>Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedRole === 'Nurse' && { backgroundColor: 'mediumaquamarine' }, // Change the color when Nurse is selected
            ]}
            onPress={() => handleLogin('Nurse')}
            disabled={false}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://cdn-icons-png.freepik.com/512/8496/8496122.png' }}
              style={{ width: 40, height: 40, marginBottom: 5 }}
            />
            <Text style={styles.buttonText}>Nurse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedRole === 'Pharmacy' && { backgroundColor: 'mediumaquamarine' }, // Change the color when Pharmacy is selected
            ]}
            onPress={() => handleLogin('Pharmacy')}
            disabled={false}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2621/2621846.png' }}
              style={{ width: 40, height: 40, marginBottom: 5 }}
            />
            <Text style={styles.buttonText}>Pharmacist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row', // Arrange children horizontally
    flex: 1,
    justifyContent: 'space-between', // Add space between login buttons and swiper
  },
  loginContainer: {
    flex: 1,
    // Your existing styles for login container go here
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image covers the entire screen
    zIndex: 0, // Set a lower zIndex for the background image
    pointerEvents: 'auto', // Enable touch interactions
  },
  slidesContainer: {
    width: '60%',
    height: '70%',
    justifyContent: 'center',
    marginLeft: -900, // Move the Swiper towards the left
    marginTop: 150,
    //marginBottom: 100,
    marginRight: 40,
    borderWidth: 3, // Adjust border width as needed
    borderColor: 'teal', // Border color

  },
  swiper: {
    //width: '100%', // Adjust the width of the slider to fill the container
    //height: '100%', // Adjust the height of the slider to fill the container
    zIndex: 1,
  },
  slideImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center', // Align items to the left
    paddingLeft: 20, // Add left padding to the container
  },
  logoContainer: {
    flexDirection: 'row', // Align the logo and buttons in a row
    alignItems: 'center',
    marginBottom: 4, // Add margin between the logo and buttons
    marginTop: -80,
  },
  logo: {
    width: 280, // Adjusted width to make it smaller
    height: 100, // Adjusted height to make it smaller
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 5, // Half of the width and height to make it circular
    borderWidth: 1, // Adjust border width as needed
    borderColor: 'teal', // Border color
    overflow: 'hidden', // Clip the content inside the border
    shadowColor: 'teal', // Shadow color
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8, // Adjust shadow opacity as needed
    shadowRadius: 10, // Adjust shadow radius as needed
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    width: '90%', // Ensure buttons take the full width
     height: '70%', // Use the full height of the screen
    paddingBottom: 0, // Add space at the bottom of the buttons container
    paddingTop: 50, // Optional: Add space at the top of the buttons container
  },
  button: {
    backgroundColor: 'teal',
    borderRadius: 10,
    width: '25%', // Adjust width for proper spacing
    height: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5, // Adjust padding for better appearance
    flexDirection: 'row', // Display icon and text in the same row
    marginBottom: 10, // Add margin at the bottom of each button for spacing
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5, // Adjust spacing between icon and text
    marginLeft: 5,
  },
});