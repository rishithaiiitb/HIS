package com.had.his.Controller;

import com.had.his.DTO.LoginDTO;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;
import com.had.his.Service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/addAdmin")
    private ResponseEntity<Admin> saveAdmin(@Valid @RequestBody Admin admin) {
        try {
            Admin newAdmin = adminService.saveAdmin(admin);
            return ResponseEntity.ok(newAdmin);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> adminLogin(@Valid @RequestBody LoginDTO credentials) {
        try {
            LoginResponse loginResponse = adminService.verifyAdmin(credentials);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/logout/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> logoutService(@PathVariable String email){
        adminService.logoutService(email);
        return ResponseEntity.ok("Token expired");
    }

    @PostMapping("/passwordChange")
    public ResponseEntity<Admin> changeAdminPassword(@Valid @RequestBody LoginDTO credentials) {
        try {
            Admin admin =adminService.changePassword(credentials);
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addDoctor/{specialization}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Doctor> saveDoctor(@RequestBody Doctor doc, @PathVariable String specialization) {
        try {
            Doctor newDoctor = adminService.saveDoctor(doc,specialization);
            return ResponseEntity.ok(newDoctor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/viewDoctors/{department}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<List<Doctor>> getAllDoctors(@PathVariable("department") String department) {
        try {
            List<Doctor> doctors = adminService.getAllDoctors(department);
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addNurse")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Nurse> saveNurse(@Valid @RequestBody Nurse nurse) {
        try {
            Nurse newNurse = adminService.saveNurse(nurse);
            return ResponseEntity.ok(newNurse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/viewNurses")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<List<Nurse>> getAllNurses() {
        try {
            List<Nurse> nurses = adminService.getAllNurses();
            return ResponseEntity.ok(nurses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/addReceptionist")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Receptionist> saveReceptionist(@Valid @RequestBody Receptionist rec) {
        try {
            Receptionist newRec = adminService.saveReceptionist(rec);
            return ResponseEntity.ok(newRec);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/viewReceptionists")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<List<Receptionist>> getAllReceptionists() {
        try {
            List<Receptionist> receptionists = adminService.getAllReceptionists();
            return ResponseEntity.ok(receptionists);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/addPharmacy")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Pharmacy> saveReceptionist(@Valid @RequestBody Pharmacy pharma) {
        try {
            Pharmacy newPh = adminService.savePharmacy(pharma);
            return ResponseEntity.ok(newPh);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/viewPharmacies")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<List<Pharmacy>> getAllPharmacies() {
        try {
            List<Pharmacy> pharmacies = adminService.getAllPharmacies();
            return ResponseEntity.ok(pharmacies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/deactivateDoctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateDoctor(@PathVariable("doctorId") String doctorId) {
        try {
            adminService.deactivateDoctor(doctorId);
            return ResponseEntity.ok("Doctor with ID " + doctorId + " deactivated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/deactivateNurse/{nurseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateNurse(@PathVariable("nurseId") String nurseId) {
        try {
            adminService.deactivateNurse(nurseId);
            return ResponseEntity.ok("Nurse with ID " + nurseId + " deactivated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/deactivateReceptionist/{recepId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateReceptionist(@PathVariable("recepId") String recepId) {
        try {
            adminService.deactivateReceptionist(recepId);
            return ResponseEntity.ok("Receptionist with ID " + recepId + " deactivated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/deactivatePharmacy/{pharmaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivatePharmacy(@PathVariable("pharmaId") String pharmaId) {
        try {
            adminService.deactivatePharmacy(pharmaId);
            return ResponseEntity.ok("Pharmacy with ID " + pharmaId + " deactivated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/viewDoctor/{did}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Doctor> getDoctor(@PathVariable("did") String doctorId){
        try{
            Doctor doc = adminService.getDoctor(doctorId);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/viewNurse/{nid}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Nurse> getNurse(@PathVariable("nid") String nurseId){
        try{
            Nurse nurse = adminService.getNurse(nurseId);
            return ResponseEntity.ok(nurse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewReceptionist/{rid}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Receptionist> getReceptionist(@PathVariable("rid") String recepId){
        try{
            Receptionist recep = adminService.getReceptionist(recepId);
            return ResponseEntity.ok(recep);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/viewPharmacy/{phid}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Pharmacy> getPharmacy(@PathVariable("phid") String pharmacyId){
        try{
            Pharmacy pharmacy = adminService.getPharmacy(pharmacyId);
            return ResponseEntity.ok(pharmacy);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/patientCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getPatientCount() {
        try {
            long patientCount = adminService.countPatient();
            return ResponseEntity.ok(patientCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/doctorCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getDoctorCount(){
        try {
            long doctorCount = adminService.countDoctor();
            return ResponseEntity.ok(doctorCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/receptionistCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getReceptionistCount(){
        try {
            long recepCount = adminService.countReceptionist();
            return ResponseEntity.ok(recepCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/pharmacyCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getPharmacyCount(){
        try {
            long pharmaCount = adminService.countPharmacy();
            return ResponseEntity.ok(pharmaCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/nurseCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getNurseCount(){

        try {
            long nurseCount = adminService.countNurse();
            return ResponseEntity.ok(nurseCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @PutMapping("/editDoctor/{did}/{specialization}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Doctor> editDoctor(@PathVariable("did") String did,@RequestBody Doctor doctor, @PathVariable String specialization){
        try {
            Doctor newDoctor = adminService.editDoctor(did,doctor,specialization);
            return ResponseEntity.ok(newDoctor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editNurse/{nid}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Nurse> editNurse(@PathVariable("nid") String nid,@Valid @RequestBody Nurse nurse){
        try {
            Nurse newNurse = adminService.editNurse(nid,nurse);
            return ResponseEntity.ok(newNurse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editPharmacy/{phid}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Pharmacy> editPharmacy(@PathVariable("phid") String phid,@Valid @RequestBody Pharmacy pharma){
        try {
            Pharmacy newPharma = adminService.editPharmacy(phid,pharma);
            return ResponseEntity.ok(newPharma);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/editReceptionist/{rid}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Receptionist> editReceptionist(@PathVariable("rid") String rid,@Valid @RequestBody Receptionist recep){
        try {
            Receptionist newReceptionist = adminService.editReceptionist(rid,recep);
            return ResponseEntity.ok(newReceptionist);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getHospitalDetails")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Hospital> getHospital()
    {
        try{
            Hospital hospital = adminService.getHospital();
            return ResponseEntity.ok(hospital);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addSpecialization")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Specialization> addSpecialization(@Valid @RequestBody Specialization spec){
        try{
            Specialization specialization = adminService.addSpecialization(spec);
            return ResponseEntity.ok(specialization);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/viewSpecializations")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<List<String>> viewSpecializations(){
        List<String> specializations=adminService.viewSpecializations();
        return new ResponseEntity<>(specializations,HttpStatus.OK);
    }


    @GetMapping("/doctorCountsBySpecialization")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getDoctorCountsBySpecialization() {
        try {
            List<Map<String, Object>> result = adminService.getDoctorsCountBySpecialization();
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllSpecializationDetails")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<List<Specialization>> getAllSpecializationDetails() {
        try {
            List<Specialization> specializations = adminService.getAllSpecializationDetails();
            return new ResponseEntity<>(specializations, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteSpecialization/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<?> deleteSpecialization(@PathVariable Long id) {
        try {
            adminService.deleteSpecialization(id);
            return ResponseEntity.ok().build();
        }  catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/editSpecialization/{id}/{updatedSpecialization}")
    @PreAuthorize("hasRole('ADMIN')")
    private ResponseEntity<Specialization> editSpecialization(@PathVariable Long id,@PathVariable String updatedSpecialization) {
        try {
            Specialization specialization = adminService.editSpecialization(id, updatedSpecialization);
            return ResponseEntity.ok(specialization);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}