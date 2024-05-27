package com.had.his.DAO;

import com.had.his.Entity.Medication;
import com.had.his.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TestDAO extends JpaRepository<Test,Integer> {

    @Query("select t from Test t,Visit v where t.visit.visitId=v.visitId and v.patient.patientId=?1 and v.dischargedDate is null and t.pastTest=false and t.result is not null")
    List<Test> getTestByPatient(String pid);

    @Query("select t from Test t,Visit v where t.visit.visitId=v.visitId and v.patient.patientId=?1 and t.id=?2")
    Test findTestByTestId(String pid,Integer tid);

    @Query("select t from Test t,Visit v where t.visit.visitId=v.visitId and v.dischargedDate is null and t.pastTest=false and v.patient.patientId=?1 and v.doctor.email=?2")
    List<Test> findTestByDoctor(String patientId,String email);

    @Query("select t from Test t,Visit v where t.visit.visitId=v.visitId and v.patient.patientId=?1 and v.dischargedDate is null and t.pastTest=false and t.result is null")
    List<Test> findNamesByPatientId(String patientId);

    @Modifying
    @Query("update Test t set t.result=NULL where t.id=?1")
    void deleteTestResultById(Integer id);

    @Query("select t from Test t,Visit v where t.visit.visitId=v.visitId and v.dischargedDate is not null and t.pastTest=true and v.patient.patientId=?1")
    List<Test> getPastTestsByPatient(String pid);

    @Query("select t from Test t,Visit v where t.visit.visitId=v.visitId and v.patient.patientId=?1")
    List<Test> getAllTestsByPatientId(String pid);

}
