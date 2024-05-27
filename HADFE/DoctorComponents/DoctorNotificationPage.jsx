import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import LoadingScreen from '../Loading';

const DoctorNotificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/doctor/fetchnotifications/${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', response.statusText);
        setMessages([]); // Clear messages if fetch failed
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // Clear messages on error
    } finally {
      setLoading(false);
    }
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [fetchMessages])
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
    <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.content}>
      {isSidebarOpen && <DoctorSideBar navigation={navigation} activeRoute="DoctorPatientDetails"/>}
      <ScrollView>
      <Text style={styles.heading}>Notification Panel</Text>
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.message}>{msg.body}</Text>
          </View>
        ))
      ) : (
          <Text style={styles.noDataText}>No messages available.</Text>
      )}

        <View style={styles.footerContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('DoctorHome',{shouldFetchData: true})}>
                    <Text style={styles.footerText}>Back</Text>
              </TouchableOpacity>                       
      </View>
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  content:{
    flex: 1,
    flexDirection:'row',
    width: '100%',
    backgroundColor: '#ffffff',
    // paddingHorizontal: 20, 
    // paddingTop: 20,
  },
  card: {
    marginVertical: 0,
        textAlign: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: '80%', // 60% of scree
        marginLeft: 20,
  },
  message: {
    textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        borderRadius: 10,
        width: '100%', // 60% of screen width
        borderWidth: 1,
        borderColor: 'plum',
        backgroundColor: 'lightgoldenrodyellow',
        //color: 'teal',
        fontSize: 16,
  },

  scrollView: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
},
heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'teal',
    padding: 20,
    marginTop: 0,
},
footerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
},
footerText: {
    marginTop: 0,
    color: 'teal',
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
},
noDataText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'red',
    marginTop: 20
},
});

export default DoctorNotificationPage;
