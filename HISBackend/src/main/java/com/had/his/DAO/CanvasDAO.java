package com.had.his.DAO;

import com.had.his.Entity.Canvas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CanvasDAO extends JpaRepository<Canvas,Long> {

    @Query("select ca from Canvas ca,Visit v where ca.visit.visitId=v.visitId and  v.patient.patientId=?1 and v.doctor.email=?2")
    Canvas findCanvasByDoctor(String pid,String email);

    @Query("select ca from Canvas ca,Visit v where ca.visit.visitId=v.visitId and v.dischargedDate is not null and ca.pastCanvas=true and v.patient.patientId=?1")
    List<Canvas> getPastCanvasByPatient(String pid);

    @Query("select ca from Canvas ca,Visit v where ca.visit.visitId=v.visitId and v.dischargedDate is null and ca.pastCanvas=false and v.patient.patientId=?1")
    List<Canvas> getCanvasByPatient(String pid);

    @Query("select ca from Canvas ca,Visit v where ca.visit.visitId=v.visitId and v.patient.patientId=?1")
    List<Canvas> getAllCanvasByPatient(String pid);

    @Query("select ca from Canvas ca where ca.visit.visitId=?1")
    Canvas findByVisitId(Long visitId);

    @Modifying
    @Query("delete from Canvas  ca where ca.canvasId=?1")
    void deleteCanvasByCanvasId(Long canvasId);
}
