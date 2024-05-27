package com.had.his.Service;

import com.had.his.DAO.*;
import com.had.his.DTO.LoginDTO;
import com.had.his.Encryption.AESUtil;
import com.had.his.Entity.Canvas;
import com.had.his.Entity.Medication;
import com.had.his.Entity.Pharmacy;
import com.had.his.Entity.Visit;
import com.had.his.Response.LoginResponse;
import com.had.his.Security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PharmacyServiceImpl implements PharmacyService {


    @Autowired
    private PharmacyDAO pharmacyDao;

    @Autowired
    private MedicationDAO medicationDao;

    @Autowired
    private VisitDAO visitDao;

    @Autowired
    private ConsentDAO consentDAO;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenDAO tokenDAO;

    @Autowired
    private ConsentService consentService;

    @Autowired
    private CanvasDAO canvasDAO;

    @Autowired
    private AESUtil aesUtil;


    public LoginResponse verifyPharmacy(LoginDTO credentials) {
        String email = aesUtil.decrypt(credentials.getEmail());
        String enteredPassword = aesUtil.decrypt(credentials.getPassword());

        Pharmacy pharmacy = pharmacyDao.findByEmail(email);
        if (pharmacy != null && pharmacy.getActive()) {
            if( pharmacy.isPasswordMatch(enteredPassword))
            {
                String token = (tokenDAO.findByUsername(aesUtil.decrypt(credentials.getEmail())));
                if (token != null) {
                    return new LoginResponse("Already logged in", false, null);
                }
                String jwttoken= jwtTokenProvider.generateToken(pharmacy);
                return new LoginResponse("Login Successful",true,jwttoken);
            } else {
                return new LoginResponse("Password not matched", null, null);
            }
        }
        else{
            return new LoginResponse("Invalid User.", null, null);
        }
    }

    public void logoutService(String email) {
        tokenDAO.deletetoken(email);
    }



    public Pharmacy changePassword(LoginDTO credentials){
        Pharmacy pharmacy = pharmacyDao.findByEmail(credentials.getEmail());
        pharmacy.setPassword(credentials.getPassword());
        return pharmacyDao.save(pharmacy);
    }

    public Pharmacy findByEmail(String email){
        return pharmacyDao.findByEmail(email);
    }

    @Override
    public Pharmacy viewPharmacy(String pharmacyId)
    {return pharmacyDao.findPharmacyByPharmacyId(pharmacyId);}

    @Override
    public List<Medication> viewMedication(String patientId,String consenttoken)
    {

        if(consentService.verifyConsent(patientId,consenttoken))
        {
            List<Visit> visits=visitDao.getVisits(patientId);
            List<Medication> Medications = new ArrayList<>();
            for(Visit visit:visits){
                List<Medication> medsForVisit = medicationDao.findMedication(visit.getVisitId());
                for( Medication medication: medsForVisit){
                    if(!medication.getServed())
                    {
                        Medications.add(medication);
                    }
                }
            }
            return Medications;
        }
        else
        {
            return null;
        }
    }

    @Override
    public List<Canvas> viewCanvas(String patientId, String consenttoken)
    {

        if(consentService.verifyConsent(patientId,consenttoken))
        {
            List<Visit> visits=visitDao.getVisits(patientId);
            List<Canvas> canvasList = new ArrayList<>();
            for(Visit visit:visits){
                Canvas canvasForVisit = canvasDAO.findByVisitId(visit.getVisitId());
                if(canvasForVisit!= null){
                    if( !canvasForVisit.getServed()) {
                        canvasList.add(canvasForVisit);
                    }
                }
            }
            return canvasList;
        }
        else
        {
            return null;
        }
    }

    @Transactional
    public void serveCanvas(Long canvasId) {
        Canvas canvas = canvasDAO.findById(canvasId)
                .orElseThrow(() -> new RuntimeException("Canvas not found with id: " + canvasId));
        canvas.setServed(true);
        canvasDAO.save(canvas);
    }

    @Transactional
    public void serveMedication(Long medicineId) {
        Medication medication = medicationDao.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medication not found with id: " + medicineId));
        medication.setServed(true);
        medicationDao.save(medication);
    }


    public Map<String, Integer> servedCount() {
        int totalMedicinesServed = medicationDao.countUniqueMedicinesServed();
        int totalPatientsServed = medicationDao.countUniquePatientsServed();
        Map<String, Integer> totals = new HashMap<>();
        totals.put("totalMedicinesServed", totalMedicinesServed);
        totals.put("totalPatientsServed", totalPatientsServed);
        return totals;
    }

    @Override
    public String getConsentToken(String pid) {
        return consentDAO.getConsentTokenByPatient(pid);
    }

    @Override
    public String sendOtp(String contact) {
        OtpService.sendOTP(contact);
        return "Otp Sent";
    }

    @Override
    public Boolean verifyOtp(String contact, String otp) {
        return OtpService.verifyOTP(contact,otp);
    }


    @Transactional
    public String getContactFromEmail(String email){
        return pharmacyDao.getContactFromEmail(email);
    }

}
