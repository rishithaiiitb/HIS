package com.had.his.DAO;

import com.had.his.Entity.Patient;
import com.had.his.Entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface VisitDAO extends JpaRepository<Visit,Integer> {

    @Query("select v from Visit v,Patient p where v.patient=p and v.patient.patientId=?1 and v.dischargedDate is null order by v.admittedDate desc limit 1")
    Visit getRecentVisit(String pid);

    @Query("select v from Visit v,Patient p where v.patient=p and p.patientId=?1 and v.doctor.email=?2 and v.dischargedDate is null order by v.admittedDate desc limit 1")
    Visit getRecentVisitByDoctor(String pid,String email);

    @Query("select v.patient from Visit v where v.doctor.email=?1 and v.patient.patientId=?2 and v.dischargedDate is null")
    Patient getPatient(String email, String pid);

    @Query("select v from Visit v,Patient p where v.patient=p and v.patient.patientId=?1 and v.dischargedDate is null")
    List<Visit> getVisits(String pid);

    @Query("select v from Visit v,Patient p,Doctor d where v.patient=p and v.doctor=d and d.department='OP' and v.dischargedDate is null and p.patientId=?1")
    List<Visit> getVisitsByOPDoctors(String pid);

    @Query("select v.doctor.doctorId from Visit v where v.dischargedDate is  null and v.patient.patientId=?1 ")
    List<String> getAllAppointmentsByPatient(String pid);

    @Query("SELECT a FROM Visit a WHERE a.admittedDate < :date")
    List<Visit> findByAdmittedDateBefore(LocalDate date);

    @Query("select v.doctor.doctorId from Visit v where v.patient.patientId=?1 and v.doctor.department='IP' and v.dischargedDate is null")
    String findDoctorOfActivePatient(String patientId);

    @Query("select v.doctor.email from Visit v,Test t where t.visit.visitId=v.visitId and v.patient.patientId=?1 and t.id= ?2 and v.dischargedDate is null")
    String getDoctorEmailOfPatient(String patientId,String tid);
}
