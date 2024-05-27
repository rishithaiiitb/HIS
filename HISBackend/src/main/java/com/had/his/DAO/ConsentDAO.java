package com.had.his.DAO;

import com.had.his.Entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ConsentDAO extends JpaRepository<Consent,Integer> {

    @Query("select co from Consent co where co.patient.patientId=?1")
    Consent getConsentByPatient(String pid);

    @Query("select co.token from Consent co where co.patient.patientId=?1")
    String getConsentTokenByPatient(String pid);

    @Query("select c from Consent c where c.takenOn=?1 and c.expired=false ")
    List<Consent> findByConsentTakenOnBeforeAndIsExpiredIsFalse(LocalDate date);
}
