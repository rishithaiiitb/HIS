package com.had.his.DAO;

import com.had.his.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PatientDAO extends JpaRepository<Patient,Long> {

    @Query("select p from Patient p where p.patientId=?1")
    Patient findPatientDetailsById(String patientId);

    @Query("select p from Patient p,Visit v,Consent c where v.patient.patientId=p.patientId and c.patient=p and c.expired=false and v.dischargedDate is null and v.emergency=false and p.vitals is not null and p.symptoms is not null and v.doctor.email=?1 order by v.admittedDate asc,v.admittedTime asc")
    List<Patient> getPatientsByDoctor(String email);

    @Query("select p from Patient p,Visit v,Consent c where v.patient.patientId=p.patientId and c.patient=p and c.expired=false and v.dischargedDate is null and v.emergency=true and p.vitals is not null and p.symptoms is not null and v.doctor.email=?1 order by v.admittedDate asc,v.admittedTime asc")
    List<Patient> getEmergencyPatients(String email);

    @Query("select p from Patient p,Visit v,Consent c where v.patient.patientId=p.patientId and c.patient=p and c.expired=false and v.dischargedDate is null and v.emergency=true order by v.admittedTime asc")
    List<Patient> findAllEmergencyPatients();


    @Query("select p from Patient p,Visit v,Consent c where v.patient.patientId=p.patientId and c.patient=p and c.expired=false and v.dischargedDate is null and v.emergency=false order by v.admittedTime asc")
    List<Patient> findAllPatients();

    @Query("select count(v) from Visit v where v.dischargedDate is null and v.doctor.email=?1")
    Long getAdmittedCount(String email);

    @Query("select count(v) from Visit v where v.dischargedDate is not null and v.doctor.email=?1")
    Long getTreatedCount(String email);

    @Query("SELECT p FROM Patient p WHERE p.department = 'IP'")
    List<Patient> findIndoorPatientDetails();

    @Query("SELECT p FROM Patient p WHERE p.department = 'OP'")
    List<Patient> findOutdoorPatientDetails();

}
