package com.had.his.DAO;

import com.had.his.Entity.Symptoms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SymptomsDAO extends JpaRepository<Symptoms,Long> {
    @Query("select s from Symptoms s where s.patient.patientId= ?1")
    Symptoms getSymptomsByPatient(String pid);

    @Query("select s from Symptoms s where s.patient.patientId= ?1 and s.symptomid=?2")
    Symptoms getSymptomsById(String pid,Long symptomid);

    @Query("select s from Symptoms s where s.symptomid=?1")
    Symptoms findBySymptomsId(Long symptomid);

    @Modifying
    @Query("delete from Symptoms s where s.symptomid=?1")
    void deleteBySymptomId(Long symptomid);

    @Modifying
    @Query("delete from Symptoms s where s.patient.patientId=?1")
    void deleteSymptomsByPatient(String pid);
}
