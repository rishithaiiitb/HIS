package com.had.his.DAO;

import com.had.his.Entity.SymptomImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SymptomImagesDAO extends JpaRepository<SymptomImages,Integer> {

    @Query("select si from SymptomImages si where si.patient.patientId=?1")
    List<SymptomImages> getSymptomImagesByPatient(String pid);

    @Query("select si from SymptomImages si where si.patient.patientId=?1 and si.id=?2")
    SymptomImages getSymptomImagesById(String pid,Integer id);


    @Modifying
    @Query("delete from SymptomImages  s where s.id=?1")
    void deleteBySymptomImageId(Integer id);
}
