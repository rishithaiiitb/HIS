package com.had.his.Service;

import com.had.his.DAO.*;
import com.had.his.DTO.LoginDTO;
import com.had.his.Encryption.AESUtil;
import com.had.his.Entity.*;
import com.had.his.Response.LoginResponse;
import com.had.his.Security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
import java.time.LocalDate;
import java.util.Objects;


@Service
public class DoctorServiceImpl implements DoctorService{

    @Autowired
    private DoctorDAO doctorDAO;

    @Autowired
    private PatientDAO patientDAO;

    @Autowired
    private VitalsDAO vitalsDAO;

    @Autowired
    private SymptomsDAO symptomsDAO;

    @Autowired
    private SymptomImagesDAO symptomImagesDAO;

    @Autowired
    private PastHistoryDAO pastHistoryDAO;

    @Autowired
    private PastImagesDAO pastImagesDAO;

    @Autowired
    private ProgressDAO progressDAO;

    @Autowired
    private MedicationDAO medicationDAO;

    @Autowired
    private TestDAO testDAO;

    @Autowired
    private TestImagesDAO testImagesDAO;

    @Autowired
    private BedDAO bedDAO;

    @Autowired
    private VisitDAO visitDAO;

    @Autowired
    private SpecializationDAO specializationDAO;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenDAO tokenDAO;

    @Autowired
    private ConsentDAO consentDAO;

    @Autowired
    private ConsentService consentService;

    @Autowired
    private CanvasDAO canvasDAO;

    @Autowired
    private AESUtil aesUtil;


    @Override
    public LoginResponse verifyDoctor(LoginDTO credentials) {
        String email = aesUtil.decrypt(credentials.getEmail());
        String enteredPassword = aesUtil.decrypt(credentials.getPassword());

        Doctor doc = doctorDAO.findByEmail(email);
        if (doc != null && doc.getActive()) {
            if( doc.isPasswordMatch(enteredPassword))
            {
                String token = tokenDAO.findByUsername(email);
                if (token != null) {
                    return new LoginResponse("Already logged in", false, null);
                }
                doc.setAvailability(true);
                doctorDAO.save(doc);
                String jwttoken= jwtTokenProvider.generateToken(doc);
                return new LoginResponse("Login Successful",true,jwttoken);
            } else {
                return new LoginResponse("Password not matched", null, null);
            }
        }
        else{
            return new LoginResponse("Invalid User.", null, null);
        }
    }

    @Transactional
    public Doctor changePassword(LoginDTO credentials){
        Doctor newDoc = doctorDAO.findByEmail(credentials.getEmail());
        if (newDoc.getActive().equals(true)){
            newDoc.setPassword(credentials.getPassword());
        }
        return doctorDAO.save(newDoc);
    }
    public void logoutService(String email) {
        tokenDAO.deletetoken(email);
    }


    @Override
    public Doctor findByEmail(String email){
        return doctorDAO.findByEmail(email);
    }

    @Override
    public List<Patient> getPatients(String email){
        return patientDAO.getPatientsByDoctor(email);
    }


    @Override
    public List<Patient> getEmergencyPatients(String email){
        return patientDAO.getEmergencyPatients(email);
    }

