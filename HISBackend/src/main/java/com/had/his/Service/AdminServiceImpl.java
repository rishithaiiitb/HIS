package com.had.his.Service;

import com.had.his.DAO.*;
import com.had.his.DTO.LoginDTO;
import com.had.his.Encryption.AESUtil;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;
import com.had.his.Role.UserRole;
import com.had.his.Security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private DoctorDAO doctorDAO;
    @Autowired
    private NurseDAO nurseDAO;
    @Autowired
    private ReceptionistDAO receptionistDAO;
    @Autowired
    private PharmacyDAO pharmacyDAO;
    @Autowired
    private PatientDAO patientDAO;
    @Autowired
    private NurseScheduleDAO nurseScheduleDAO;
    @Autowired
    private AdminDAO adminDAO;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private HospitalDAO hospitalDAO;
    @Autowired
    private SpecializationDAO specializationDAO;
    @Autowired
    private ReceptionistScheduleDAO receptionistScheduleDAO;

    @Autowired
    private TokenDAO tokenDAO;

    @Autowired
    private AESUtil aesUtil;

    private static int adminCounter=0;

    private String generateNextAdminId() {
        adminCounter++;
        return "A" + String.format("%02d", adminCounter);
    }

    public Admin saveAdmin(Admin admin)
    {
        String emailRegex = "^[A-Za-z]+\\d{2}@his\\.com$";
        if(!admin.getEmail().matches(emailRegex)){
            throw new  IllegalArgumentException("Invalid email address");
        }
        System.out.println((admin.getPassword().length()));
        admin.setAdminId(generateNextAdminId());
        admin.setRole(UserRole.ADMIN);
        return adminDAO.save(admin);
    }

    @Transactional
    public Admin changePassword(LoginDTO credentials){
        Admin admin = adminDAO.findAdminByEmail(credentials.getEmail());
        admin.setPassword(credentials.getPassword());

        return adminDAO.save(admin);
    }

    public LoginResponse verifyAdmin(LoginDTO credentials) {

        try {
            String email = aesUtil.decrypt(credentials.getEmail());
            System.out.println(email);
            String enteredPassword = aesUtil.decrypt(credentials.getPassword());
            System.out.println(enteredPassword);

            Admin admin = adminDAO.findAdminByEmail(email);
            if (admin != null) {
                if (admin.isPasswordMatch(enteredPassword)) {
                    String token = (tokenDAO.findByUsername(aesUtil.decrypt(credentials.getEmail())));
                    if (token != null) {
                        return new LoginResponse("Already logged in", false, null);
                    }
                    String jwttoken = jwtTokenProvider.generateToken(admin);
                    return new LoginResponse("Login Successful", true, jwttoken);
                } else {
                    return new LoginResponse("Password not matched", null, null);
                }
            } else {
                return new LoginResponse("Invalid User.", null, null);
            }
        }catch (Exception e){
            return new LoginResponse("Decryption failed",null,null);
        }
    }


    public void logoutService(String email) {
        tokenDAO.deletetoken(email);
    }


    public Doctor saveDoctor(Doctor doc,String specialization) {
        if(doc.getName().length()<2 || doc.getName().length()>30){
            throw new IllegalArgumentException("Invalid Name Input");
        }
        String regexage="^[1-9]\\d*$";
        if(!doc.getAge().matches(regexage)){
            throw new IllegalArgumentException("Age should be positive");
        }
        String regcon="^[1-9]\\d*$";
        if(!doc.getContact().matches(regcon)||doc.getContact().length()<10 || doc.getContact().length()>10){
            throw new IllegalArgumentException("Contact Number should be positive and between 8 to 10 numbers");
        }
        Specialization spec = specializationDAO.getSpecializationByName(specialization);
        doc.setSpecialization(spec);
        doc.setActive(true);
        doc.setAvailability(true);
        doc.setRole(UserRole.DOCTOR);
        if(doc.getPassword()==null){
            doc.setPassword("docpwd");
        }
        return doctorDAO.save(doc);
    }


    public Nurse saveNurse(Nurse nurse) {
        if(nurse.getName().length()<2 || nurse.getName().length()>30){
            throw new IllegalArgumentException("Invalid Name Input");
        }
        String regexage="^[1-9]\\d*$";
        if(!nurse.getAge().matches(regexage)){
            throw new IllegalArgumentException("Age should be positive");
        }
        String regcon="^[1-9]\\d*$";
        if(!nurse.getContact().matches(regcon)||nurse.getContact().length()<10|| nurse.getContact().length()>10){
            throw new IllegalArgumentException("Contact Number should be positive and between 8 to 10 numbers");
        }

        nurse.setActive(true);
        nurse.setRole(UserRole.NURSE);
        if (nurse.getPassword() == null) {
            nurse.setPassword("nursepwd");
        }

        for (NurseSchedule schedule : nurse.getNurseSchedules()) {
            schedule.setNurse(nurse);
        }
        return nurseDAO.save(nurse);


    }
    public Receptionist saveReceptionist(Receptionist rec) {
        if(rec.getName().length()<2 || rec.getName().length()>30){
            throw new IllegalArgumentException("Invalid Name Input");
        }
        String regexage="^[1-9]\\d*$";
        if(!rec.getAge().matches(regexage)){
            throw new IllegalArgumentException("Age should be positive");
        }
        String regcon="^[1-9]\\d*$";
        if(!rec.getContact().matches(regcon)||rec.getContact().length()<10 || rec.getContact().length()>10){
            throw new IllegalArgumentException("Contact Number should be positive and between 8 to 10 numbers");
        }
        rec.setActive(true);
        rec.setRole(UserRole.RECEPTIONIST);
        if(rec.getPassword()==null){
            rec.setPassword("recpwd");
        }
        for (ReceptionistSchedule schedule : rec.getReceptionistSchedules()) {
            schedule.setReceptionist(rec);
        }

        System.out.println(rec.getPhoto());
        return receptionistDAO.save(rec);
    }
    public Pharmacy savePharmacy(Pharmacy pharma) {
        if(pharma.getName().length()<2 || pharma.getName().length()>30){
            throw new IllegalArgumentException("Invalid Name Input");
        }
        String regcon="^[1-9]\\d*$";
        if(!pharma.getContact().matches(regcon)||pharma.getContact().length()<10 || pharma.getContact().length()>10){
            throw new IllegalArgumentException("Contact Number should be positive and between 8 to 10 numbers");
        }
        pharma.setActive(true);
        pharma.setRole(UserRole.PHARMACY);
        if(pharma.getPassword()==null){
            pharma.setPassword("pharmapwd");
        }
        return pharmacyDAO.save(pharma);
    }
    public List<Doctor> getAllDoctors(String department) {
        return doctorDAO.getDoctorByDepartmentAndActive(department);
    }
    public List<Nurse> getAllNurses() {
        return nurseDAO.getNurseByActive();
    }
    public List<Receptionist> getAllReceptionists() {
        return receptionistDAO.getReceptionistByActive();
    }
    public List<Pharmacy> getAllPharmacies() {
        return pharmacyDAO.getPharmaciesByActive();
    }
    public Doctor getDoctor(String doctorId)
    {
        return doctorDAO.findByDoctorId(doctorId);
    }
    public Nurse getNurse(String nurseId)
    {
        return nurseDAO.findByNurseId(nurseId);
    }
    public Receptionist getReceptionist(String recepId)
    {
        return receptionistDAO.findByReceptionistId(recepId);
    }
    public Pharmacy getPharmacy(String pharmaId)
    {
        return pharmacyDAO.findPharmacyByPharmacyId(pharmaId);
    }
    public void deactivateDoctor(String doctorId) {
        Doctor newDoctor = doctorDAO.findByDoctorId(doctorId);
        newDoctor.setActive(false);
        doctorDAO.save(newDoctor);
    }

    public void deactivateNurse(String nurseId) {
        Nurse newNurse = nurseDAO.findDetailsById(nurseId);
        newNurse.setActive(false);
        nurseDAO.save(newNurse);
    }

    public void deactivatePharmacy(String pharmaId) {
        Pharmacy newPharmacy = pharmacyDAO.findPharmacyByPharmacyId(pharmaId);
        newPharmacy.setActive(false);
        pharmacyDAO.save(newPharmacy);
    }

    public void deactivateReceptionist(String recepId) {
        Receptionist newReceptionist = receptionistDAO.findReceptionistByReceptionistId(recepId);
        newReceptionist.setActive(false);
        receptionistDAO.save(newReceptionist);
    }
    public long countPatient()
    {
        return patientDAO.count();
    }

    @Override
    public long countDoctor() {
        return doctorDAO.countDoctorsByActive();
    }

    @Override
    public long countNurse() {
        return nurseDAO.countNurseByActive();
    }

    @Override
    public long countReceptionist()
    {
        return receptionistDAO.countReceptionistByActive();
    }

    @Override
    public long countPharmacy()
    {
        return pharmacyDAO.getPharmaciesByActiveCount();
    }




    public Doctor editDoctor(String did,Doctor doctor,String specialization){
        Doctor newDoctor = doctorDAO.findByDoctorId(did);
        newDoctor.setName(doctor.getName());
        if(newDoctor.getName()!=doctor.getName())
        {
            newDoctor.generateEmail();
        }
        newDoctor.setSex(doctor.getSex());
        newDoctor.setAge(doctor.getAge());
        newDoctor.setQualification(doctor.getQualification());
        newDoctor.setContact(doctor.getContact());
        newDoctor.setSpecialization(doctor.getSpecialization());
        newDoctor.setDepartment(doctor.getDepartment());
        newDoctor.setLicenseNumber(doctor.getLicenseNumber());
        newDoctor.setPhoto(doctor.getPhoto());
        newDoctor.setActive(doctor.getActive());
        Specialization spec = specializationDAO.getSpecializationByName(specialization);
        newDoctor.setSpecialization(spec);
        return doctorDAO.save(newDoctor);
    }

    public Nurse editNurse(String nid,Nurse nurse){
        Nurse newNurse = nurseDAO.findDetailsById(nid);
        newNurse.setName(nurse.getName());
        if(newNurse.getName()!=nurse.getName())
        {
            newNurse.generateEmail();
        }
        newNurse.setSex(nurse.getSex());
        newNurse.setAge(nurse.getAge());
        newNurse.setPhoto(nurse.getPhoto());
        newNurse.setContact(nurse.getContact());
        //newNurse.setEmail(nurse.getEmail());
        List<NurseSchedule> existingSchedules=nurseScheduleDAO.getNurseScheduleById(newNurse.getNurseId());
        nurseScheduleDAO.deleteAll(existingSchedules);
        List<NurseSchedule> nurseSchedules=nurse.getNurseSchedules();
        for(NurseSchedule schedule:nurseSchedules){
            schedule.setNurse(newNurse);
        }
        newNurse.setNurseSchedules(nurseSchedules);
        return nurseDAO.save(newNurse);
    }

    public Pharmacy editPharmacy(String phid,Pharmacy pharma)
    {

        Pharmacy newPharma = pharmacyDAO.findPharmacyByPharmacyId(phid);
        newPharma.setName(pharma.getName());
        if(newPharma.getName()!=pharma.getName())
        {
            newPharma.generateEmail();
        }
        newPharma.setAddress(pharma.getAddress());
        newPharma.setLicenseNumber(pharma.getLicenseNumber());
        newPharma.setContact(pharma.getContact());
//        newPharma.setEmail(pharma.getEmail());
        return pharmacyDAO.save(newPharma);
    }

    public Receptionist editReceptionist(String rid,Receptionist receptionist)
    {
        Receptionist newRecep = receptionistDAO.findReceptionistByReceptionistId(rid);
        newRecep.setName(receptionist.getName());
        if(newRecep.getName()!=receptionist.getName())
        {
            newRecep.generateEmail();
        }
        newRecep.setSex(receptionist.getSex());
        newRecep.setPhoto(receptionist.getPhoto());
        newRecep.setContact(receptionist.getContact());
        // newRecep.setEmail(receptionist.getEmail());
        newRecep.setAge(receptionist.getAge());
        List<ReceptionistSchedule> existingSchedules=receptionistScheduleDAO.getReceptionistScheduleById(newRecep.getReceptionistId());
        receptionistScheduleDAO.deleteAll(existingSchedules);
        List<ReceptionistSchedule> receptionistSchedules=receptionist.getReceptionistSchedules();
        for(ReceptionistSchedule schedule:receptionistSchedules){
            schedule.setReceptionist(newRecep);
        }
        newRecep.setReceptionistSchedules(receptionistSchedules);

        return receptionistDAO.save(newRecep);
    }

    public Hospital getHospital()
    {
        return hospitalDAO.getHospitalDetails();
    }

    @Override
    public Specialization addSpecialization(Specialization specialization) {
        return specializationDAO.save(specialization);
    }
    public List<String> viewSpecializations()
    {
        return specializationDAO.findALLSpecializations();
    }


    @Override
    public List<Map<String, Object>> getDoctorsCountBySpecialization() {
        List<Object[]> doctorCounts = doctorDAO.countDoctorsBySpecialization();
        List<Map<String, Object>> resultList = new ArrayList<>();

        for (Object[] count : doctorCounts) {
            String specializationName = (String) count[0];
            Long opDoctorCount = (Long) count[1];
            Long ipDoctorCount = (Long) count[2];

            Map<String, Object> row = new HashMap<>();
            row.put("specializationName", specializationName);
            row.put("opDoctorCount", opDoctorCount);
            row.put("ipDoctorCount", ipDoctorCount);

            resultList.add(row);
        }
            return resultList;
    }

    @Override
    public Specialization getSpecializationByName(String specName) {
        return specializationDAO.getSpecializationByName(specName);
    }

    public List<Specialization> getAllSpecializationDetails() {
        return specializationDAO.findAllSortedBySid();
    }

    @Override
    public void deleteSpecialization(Long sid) {
        specializationDAO.deleteById(sid);
    }

    public Specialization editSpecialization(Long id, String updatedSpecializationName) {
        Specialization specialization = specializationDAO.findById(id).orElse(null);
        assert specialization != null;
        specialization.setSpecializationName(updatedSpecializationName);
        return specializationDAO.save(specialization);
    }

}


