package com.had.his.Service;

import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;

import java.util.List;

public interface DoctorService {

    LoginResponse verifyDoctor(LoginDTO credentials);

    void logoutService(String email);

    Doctor changePassword(LoginDTO credentials);

    Doctor findByEmail(String email);

    List<Patient> getPatients(String email);

    List<Patient> getEmergencyPatients(String email);

    Patient getPatientDetails(String pid,String consentoken);

    Vitals getVitals(String pid,String consenttoken);

    Symptoms getSymptoms(String pid,String consenttoken);

    List<SymptomImages> getSymptomImages(String pid,String consenttoken);

    List<PastHistory> getPastHistory(String pid,String consenttoken);

    List<PastImages> getPastImages(Integer phid,String pid,String consenttoken);

    List<Medication> getPastMedications(String pid,String consenttoken);

    List<Test> getPastTests(String pid,String consenttoken);

    Progress saveProgress(String pid,Progress progress);

    List<Progress> getProgressHistory(String pid,String consenttoken);

    List<Medication> getMedications(String pid,String consenttoken,String email);

    Medication getMedicationById(String pid,Integer mid);

    Medication saveMedication(String pid,Medication med,String email);

    Medication editMedication(String pid,Integer mid,Medication med);

    void deleteMedication(String pid,Integer mid);

    List<Test> getTests(String pid,String consenttoken,String email);

    Test getTestById(String pid,Integer mid);

    Test saveTest(String pid,Test test,String email);

    Test editTest(String pid,Integer mid,Test test);

    void deleteTest(String pid,Integer mid);

    List<TestImages> getTestImages(Integer tid,String pid,String consenttoken);

    String addDisease(String pid,String disease,String email);

    Patient recommendIP(String pid, String did, String email);

    Patient dischargePatient(String pid,String email);

    Long admittedPatientCount(String email);

    Long treatedPatientCount(String email);

    List<String> getSpecializations();

    String getDisease(String pid,String consenttoken,String email);


    List<Doctor> getDoctorsBySpecialization(String specialization);

    Doctor exitDoctor(String email);

    Patient findPatient(String email,String pid,String consenttoken);

    String findID(String bid);

    String getConsentToken(String pid);

    Visit checkPatient(String pid,String email);

    Boolean getChecked(String pid, String email);

    Canvas saveCanvas(String pid, Canvas canvas, String email);

    Canvas editCanvas(String pid, Canvas canvas, String email);

    void deleteCanvas(String pid, String email);

    Canvas getCanvas(String pid, String consenttoken, String email);

    List<Canvas> getPastCanvas(String pid, String consenttoken);

    String editDisease(String pid, String disease, String email);

    String sendOtp(String contact);

    String getContactFromEmail(String email);

    Boolean verifyOtp(String contact,String otp);
}
