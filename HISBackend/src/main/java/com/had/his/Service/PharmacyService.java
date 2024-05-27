package com.had.his.Service;


import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.Canvas;
import com.had.his.Entity.Medication;
import com.had.his.Entity.Pharmacy;
import com.had.his.Response.LoginResponse;

import java.util.List;
import java.util.Map;


public interface PharmacyService {

    LoginResponse verifyPharmacy(LoginDTO credentials);

    void logoutService(String email);

    Pharmacy changePassword(LoginDTO credentials);

    Pharmacy findByEmail(String email);

    Pharmacy viewPharmacy(String pharmacyId);

    List<Medication> viewMedication(String patientId,String consenttoken);

    List<Canvas> viewCanvas(String patientId, String consenttoken);

    void serveMedication(Long medicineId);

    void serveCanvas(Long canvasId);

    Map<String, Integer> servedCount();

    String getConsentToken(String pid);

    String sendOtp(String contact);

    String getContactFromEmail(String email);

    Boolean verifyOtp(String contact,String otp);
}
