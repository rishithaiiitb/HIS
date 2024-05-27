package com.had.his.Controller;

import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;
import com.had.his.Service.DoctorService;
import com.had.his.Service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private MessageService messageService;


    @PostMapping("/login")
    public ResponseEntity<?> doctorLogin(@Valid  @RequestBody LoginDTO credentials) {
        try {
            LoginResponse loginResponse=doctorService.verifyDoctor(credentials);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/logout/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> logoutService(@PathVariable String email){
        doctorService.logoutService(email);
        return ResponseEntity.ok("Token expired");
    }


    @PostMapping("/passwordChange")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Doctor> changeDoctorPassword(@Valid @RequestBody LoginDTO credentials) {
        try {
            Doctor newDoctor = doctorService.changePassword(credentials);
            return ResponseEntity.ok(newDoctor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/home/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Doctor> findByEmail(@PathVariable("email") String email) {
        try {
            Doctor newDoctor = doctorService.findByEmail(email);
            return ResponseEntity.ok(newDoctor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewPatients/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Patient>> getPatients(@PathVariable("email") String email) {
        try {
            List<Patient> patients = doctorService.getPatients(email);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewEmergencyPatients/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Patient>> getEmergencyPatients(@PathVariable("email") String email) {
        try {
            List<Patient> patients = doctorService.getEmergencyPatients(email);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/patientDetails/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Patient> getPatientDetails(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            Patient patient = doctorService.getPatientDetails(pid,consenttoken);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/patientVitals/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Vitals> getVitalDetails(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            Vitals vitals = doctorService.getVitals(pid,consenttoken);
            return ResponseEntity.ok(vitals);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/patientSymptoms/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Symptoms> getSymptoms(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            Symptoms symptoms = doctorService.getSymptoms(pid,consenttoken);
            return ResponseEntity.ok(symptoms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/symptomImages/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<SymptomImages>> getSymptomImages(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<SymptomImages> symptomImages = doctorService.getSymptomImages(pid,consenttoken);
            return ResponseEntity.ok(symptomImages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pastHistory/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<PastHistory>> getPastHistory(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<PastHistory> pastHistories = doctorService.getPastHistory(pid,consenttoken);
            return ResponseEntity.ok(pastHistories);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pastImages/{phid}/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<PastImages>> getPastImages(@PathVariable("phid") Integer phid,@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<PastImages> pastImages = doctorService.getPastImages(phid,pid,consenttoken);
            return ResponseEntity.ok(pastImages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pastMedications/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Medication>> getPastMedications(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<Medication> medications = doctorService.getPastMedications(pid,consenttoken);
            return ResponseEntity.ok(medications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pastTests/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Test>> getPastTests(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<Test> tests = doctorService.getPastTests(pid,consenttoken);
            return ResponseEntity.ok(tests);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/recordProgress/{pid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Progress> addProgress(@PathVariable("pid") String pid,@Valid @RequestBody Progress progress) {
        try {
            Progress newProgress=doctorService.saveProgress(pid,progress);
            return ResponseEntity.ok(newProgress);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/progressHistory/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Progress>> getProgressHistory(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<Progress> progresses = doctorService.getProgressHistory(pid,consenttoken);
            return ResponseEntity.ok(progresses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewMedications/{pid}/{consenttoken}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Medication>> getMedications(@PathVariable("pid") String pid,@PathVariable String consenttoken,@PathVariable String email) {
        try {
            List<Medication> medications = doctorService.getMedications(pid,consenttoken,email);
            return ResponseEntity.ok(medications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getMedication/{pid}/{mid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Medication> getMedication(@PathVariable("pid") String pid, @PathVariable("mid") Integer mid) {
        try {
            Medication medication = doctorService.getMedicationById(pid,mid);
            return ResponseEntity.ok(medication);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addMedication/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Medication> addMedication(@PathVariable("pid") String pid,@PathVariable("email") String email,@Valid @RequestBody Medication med){
        try {
            Medication newMedication = doctorService.saveMedication(pid,med,email);
            return ResponseEntity.ok(newMedication);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editMedication/{pid}/{mid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Medication> editMedication(@PathVariable("pid") String pid,@Valid @PathVariable("mid") Integer mid, @RequestBody Medication med){
        try {
            Medication newMedication = doctorService.editMedication(pid,mid,med);
            return ResponseEntity.ok(newMedication);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/deleteMedication/{pid}/{mid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Void> deleteMedication(@PathVariable("pid") String pid, @PathVariable("mid") Integer mid){
        try {
            doctorService.deleteMedication(pid, mid);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/viewTests/{pid}/{consenttoken}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Test>> getTests(@PathVariable("pid") String pid,@PathVariable String consenttoken,@PathVariable String email) {
        try {
            List<Test> tests = doctorService.getTests(pid,consenttoken,email);
            return ResponseEntity.ok(tests);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getTest/{pid}/{tid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Test> getTest(@PathVariable("pid") String pid, @PathVariable("tid") Integer tid) {
        try {
            Test test = doctorService.getTestById(pid,tid);
            return ResponseEntity.ok(test);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addTest/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Test> addTest(@PathVariable("pid") String pid,@PathVariable("email") String email,@Valid @RequestBody Test test){
        try {
            Test newTest = doctorService.saveTest(pid,test,email);
            return ResponseEntity.ok(newTest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editTest/{pid}/{tid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Test> editTest(@PathVariable("pid") String pid, @PathVariable("tid") Integer tid,@Valid @RequestBody Test test){
        try {
            Test newTest = doctorService.editTest(pid,tid,test);
            return ResponseEntity.ok(newTest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/deleteTest/{pid}/{tid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Void> deleteTest(@PathVariable("pid") String pid, @PathVariable("tid") Integer tid){
        try {
            doctorService.deleteTest(pid, tid);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/testImages/{tid}/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<TestImages>> getTestImages(@PathVariable("tid") Integer tid,@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<TestImages> testImage = doctorService.getTestImages(tid,pid,consenttoken);
            return ResponseEntity.ok(testImage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/setDisease/{pid}/{disease}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<String> setDisease(@PathVariable("pid") String pid,@PathVariable("email") String email ,@PathVariable("disease") String disease) {
        try {
            String newDisease = doctorService.addDisease(pid,disease,email);
            return ResponseEntity.ok(newDisease);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editDisease/{pid}/{disease}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<String> editDisease(@PathVariable("pid") String pid,@PathVariable("email") String email ,@PathVariable("disease") String disease) {
        try {
            String newDisease = doctorService.editDisease(pid,disease,email);
            return ResponseEntity.ok(newDisease);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/getDisease/{pid}/{consenttoken}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<String> getDisease(@PathVariable("pid") String pid,@PathVariable("email") String email,@PathVariable String consenttoken){
        try {
            String disease = doctorService.getDisease(pid,consenttoken,email);
            return ResponseEntity.ok(disease);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/changetoIP/{pid}/{did}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Patient> recommendIP(@PathVariable("pid") String pid, @PathVariable("did") String did, @PathVariable("email") String email) {
        try {
            Patient patient = doctorService.recommendIP(pid,did,email);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/discharge/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Patient> dischargePatient(@PathVariable("pid") String pid,@PathVariable("email") String email) {
        try {
            Patient patient = doctorService.dischargePatient(pid,email);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/admittedCount/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Long> admittedPatientCount(@PathVariable("email") String email){
        try {
            Long admittedPatient = doctorService.admittedPatientCount(email);
            return ResponseEntity.ok(admittedPatient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/treatedCount/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Long> treatedPatientCount(@PathVariable("email") String email){
        try {
            Long admittedPatient = doctorService.treatedPatientCount(email);
            return ResponseEntity.ok(admittedPatient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getAllSpecializations")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<?> getAllSpecializations() {
        try {
            List<String> specializations = doctorService.getSpecializations();
            return ResponseEntity.ok(specializations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching specializations: " + e.getMessage());
        }
    }


    @GetMapping("/getSpecializationDoctors/{specialization}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable("specialization") String specialization){
        try {
            List<Doctor> doctorsBySpecialization= doctorService.getDoctorsBySpecialization(specialization);
            return ResponseEntity.ok(doctorsBySpecialization);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/exitDutyDoctor/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Doctor> exitDoctor(@PathVariable("email") String email){
        try {
            Doctor newDoctor = doctorService.exitDoctor(email);
            return ResponseEntity.ok(newDoctor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewDetails/{email}/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Patient> viewDetails(@PathVariable("email") String email, @PathVariable("pid") String pid,@PathVariable String consenttoken)
    {
        try{
            Patient patient = doctorService.findPatient(email, pid,consenttoken);
            if(patient!=null)
                return ResponseEntity.ok(patient);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewAdmitted/{bid}")
    @PreAuthorize("hasAnyRole('DOCTOR')")
    private ResponseEntity<String> getID(@PathVariable("bid") String bid)
    {
        try{
            String pid = doctorService.findID(bid);
            return ResponseEntity.ok(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/getConsentToken/{pid}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<String> getConsentToken(@PathVariable("pid") String pid){
        try {
            String consentToken = doctorService.getConsentToken(pid);
            return ResponseEntity.ok(consentToken);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/checkPatient/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Visit> checkPatient(@PathVariable("pid") String pid,@PathVariable String email){
        try {
            Visit newPatient = doctorService.checkPatient(pid,email);
            return ResponseEntity.ok(newPatient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getChecked/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Boolean> getChecked(@PathVariable("pid") String pid,@PathVariable String email){
        try {
            Boolean checked = doctorService.getChecked(pid,email);
            return ResponseEntity.ok(checked);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addCanvas/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Canvas> addCanvas(@PathVariable("pid") String pid,@PathVariable("email") String email,@Valid @RequestBody Canvas canvas){
        try {
            Canvas newCanvas = doctorService.saveCanvas(pid,canvas,email);
            return ResponseEntity.ok(newCanvas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editCanvas/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Canvas> editCanvas(@PathVariable("pid") String pid,@PathVariable("email") String email , @Valid @RequestBody Canvas canvas){
        try {
            Canvas newCanvas = doctorService.editCanvas(pid,canvas,email);
            return ResponseEntity.ok(newCanvas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/deleteCanvas/{pid}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<String> deleteCanvas(@PathVariable("pid") String pid, @PathVariable("email") String email){
        try {
            doctorService.deleteCanvas(pid, email);
            return ResponseEntity.ok("Canvas deleted succesfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/viewCanvas/{pid}/{consenttoken}/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<Canvas> getCanvas(@PathVariable("pid") String pid,@PathVariable String consenttoken,@PathVariable String email) {
        try {
            Canvas canvas = doctorService.getCanvas(pid,consenttoken,email);
            return ResponseEntity.ok(canvas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pastCanvas/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('DOCTOR')")
    private ResponseEntity<List<Canvas>> getPastCanvas(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            List<Canvas> canvasList = doctorService.getPastCanvas(pid,consenttoken);
            return ResponseEntity.ok(canvasList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/fetchnotifications/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<Message> getMessagesByDoctorEmail(@PathVariable("email") String email) {
        return messageService.findMessagesByDoctorEmail(email);
    }

    @PostMapping("/sendOtpforpassword/{contact}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> sendOtp(@PathVariable String contact) {
        try {
            String response = doctorService.sendOtp(contact);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verifyOtpforpassword/{contact}/{otp}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> verifyOtp(@PathVariable String contact, @PathVariable String otp) {
        try {
            boolean isOtpValid = doctorService.verifyOtp(contact, otp);
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
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> getContactFromEmail(@PathVariable String email){
        String contact=doctorService.getContactFromEmail(email);
        return new ResponseEntity<>(contact,HttpStatus.OK);
    }

}
