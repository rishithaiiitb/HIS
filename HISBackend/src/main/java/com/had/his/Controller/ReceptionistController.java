package com.had.his.Controller;

import com.had.his.DTO.AppointmentDTO;
import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;
import com.had.his.Service.ReceptionistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/receptionist")
public class ReceptionistController {

    @Autowired
    private ReceptionistService receptionistService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> verifyReceptionist(@Valid @RequestBody LoginDTO loginDto)
    {
        try {
            LoginResponse loginResponse = receptionistService.verifyReceptionist(loginDto);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/logout/{email}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> logoutService(@PathVariable String email){
        receptionistService.logoutService(email);
        return ResponseEntity.ok("Token expired");
    }

    @PostMapping("/passwordChange")
    public ResponseEntity<Receptionist> changeReceptionistPassword(@Valid @RequestBody LoginDTO credentials) {
        try {
            Receptionist receptionist= receptionistService.changePassword(credentials);
            return ResponseEntity.ok(receptionist);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/bookAppointmentForExistingPatient/{email}/{pid}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Visit> bookAppointmentForExistingPatient(@PathVariable("email") String email, @PathVariable("pid") String pid, @RequestBody AppointmentDTO appointment)
    {
        try {
            Visit visit = receptionistService.bookAppointmentForExistingPatient(email,pid,appointment);
            return ResponseEntity.ok(visit);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/bookAppointmentForNewPatient/{email}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Visit> bookAppointmentForNewPatient(@PathVariable("email") String email, @RequestBody AppointmentDTO appointment)
    {
        try {
            Visit visit = receptionistService.bookAppointmentForNewPatient(email,appointment);
            return ResponseEntity.ok(visit);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/getPatientDetails/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Patient> getPatientDetails(@PathVariable("pid") String pid,@PathVariable String consenttoken) {
        try {
            Patient patient = receptionistService.getPatientDetails(pid,consenttoken);
            if (patient != null) {
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/updatePatient/{pid}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Patient> updatePatient(@PathVariable("pid") String pid,@Valid @RequestBody Patient updatedPatient) {
        try {
            Patient newPatient = receptionistService.updatePatient(pid, updatedPatient);
            return ResponseEntity.ok(newPatient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/deletePatientPII/{pid}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Patient> deletePatientPII(@PathVariable("pid") String patientId) {
        try {
            Patient updatedPatient = receptionistService.deletePatientPII(patientId);
            return ResponseEntity.ok(updatedPatient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deletePatientRecords/{pid}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> deletePatientRecords(@PathVariable("pid") String patientId) {
        try {
            receptionistService.deletePatientRecords(patientId);
            return ResponseEntity.ok("Medical records deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getAllPatients")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getAllPatients() {
        try {
            List<Patient> patients = receptionistService.getAllPatients();

            if (patients != null) {
                int patientCount = patients.size();
                Map<String, Object> response = new HashMap<>();
                response.put("patientCount", patientCount);
                response.put("patients", patients);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/getIndoorPatients")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getIndoorPatients() {
        try {
            List<Patient> patients = receptionistService.getIndoorPatients();

            if (patients != null) {
                int patientCount = patients.size();
                Map<String, Object> response = new HashMap<>();
                response.put("patientCount", patientCount);
                response.put("patients", patients);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/getOutdoorPatients")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getOutdoorPatients() {
        try {
            List<Patient> patients = receptionistService.getOutdoorPatients();

            if (patients != null) {
                int patientCount = patients.size();
                Map<String, Object> response = new HashMap<>();
                response.put("patientCount", patientCount);
                response.put("patients", patients);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getAllDoctors")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getAllDoctors() {
        try {
            List<Doctor> doctors = receptionistService.getAllDoctors();

            if (doctors != null) {
                int doctorCount = doctors.size();
                Map<String, Object> response = new HashMap<>();
                response.put("doctorCount", doctorCount);
                response.put("doctors", doctors);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getIndoorDoctors")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getIndoorDoctors() {
        try {
            List<Doctor> doctors = receptionistService.getIndoorDoctors();

            if (doctors != null) {
                int doctorCount = doctors.size();
                Map<String, Object> response = new HashMap<>();
                response.put("doctorCount", doctorCount);
                response.put("doctors", doctors);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getOutdoorDoctors")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getOutdoorDoctors() {
        try {
            List<Doctor> doctors = receptionistService.getOutdoorDoctors();

            if (doctors != null) {
                int doctorCount = doctors.size();
                Map<String, Object> response = new HashMap<>();
                response.put("doctorCount", doctorCount);
                response.put("doctors", doctors);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/getOutdoorDoctorsBySpecialization/{specialization}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<Map<String, Object>> getDoctorsBySpecialization(@PathVariable String specialization) {
        try {
            List<Doctor> doctors = receptionistService.getOutdoorDoctorsBySpecialization(specialization);

            if (doctors != null) {
                int doctorCount = doctors.size();
                Map<String, Object> response = new HashMap<>();
                response.put("doctorCount", doctorCount);
                response.put("doctors", doctors);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getAllSpecializations")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<?> getAllSpecializations() {
        try {
            List<String> specializations = receptionistService.getSpecialization();
            if (specializations.isEmpty())
                return ResponseEntity.ok("No specializations exist! Please add a doctor first");
            return ResponseEntity.ok(specializations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching specializations: " + e.getMessage());
        }
    }
    @GetMapping("/viewReceptionistScheduleById/{receptionistId}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<List<ReceptionistSchedule>> viewReceptionistScheduleById(@PathVariable String receptionistId) {
        List<ReceptionistSchedule> receptionistSchedules = receptionistService.viewReceptionistScheduleById(receptionistId);
        return new ResponseEntity<>(receptionistSchedules, HttpStatus.OK);
    }

    @GetMapping("/getReceptionistDetailsByEmail/{email}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Receptionist> getReceptionistDetailsByEmail(@PathVariable String email) {
        Receptionist receptionistDto = receptionistService.getReceptionistDetailsByEmail(email);
        return new ResponseEntity<>(receptionistDto, HttpStatus.OK);
    }

    @PostMapping("/sendOtp/{contact}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> sendOtp(@PathVariable String contact) {
        try {
            String response = receptionistService.sendOtp(contact);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verifyOtp/{contact}/{otp}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> verifyOtp(@PathVariable String contact, @PathVariable String otp) {
        try {
            boolean isOtpValid = receptionistService.verifyOtp(contact, otp);
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

    @GetMapping("/getConsentToken/{pid}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<String> getConsentToken(@PathVariable("pid") String pid){
        try {
            String consentToken = receptionistService.getConsentToken(pid);
            return ResponseEntity.ok(consentToken);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getAllAppointments/{pid}/{consenttoken}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<List<String>> getAllAppointments(@PathVariable String pid, @PathVariable String consenttoken) {
        try {
            List<String> doctors = receptionistService.getAllAppointments(pid,consenttoken);
            return ResponseEntity.ok(doctors);
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/deleteAppointment/{pid}/{email}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    private ResponseEntity<String> deleteAppointment(@PathVariable String pid, @PathVariable String email) {
        try {
            String response = receptionistService.deleteAppointment(pid,email);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/sendOtpforpassword/{contact}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> sendOtpPass(@PathVariable String contact) {
        try {
            String response = receptionistService.sendOtpPass(contact);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verifyOtpforpassword/{contact}/{otp}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> verifyOtpPass(@PathVariable String contact, @PathVariable String otp) {
        try {
            boolean isOtpValid = receptionistService.verifyOtpPass(contact, otp);
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
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<String> getContactFromEmail(@PathVariable String email){
        String contact=receptionistService.getContactFromEmail(email);
        return new ResponseEntity<>(contact,HttpStatus.OK);
    }


}
