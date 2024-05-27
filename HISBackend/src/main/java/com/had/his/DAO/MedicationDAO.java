package com.had.his.DAO;

import com.had.his.Entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicationDAO extends JpaRepository<Medication,Long> {

    @Query("select m from Medication m,Visit v where m.visit.visitId=v.visitId and v.dischargedDate is null and m.pastMedication=false and v.patient.patientId=?1 and v.doctor.email=?2")
    List<Medication> getMedicationByDoctor(String pid,String email);

    @Query("select m from Medication m,Visit v where m.visit.visitId=v.visitId and v.dischargedDate is null and m.pastMedication=false and v.patient.patientId=?1 and m.medicineId=?2")
    Medication findMedicationByMedicineId(String pid,Integer mid);

    @Query("select m from Medication m,Visit v where m.visit.visitId=v.visitId and v.dischargedDate is not null and m.pastMedication=true and v.patient.patientId=?1")
    List<Medication> getPastMedicationsByPatient(String pid);

    @Query("select m from Medication m where m.visit.visitId=?1")
    List<Medication> findMedication(Long visitId);

    @Query("SELECT COUNT(DISTINCT m.medicineName) FROM Medication m where m.served=true")
    int countUniqueMedicinesServed();

    @Query("SELECT COUNT(DISTINCT m.visit) FROM Medication m where m.served=true")
    int countUniquePatientsServed();

    @Query("select m from Medication m,Visit v where m.visit.visitId=v.visitId and v.patient.patientId=?1")
    List<Medication> getAllMedicationByPatient(String pid);

    @Query("select m from Medication m,Visit v where m.visit.visitId=v.visitId and v.dischargedDate is null and m.pastMedication=false and v.patient.patientId=?1")
    List<Medication> getMedicationsByPatient(String pid);

}