    public Patient getPatientDetails(String pid,String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)){
            return patientDAO.findPatientDetailsById(pid);
        }
        else {
            return null;
        }
    }


    public Vitals getVitals(String pid,String consenttoken){
        if(consentService.verifyConsent(pid,consenttoken)){
        return vitalsDAO.getVitalsByPatient(pid);}
        else{
            return null;
        }
    }

    public Symptoms getSymptoms(String pid,String consenttoken){
        if(consentService.verifyConsent(pid,consenttoken)){
        return symptomsDAO.getSymptomsByPatient(pid);}
        else{
            return null;
        }
    }

    public List<SymptomImages> getSymptomImages(String pid,String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)){
        return symptomImagesDAO.getSymptomImagesByPatient(pid);}
        else{
            return null;
        }
    }

    public List<PastHistory> getPastHistory(String pid,String consenttoken){
        if(consentService.verifyConsent(pid,consenttoken)) {
            return pastHistoryDAO.getPastHistoriesByPatient(pid);
        }
        else{
            return null;
        }
    }

    public List<PastImages> getPastImages(Integer phid,String pid,String consenttoken){
        if(consentService.verifyConsent(pid,consenttoken)) {
            return pastImagesDAO.getPastImagesByPastHistory(phid);
        }
        else{
            return null;
        }

    }

    public List<Medication> getPastMedications(String pid,String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)) {
       return medicationDAO.getPastMedicationsByPatient(pid);}
        else{
            return null;
        }
    }


    public List<Test> getPastTests(String pid,String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)) {
            return testDAO.getPastTestsByPatient(pid);}
        else{
            return null;
        }
    }



    public Progress saveProgress(String pid,Progress progress){
        progress.setPatient(patientDAO.findPatientDetailsById(pid));
        progress.setTime(Time.valueOf(LocalTime.now()));
        progress.setDate(LocalDate.now());
        return progressDAO.save(progress);
    }

    public List<Progress> getProgressHistory(String pid,String consenttoken){

        if(consentService.verifyConsent(pid,consenttoken))
        {return progressDAO.findByPatient(pid);}
        else{
            return null;
        }
    }

    public List<Medication> getMedications(String pid,String consenttoken,String email){
        if(consentService.verifyConsent(pid,consenttoken)) {
            return medicationDAO.getMedicationByDoctor(pid,email);
        }
        else{
            return null;
        }
    }

    public Medication getMedicationById(String pid,Integer mid){

       return medicationDAO.findMedicationByMedicineId(pid,mid);
    }

    public Medication saveMedication(String pid,Medication med,String email){
        med.setPastMedication(false);
        med.setPrescribedOn(LocalDate.now());
        med.setServed(false);
        med.setVisit(visitDAO.getRecentVisitByDoctor(pid,email));
        return medicationDAO.save(med);
    }

    public Medication editMedication(String pid,Integer mid,Medication med){
        Medication newMed = medicationDAO.findMedicationByMedicineId(pid,mid);
        newMed.setMedicineName(med.getMedicineName());
        newMed.setDosage(med.getDosage());
        newMed.setFrequency(med.getFrequency());
        newMed.setDuration(med.getDuration());
        newMed.setSpecialInstructions(med.getSpecialInstructions());
        newMed.setPrescribedOn(LocalDate.now());
        return medicationDAO.save(newMed);
    }

    public void deleteMedication(String pid,Integer mid){
        Medication medication=medicationDAO.findMedicationByMedicineId(pid,mid);
        medicationDAO.delete(medication);
    }

    public List<Test> getTests(String pid,String consenttoken,String email){
        if(consentService.verifyConsent(pid,consenttoken)) {
       return testDAO.findTestByDoctor(pid,email);}
        else{
            return null;
        }

    }

    public Test getTestById(String pid,Integer tid){
        return testDAO.findTestByTestId(pid,tid);
    }

    public Test saveTest(String pid,Test test,String email){
        test.setPastTest(false);
        test.setPrescribedOn(LocalDate.now());
        test.setVisit(visitDAO.getRecentVisitByDoctor(pid,email));
        return testDAO.save(test);
    }

    public Test editTest(String pid,Integer tid,Test test){
        Test newTest = testDAO.findTestByTestId(pid,tid);
        newTest.setTestName(test.getTestName());
        newTest.setPrescribedOn(LocalDate.now());
        return testDAO.save(newTest);
    }

    public void deleteTest(String pid,Integer mid){
        Test test=testDAO.findTestByTestId(pid,mid);
        testDAO.delete(test);
    }

    public List<TestImages> getTestImages(Integer tid,String pid,String consenttoken){
        if(consentService.verifyConsent(pid,consenttoken)) {
            return testImagesDAO.findTestById(tid);}
        else {return null;}
    }


    public String addDisease(String pid,String disease,String email) {
        Visit newVisit = visitDAO.getRecentVisitByDoctor(pid,email);
        newVisit.setDisease(disease);
        visitDAO.save(newVisit);
        return newVisit.getDisease();
    }

    public Patient recommendIP(String pid,String did,String email){
        Patient newPatient = patientDAO.findPatientDetailsById(pid);
        newPatient.setDepartment("IP");
        Visit newVisit=visitDAO.getRecentVisitByDoctor(pid,email);
        Doctor doctor = doctorDAO.findByDoctorId(did);
        newVisit.setDoctor(doctor);
        newVisit.setSpecialization(doctor.getSpecialization().getSpecializationName());
        visitDAO.save(newVisit);
//        List<Visit> visits = visitDAO.getVisitsByOPDoctors(pid);
//        for(Visit visit:visits){
//            visit.setDoctor(doctor);
//            visit.setSpecialization(doctor.getSpecialization().getSpecializationName());
//            visitDAO.save(visit);
//        }
//        visitDAO.deleteAll(visits);
        Bed newBed= bedDAO.getFirstFreeBed();
        newBed.setPatient(newPatient);
        newPatient.setBed(newBed);
        bedDAO.save(newBed);
        return patientDAO.save(newPatient);
    }

    public Patient dischargePatient(String pid,String email){
        Patient newPatient = patientDAO.findPatientDetailsById(pid);
        List<Medication> medications=medicationDAO.getMedicationByDoctor(pid,email);
        Canvas canvas = canvasDAO.findCanvasByDoctor(pid,email);
        List<Test> tests=testDAO.findTestByDoctor(pid,email);
        for(Medication medication : medications){
            medication.setPastMedication(true);
            medicationDAO.save(medication);
        }
        if(canvas!=null){
            canvas.setPastCanvas(true);
            canvasDAO.save(canvas);
        }
        for(Test test : tests){
            test.setPastTest(true);
            testDAO.save(test);
        }
        if (newPatient.getDepartment().equals("IP")) {
            Bed newBed = newPatient.getBed();
            newBed.setPatient(null);
            bedDAO.save(newBed);
        }
        Visit recentVisit = visitDAO.getRecentVisitByDoctor(pid,email);
        recentVisit.setDischargedDate(LocalDate.now());
        visitDAO.save(recentVisit);
        return patientDAO.save(newPatient);
    }

    public Long admittedPatientCount(String email){
        return patientDAO.getAdmittedCount(email);
    }

    public Long treatedPatientCount(String email){
        return patientDAO.getTreatedCount(email);
    }

    @Override
    public List<String> getSpecializations() {
        return specializationDAO.findSpecializationByIP();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization){
        return doctorDAO.getIPDoctorsBySpecialization(specialization);
    }

    public Doctor exitDoctor(String email){
        Doctor newDoc = doctorDAO.findByEmail(email);
        newDoc.setAvailability(false);
        return doctorDAO.save(newDoc);
    }

    @Override
    public Patient findPatient(String email, String pid,String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)) {
            Patient patient = visitDAO.getPatient(email,pid);
            if (patient != null) {
                System.out.println("Patient Details:");
                System.out.println("ID: " + patient.getId());
                System.out.println("Name: " + patient.getPatientName());}
            return patient;}
        else {return null;}
    }

    @Override
    public String getDisease(String pid,String consenttoken,String email) {
        return visitDAO.getRecentVisitByDoctor(pid,email).getDisease();
    }


    @Override
    public String findID(String bid)
    {
        String pid = bedDAO.findPatientID(bid);
        return pid;
    }
    @Override
    public String getConsentToken(String pid) {
        return consentDAO.getConsentTokenByPatient(pid);
    }

    @Override
    public Visit checkPatient(String pid,String email) {
        Visit newVisit = visitDAO.getRecentVisitByDoctor(pid,email);
        newVisit.setChecked(true);
        return visitDAO.save(newVisit);
    }

    @Override
    public Boolean getChecked(String pid, String email) {
        Visit recentVisit = visitDAO.getRecentVisitByDoctor(pid,email);
        return recentVisit.getChecked();
    }

    @Override
    public Canvas saveCanvas(String pid, Canvas canvas, String email) {
        canvas.setPastCanvas(false);
        canvas.setServed(false);
        canvas.setPrescribedOn(LocalDate.now());
        canvas.setVisit(visitDAO.getRecentVisitByDoctor(pid,email));
        return canvasDAO.save(canvas);
    }

    @Override
    public Canvas editCanvas(String pid, Canvas canvas, String email) {
        Canvas newCanvas = canvasDAO.findCanvasByDoctor(pid,email);
        newCanvas.setPrescribedOn(LocalDate.now());
        newCanvas.setImage(canvas.getImage());
        return canvasDAO.save(newCanvas);
    }

    @Transactional
    public void deleteCanvas(String pid, String email) {
        Canvas canvas = canvasDAO.findCanvasByDoctor(pid,email);
        canvasDAO.deleteCanvasByCanvasId(canvas.getCanvasId());
    }

    @Override
    public Canvas getCanvas(String pid, String consenttoken, String email) {
        if(consentService.verifyConsent(pid,consenttoken)) {
            Canvas canvas =  canvasDAO.findCanvasByDoctor(pid,email);
            Canvas emptyCanvas = new Canvas();
            return Objects.requireNonNullElse(canvas, emptyCanvas);
        }
        else{
            return null;
        }
    }

    @Override
    public List<Canvas> getPastCanvas(String pid, String consenttoken) {
        if(consentService.verifyConsent(pid,consenttoken)) {
            return canvasDAO.getPastCanvasByPatient(pid);
        }
        else{
            return null;
        }
    }

    @Override
    public String editDisease(String pid, String disease, String email) {
        Visit newVisit = visitDAO.getRecentVisitByDoctor(pid,email);
        newVisit.setDisease(disease);
        visitDAO.save(newVisit);
        return newVisit.getDisease();
    }

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
        return doctorDAO.getContactFromEmail(email);
    }
}
