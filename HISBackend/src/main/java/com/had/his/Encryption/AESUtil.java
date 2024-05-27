package com.had.his.Encryption;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;


import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Service
public class AESUtil {
    private static final String algo = "AES/CBC/PKCS5PADDING";
    private static final String key = "6290456838123456"; // Replace with your AES key
    private static String iv = "1999455819994558";
    private static final Logger LOGGER = Logger.getLogger(AESUtil.class.getName());

    public static String decrypt(String encryptedData) {
        try {
            byte[] keyBytes = key.getBytes("UTF-8");
            byte[] ivBytes = iv.getBytes("UTF-8");

            SecretKey secretKey = new SecretKeySpec(keyBytes, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);

            byte[] encryptedBytes = Base64.decodeBase64(encryptedData);
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

            return new String(decryptedBytes).trim();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error during decryption: " + e.getMessage(), e);
            return null; // Handle decryption failure
        }
    }

}

