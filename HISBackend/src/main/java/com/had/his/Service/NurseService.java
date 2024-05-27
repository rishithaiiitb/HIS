package com.had.his.Service;

import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;

import java.util.List;
import java.util.Map;

public interface NurseService {

    LoginResponse NurseLogin(LoginDTO loginDTO);

    void logoutService(String email);

    Nurse changePassword(LoginDTO loginDTO);

    Nurse getNurseByEmail(String email);

    Nurse getNurseDetailsByEmail(String email);

    List<NurseSchedule> viewNurseScheduleById(String nurseId);

    List<Patient> getEmergencyPatients();

    List<Patient> getAllPatients();

    Patient getPatientDetailsById(String patientId,String consenttoken);

    Vitals addVitals(String patientId, Vitals vitals);

    Vitals editVitals(Long vitalid,Vitals vitals);

    Vitals viewVitals(String patientId,String consenttoken);

    Vitals viewVitalsById(String patientId,Long vitalid);

    void deleteVitals(Long vitalid);

    Symptoms addSymptoms(String patientId, Symptoms symptoms);

    Symptoms editSymptoms(Long symptomid,Symptoms symptoms);

    Symptoms viewSymptoms(String patientId,String consenttoken);

    Symptoms viewSymptomsById(String patientId,Long symptomid);

    void deleteSymptoms(Long symptomid);

    PastHistory addPastHistory(String patientId, PastHistory pastHistory);

    PastHistory editPastHistory(Long historyid,PastHistory pastHistory);

    List<PastHistory> viewPastHistory(String patientId,String consenttoken);

    PastHistory viewPastHistoryById(String patientId,Long historyId);

    void deletePastHistory(Long historyid);

    SymptomImages addSymptomImages(String patientId,SymptomImages symptomImages);

    SymptomImages editSymptomImages(Integer id,SymptomImages symptomImages);

    List<SymptomImages> viewSymptomImages(String patientId,String consenttoken);

    SymptomImages viewSymptomImagesById(String patientId,Integer id);

    void deleteSymptomImages(Integer id);

    PastImages addPastImages(Long historyId,PastImages pastImages);

    PastImages editPastImages(Integer imgId,PastImages pastImages);

    List<PastImages> viewPastImages(Integer historyId,String patientId, String consenttoken);

    PastImages viewPastImagesById(Integer historyId,Integer imgId);

    void deletePastImages(Integer imgId);

    List<Test> viewTestName(String patientId,String consenttoken);

    List<Test> viewTest(String patientId,String consenttoken);

    Test  addTestResult(Integer id,Test test);

    Test editTestResult(Integer id,Test test);

    void deleteTestResult(Integer id);

    TestImages addTestImages(Integer id,TestImages testImages);

    TestImages editTestImages(Long testimageId,TestImages testImages);

    List<TestImages> viewTestImages(Integer id ,String pid,String consenttoken);

    TestImages viewTestImagesById(Integer id,Long testimageid);

    void deleteTestImages(Long testimageId);

    Test viewTestById(String patientId,Integer id);

    Map<String, Boolean> checkVitalsAndSymptoms(String patientId,String consenttoken);

    String getConsentToken(String pid);

    List<Medication> getMedications(String patientId, String consenttoken);

    List<Canvas> getCanvas(String patientId, String consenttoken);

    Message addMessage(Message message);

    String getDoctorEmail(String patientId,String tid);

    String sendOtp(String contact);

    String getContactFromEmail(String email);

    Boolean verifyOtp(String contact,String otp);

}
