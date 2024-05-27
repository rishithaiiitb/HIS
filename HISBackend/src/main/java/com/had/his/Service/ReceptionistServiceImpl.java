package com.had.his.Service;

import com.had.his.DAO.*;
import com.had.his.DTO.AppointmentDTO;
import com.had.his.DTO.LoginDTO;
import com.had.his.Encryption.AESUtil;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;
import com.had.his.Security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReceptionistServiceImpl implements ReceptionistService {

    @Autowired
    private PatientDAO patientDAO;

    @Autowired
    private ConsentDAO consentDAO;

    @Autowired
    private VisitDAO visitDAO;

    @Autowired
    private DoctorDAO doctorDAO;

    @Autowired
    private ReceptionistDAO receptionistDAO;

    @Autowired
    private SymptomsDAO symptomsDAO;

    @Autowired
    private VitalsDAO vitalsDAO;

    @Autowired
    private SpecializationDAO specializationDAO;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenDAO tokenDAO;

    @Autowired
    private PastHistoryDAO pastHistoryDAO;

    @Autowired
    private ConsentService consentService;

    @Autowired
    private ReceptionistScheduleDAO receptionistScheduleDAO;

    @Autowired
    private MedicationDAO medicationDAO;

    @Autowired
    private TestDAO testDAO;

    @Autowired
    private ProgressDAO progressDAO;

    @Autowired
    private CanvasDAO canvasDAO;

    @Autowired
    private AESUtil aesUtil;


    public LoginResponse verifyReceptionist(LoginDTO loginDto) {
        Receptionist receptionist = receptionistDAO.findByEmail(aesUtil.decrypt(loginDto.getEmail()));

        if (receptionist != null && receptionist.getActive().equals(true)) {

            List<ReceptionistSchedule> schedules = receptionist.getReceptionistSchedules();

            if (!schedules.isEmpty()) {
                LocalDate currentDate = LocalDate.now();
                LocalTime currentTime = LocalTime.now();

                for (ReceptionistSchedule schedule : schedules) {
                    if (currentDate.getDayOfWeek() == schedule.getDay() &&
                            currentTime.isAfter(schedule.getStartTime()) &&
                            currentTime.isBefore(schedule.getEndTime())) {

                        String password = aesUtil.decrypt(loginDto.getPassword());

                        boolean passMatch = receptionist.isPasswordMatch(password);

                        if (passMatch) {
                            System.out.println("Password matched");
                            String token = tokenDAO.findByUsername(aesUtil.decrypt(loginDto.getEmail()));
                            if (token != null) {
                                return new LoginResponse("Already logged in", false, null);
                            }
                            String jwtToken = jwtTokenProvider.generateToken(receptionist);
                            return new LoginResponse("Login Successful", true, jwtToken);
                        } else {
                            return new LoginResponse("Password not matched", false, null);
                        }
                    }
                }
                return new LoginResponse("WARNING!! You can't login outside your schedule time.", false, null);
            } else {
                return new LoginResponse("Receptionist schedules not found.", false, null);
            }
        } else {
            return new LoginResponse("Email not found or receptionist is not active", false, null);
        }
    }

    public void logoutService(String email) {
        tokenDAO.deletetoken(email);
    }



    @Override
    public Patient getPatientDetails(String pid,String consenttoken)
    {
            return patientDAO.findPatientDetailsById(pid);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientDAO.findAll();
    }


    @Transactional
    public Visit bookAppointmentForExistingPatient(String email,String pid, AppointmentDTO appointment) {
        Patient patient = patientDAO.findPatientDetailsById(pid);
        if (!appointment.getEmergency()){
            patient.setAge(appointment.getAge());
            patient.setContact(appointment.getContact());
            patient.setEmail(appointment.getEmail());
        }else{
            if(appointment.getName()!=null){
                patient.setPatientName(appointment.getName());
            }
            if(appointment.getAge()!=null){
                patient.setAge(appointment.getAge());
            }
            if(appointment.getSex()!=null){
                patient.setSex(appointment.getSex());
            }
            if(appointment.getContact()!=null){
                patient.setContact(appointment.getContact());
            }
            if(appointment.getEmail()!=null){
                patient.setEmail(appointment.getEmail());
            }
        }
        patient.setDepartment("OP");
        Visit visit = new Visit();
        Doctor doctor = doctorDAO.findByDoctorId(appointment.getDoctorId());
        visit.setDoctor(doctor);
        visit.setEmergency(appointment.getEmergency());
        visit.setPatient(patient);
        visit.setSpecialization(appointment.getCategory());
        visit.setAdmittedDate(LocalDate.now());
        visit.setAdmittedTime(LocalTime.now());
        visit.setChecked(false);
        patient.addVisit(visit);
        patientDAO.save(patient);
        consentService.consentforExisting(pid,email);
        return visitDAO.save(visit);
    }

    @Override
    public Visit bookAppointmentForNewPatient(String email,AppointmentDTO appointment) {
        System.out.println(appointment.getEmergency());
        if(!appointment.getEmergency()){
            if(appointment.getName().isEmpty()||appointment.getAge()==null||appointment.getContact()==null||appointment.getSex().isEmpty()) {
                throw new IllegalArgumentException("Patient details needed");
            }
        }
        Patient patient = new Patient();
        if (appointment.getEmergency()) {
            if(appointment.getName()!=""){
                patient.setPatientName(appointment.getName());
            }
            else {
                patient.setPatientName("Emergency Patient");
            }
            if(appointment.getAge()!=""){
                patient.setAge(appointment.getAge());
            }
            else {
                patient.setAge("100");
            }
            if(appointment.getSex()!=""){
                patient.setSex(appointment.getSex());
            }
            else {
                patient.setSex("Unknown");
            }
            if(appointment.getContact()!=""){
                patient.setContact(appointment.getContact());
            }
            else {
                patient.setContact("0000000000");
            }
            if(appointment.getEmail()!=""){
                patient.setEmail(appointment.getEmail());
            }
            else {
                patient.setEmail("emergency@example.com");
            }
        } else {
            // Set values based on appointment details
            patient.setPatientName(appointment.getName());
            patient.setAge(appointment.getAge());
            patient.setSex(appointment.getSex());
            patient.setContact(appointment.getContact());
            patient.setEmail(appointment.getEmail());
        }
        patient.setDepartment("OP");
        Visit visit = new Visit();
        visit.setDoctor(doctorDAO.findByDoctorId(appointment.getDoctorId()));
        visit.setEmergency(appointment.getEmergency());
        visit.setPatient(patient);
        visit.setSpecialization(appointment.getCategory());
        visit.setAdmittedDate(LocalDate.now());
        visit.setAdmittedTime(LocalTime.now());
        visit.setChecked(false);
        visit.setDischargedDate(null);
        visit.setMedications(null);
        visit.setTests(null);
        patient.addVisit(visit);
        patientDAO.save(patient);
        consentService.createConsent(patient.getPatientId(),email);
        return visitDAO.save(visit);
    }


    @Override
    public Patient updatePatient(String patientId, Patient updatedPatient) {
        Patient existingPatient = patientDAO.findPatientDetailsById(patientId);
        existingPatient.setPatientName(updatedPatient.getPatientName());
        existingPatient.setAge(updatedPatient.getAge());
        existingPatient.setSex(updatedPatient.getSex());
        existingPatient.setContact(updatedPatient.getContact());
        existingPatient.setEmail(updatedPatient.getEmail());
        existingPatient.setDepartment(updatedPatient.getDepartment());
        return patientDAO.save(existingPatient);
    }

    @Override
    public Patient deletePatientPII(String patientId) {
        Patient patient = patientDAO.findPatientDetailsById(patientId);
        assert patient != null;
        patient.setPatientName("Anonymous Patient");
        patient.setAge("0");
        patient.setSex("NA");
        patient.setContact("No Contact Provided");
        patient.setEmail("No Email Provided");
        return patientDAO.save(patient);
    }

    @Transactional
    public void deletePatientRecords(String patientId) {
        Patient patient = patientDAO.findPatientDetailsById(patientId);
        patient.setPatientName("Anonymous Patient");
        patient.setAge("0");
        patient.setSex("NA");
        patient.setContact("No Contact Provided");
        patient.setEmail("No Email Provided");
        patient.setDepartment("NA");
        pastHistoryDAO.deleteAll(pastHistoryDAO.getPastHistoriesByPatient(patientId));
        vitalsDAO.deleteVitalsByPatient(patientId);
        symptomsDAO.deleteSymptomsByPatient(patientId);
        medicationDAO.deleteAll(medicationDAO.getAllMedicationByPatient(patientId));
        canvasDAO.deleteAll(canvasDAO.getAllCanvasByPatient(patientId));
        testDAO.deleteAll(testDAO.getAllTestsByPatientId(patientId));
        progressDAO.deleteAll(progressDAO.findByPatient(patientId));
        Consent consent=consentDAO.getConsentByPatient(patientId);
        consent.setExpired(true);
        consentDAO.save(consent);
        patientDAO.save(patient);
    }

    @Override
    public List<Patient> getIndoorPatients() {
        return patientDAO.findIndoorPatientDetails();
    }

    @Override
    public List<Patient> getOutdoorPatients() {
        return patientDAO.findOutdoorPatientDetails();
    }


    @Override
    public List<Doctor> getIndoorDoctors() {
        return doctorDAO.findIndoorDoctorDetails();
    }

    @Override
    public List<Doctor> getOutdoorDoctors() {
        return doctorDAO.findOutdoorDoctorDetails();
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorDAO.findAll();
    }

    @Override
    public List<Doctor> getOutdoorDoctorsBySpecialization(String specialization) {
        return doctorDAO.getOutdoorDoctorsBySpecialization(specialization);
    }

    @Override
    public List<String> getSpecialization() {
        return specializationDAO.findALLSpecializations();    }

    @Transactional
    public List<ReceptionistSchedule> viewReceptionistScheduleById(String receptionistId)
    {
        return receptionistScheduleDAO.getReceptionistScheduleById(receptionistId);
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
    public Receptionist getReceptionistDetailsByEmail(String email) {
        return receptionistDAO.findByEmail(email);
    }

    @Override
    public String getConsentToken(String pid) {
        return consentDAO.getConsentTokenByPatient(pid);
    }

    @Override
    public List<String> getAllAppointments(String pid, String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)){
            return visitDAO.getAllAppointmentsByPatient(pid);
        }
        else {
            return null;
        }
    }

    @Transactional
    public String deleteAppointment(String pid, String email) {
        visitDAO.delete(visitDAO.getRecentVisitByDoctor(pid,email));
        return "Cancelled Appointment Successfully";
    }

    public Receptionist changePassword(LoginDTO credentials){
        Receptionist receptionist = receptionistDAO.findByEmail(credentials.getEmail());
        if(receptionist.getActive().equals(true)) {
            receptionist.setPassword(credentials.getPassword());
        }
        return receptionistDAO.save(receptionist);
    }

    @Transactional
    public String getContactFromEmail(String email){
        return receptionistDAO.getContactFromEmail(email);
    }

    @Override
    public String sendOtpPass(String contact) {
        OtpService.sendOTP(contact);
        return "Otp Sent";
    }

    @Override
    public Boolean verifyOtpPass(String contact, String otp) {
        return OtpService.verifyOTP(contact,otp);
    }

}