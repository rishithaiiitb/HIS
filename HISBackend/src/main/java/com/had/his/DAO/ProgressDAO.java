package com.had.his.DAO;

import com.had.his.Entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProgressDAO extends JpaRepository<Progress,Integer> {

    @Query("select pr from Progress pr where pr.patient.patientId=?1")
    List<Progress> findByPatient(String pid);
}
