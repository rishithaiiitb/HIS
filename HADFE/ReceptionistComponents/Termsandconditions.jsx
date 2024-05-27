import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BG_Term from "../Receptionist_Comp_Images/BG_Term.png";

const TermsAndConditions = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack(); // Navigate back to the previous screen
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={BG_Term} style={styles.backgroundImage}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.heading}>Terms and Conditions</Text>
                    <Text style={styles.content}>
              <Text>
                  <Text style={styles.sectionHeading}>Terms and Conditions: Consent for Collection of Personal Information{"\n"}</Text>
                  By accessing and utilizing the services provided by Pulse Care, you hereby consent to the collection, processing, and use of your personal information in accordance with the terms outlined herein. Your privacy and security are of utmost importance to us, and we are committed to safeguarding your personal data in compliance with applicable laws and regulations.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Purpose of Information Collection:{"\n"}</Text>
                  The personal information collected by Pulse Care is primarily used for the purpose of providing healthcare services, managing your medical records, facilitating billing and insurance processes, and ensuring the continuity of care.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Types of Personal Information Collected:{"\n"}</Text>
                  The information collected may include but is not limited to your name, address, date of birth, contact details, medical history, diagnostic reports, insurance information, and any other relevant data necessary for the provision of healthcare services.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Consent for Collection:{"\n"}</Text>
                  By accepting these terms and conditions, you explicitly consent to the collection of your personal information by Pulse Care for the aforementioned purposes. You understand that this information may be shared with healthcare professionals directly involved in your treatment, as well as with third-party service providers engaged by the hospital for administrative, billing, or healthcare delivery purposes.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Data Security:{"\n"}</Text>
                  Pulse Care employs industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, despite our best efforts, no data transmission over the internet or electronic storage system can be guaranteed to be 100% secure.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Retention and Disposal:{"\n"}</Text>
                  Your personal information will be retained for the duration necessary to fulfill the purposes outlined in these terms and conditions, unless a longer retention period is required or permitted by law. Upon expiry of the retention period, your information will be securely disposed of in accordance with applicable regulations.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Updates to Terms and Conditions:{"\n"}</Text>
                  Pulse Care reserves the right to update or modify these terms and conditions at any time without prior notice. Any changes will be effective immediately upon posting on our website or through other appropriate channels. It is your responsibility to review these terms periodically for any updates.{"\n\n"}
              </Text>

              <Text>
                  <Text style={styles.sectionHeading}>Contact Information:{"\n"}</Text>
                  If you have any questions or concerns regarding the collection or use of your personal information, please contact our Privacy Officer at privacy@pulsecarehospital.com or call us at +91-9133085504.{"\n\n"}
              </Text>

              <Text>
                  By continuing to access and use the services provided by Pulse Care, you acknowledge that you have read, understood, and agreed to the terms and conditions outlined above regarding the collection of your personal information.{"\n"}
              </Text>
          </Text>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    scrollContent: {
        flexGrow: 1,
        width: '30%',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        marginHorizontal: 380,
        marginRight: -100,
        marginTop: 0,
        marginBottom: 50,
        fontSize: 16,
    lineHeight: 24,
    color: 'black',
    textAlign: 'justify' // Attempting to justify the text
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'teal',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    content: {
        fontSize: 12,
        lineHeight: 24,
        color: 'black',
    },
    sectionHeading: {
        fontWeight: 'bold',
        color: 'teal',
    },
    backButton: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TermsAndConditions;
