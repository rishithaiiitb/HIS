package com.had.his.Security;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class AESKeyGenerator {

    // Method to generate AES secret key with a specified key length
    public static String generateAESKey(int keyLength) {
        try {
            // Create a KeyGenerator instance for AES
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");

            // Initialize the KeyGenerator with a secure random number generator
            SecureRandom secureRandom = new SecureRandom();
            keyGen.init(keyLength, secureRandom);

            // Generate a secret key
            SecretKey secretKey = keyGen.generateKey();

            // Convert the secret key to a byte array
            byte[] encodedKey = secretKey.getEncoded();

            // Encode the byte array as a base64 string and return
            return Base64.getEncoder().encodeToString(encodedKey);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }
}


