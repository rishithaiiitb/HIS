package com.had.his.DAO;

import com.had.his.Entity.Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface VitalsDAO extends JpaRepository<Vitals,Long> {

    @Query("select v from Vitals v where v.patient.patientId= ?1")
    Vitals getVitalsByPatient(String pid);


    @Query("select v from Vitals v where v.patient.patientId= ?1 and v.vitalid=?2")
    Vitals getVitalsById(String pid,Long vid);

    @Modifying
    @Query("delete from Vitals v where v.vitalid=?1")
    void deleteByVitalId(Long vitalid);

    @Modifying
    @Query("delete from Vitals v where v.patient.patientId=?1")
    void deleteVitalsByPatient(String pid);
}
