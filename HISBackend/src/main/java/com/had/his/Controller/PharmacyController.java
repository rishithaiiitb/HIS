package com.had.his.Controller;


import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.Canvas;
import com.had.his.Entity.Medication;
import com.had.his.Entity.Pharmacy;
import com.had.his.Response.LoginResponse;
import com.had.his.Service.PharmacyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/pharmacy")
public class PharmacyController {


    private final PharmacyService pharmacyService;

    public PharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> pharmacyLogin(@Valid @RequestBody LoginDTO credentials) {
        try {
            LoginResponse loginResponse = pharmacyService.verifyPharmacy(credentials);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/logout/{email}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> logoutService(@PathVariable String email){
        pharmacyService.logoutService(email);
        return ResponseEntity.ok("Token expired");
    }

    @PostMapping("/passwordChange")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Pharmacy> changePharmacyPassword(@RequestBody LoginDTO credentials) {
        try {
            Pharmacy newPharmacy = pharmacyService.changePassword(credentials);
            return ResponseEntity.ok(newPharmacy);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/home/{email}")
    @PreAuthorize("hasRole('PHARMACY')")
    private ResponseEntity<Pharmacy> findByEmail(@PathVariable("email") String email) {
        try {
            Pharmacy newPharmacy = pharmacyService.findByEmail(email);
            return ResponseEntity.ok(newPharmacy);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewPharmacy/{pharmacyId}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Pharmacy> viewPharmacy(@PathVariable String pharmacyId)
    {
        Pharmacy pharmacy= pharmacyService.viewPharmacy(pharmacyId);
        return new ResponseEntity<>(pharmacy, HttpStatus.OK);

    }

    @GetMapping("/viewMedication/{patientId}/{consenttoken}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<Medication>> viewMedication(@PathVariable String patientId,@PathVariable String consenttoken)
    {
        List<Medication> medications= pharmacyService.viewMedication(patientId,consenttoken);
        if(medications == null)
        {
            return new ResponseEntity<>(medications, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(medications, HttpStatus.OK);

    }

    @PutMapping("/serve/{medicineId}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> serveMedication(@PathVariable Long medicineId) {

        try {
            pharmacyService.serveMedication(medicineId);
            return ResponseEntity.ok("Medication served successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to serve medication: " + e.getMessage());
        }
    }

    @GetMapping("/viewCanvas/{patientId}/{consenttoken}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<Canvas>> viewCanvas(@PathVariable String patientId, @PathVariable String consenttoken)
    {
        List<Canvas> canvas= pharmacyService.viewCanvas(patientId,consenttoken);
        if(canvas == null)
        {
            return new ResponseEntity<>(canvas, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(canvas, HttpStatus.OK);

    }

    @PutMapping("/serveCanvas/{canvasId}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> serveCanvas(@PathVariable Long canvasId) {

        try {
            pharmacyService.serveCanvas(canvasId);
            return ResponseEntity.ok("Medication served successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to serve medication: " + e.getMessage());
        }
    }

    @GetMapping("/total-served")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Object> getTotalServed() {
        try {
            Map<String, Integer> totals = pharmacyService.servedCount();
            return ResponseEntity.ok(totals);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch total served data: " + e.getMessage());
        }
    }

    @GetMapping("/getConsentToken/{pid}")
    @PreAuthorize("hasRole('PHARMACY')")
    private ResponseEntity<String> getConsentToken(@PathVariable("pid") String pid){
        try {
            String consentToken = pharmacyService.getConsentToken(pid);
            return ResponseEntity.ok(consentToken);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/sendOtpforpassword/{contact}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> sendOtp(@PathVariable String contact) {
        try {
            String response = pharmacyService.sendOtp(contact);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verifyOtpforpassword/{contact}/{otp}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> verifyOtp(@PathVariable String contact, @PathVariable String otp) {
        try {
            boolean isOtpValid = pharmacyService.verifyOtp(contact, otp);
            if (isOtpValid) {
                return ResponseEntity.ok("OTP verification successful.");
            } else {
                return ResponseEntity.badRequest().body("Invalid OTP or OTP expired.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify OTP: " + e.getMessage());
        }
    }

    @GetMapping("/getContactFromEmail/{email}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> getContactFromEmail(@PathVariable String email){
        String contact=pharmacyService.getContactFromEmail(email);
        return new ResponseEntity<>(contact,HttpStatus.OK);
    }
    
}