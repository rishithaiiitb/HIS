package com.had.his.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    // Twilio credentials

    public static final String ACCOUNT_SID = "AC029cddf34a58b8b13dfb781ea5117fd4";
    public static final String AUTH_TOKEN = "21e881f0482488a6385833c13399b96e";
    public static final String TWILIO_PHONE_NUMBER = "+14583121058";

    // Map to store the latest OTP along with its expiration time
    private static final Map<String, OtpData> otpMap = new HashMap<>();

    // OTP expiration time in minutes
    private static final int OTP_EXPIRATION_MINUTES = 2;

    // Initialize Twilio
    static {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    // Generate a random 6-digit OTP
    public static String generateOTP() {
        Random random = new Random();
        int otp = 100_000 + random.nextInt(900_000);
        return String.valueOf(otp);
    }

    // Send OTP via SMS
    public static void sendOTP(String mobileNumber) {
        // Remove any previous OTP for the same mobile number
        otpMap.remove(mobileNumber);

        // Generate new OTP
        String otp = generateOTP();
        Message message = Message.creator(
                        new PhoneNumber("+91" + mobileNumber),
                        new PhoneNumber(TWILIO_PHONE_NUMBER),
                        "Your OTP for verification is: " + otp)
                .create();

        System.out.println("OTP sent successfully to " + mobileNumber + ": " + message.getSid());

        // Store the generated OTP with its expiration time
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);
        otpMap.put(mobileNumber, new OtpData(otp, expirationTime));
    }

    // Verify OTP
    public static boolean verifyOTP(String mobileNumber, String userInput) {
        OtpData otpData = otpMap.get(mobileNumber);
        if (otpData != null && otpData.isValid()) {
            if (userInput.equals(otpData.getOtp())) {
                // Check if OTP is not expired
                if (LocalDateTime.now().isBefore(otpData.getExpirationTime())) {
                    // OTP is valid and not expired
                    return true;
                } else {
                    // OTP is expired, remove it from the map
                    otpMap.remove(mobileNumber);
                }
            }
        }
        return false;
    }

    // Inner class to hold OTP data along with its expiration time
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expirationTime;

        public OtpData(String otp, LocalDateTime expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpirationTime() {
            return expirationTime;
        }

        public boolean isValid() {
            return otp != null && expirationTime != null;
        }
    }
}

