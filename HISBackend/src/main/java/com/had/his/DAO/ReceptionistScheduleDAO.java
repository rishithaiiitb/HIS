package com.had.his.DAO;

import com.had.his.Entity.ReceptionistSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface ReceptionistScheduleDAO extends JpaRepository<ReceptionistSchedule,Long> {

    @Query("select r from ReceptionistSchedule r where r.receptionist.receptionistId=?1")
    List<ReceptionistSchedule> getReceptionistScheduleById(String receptionistId);

    @Query("SELECT ns FROM ReceptionistSchedule ns WHERE ns.day=?1 AND  ns.startTime <= ?2 AND ns.endTime>= ?2")
    List<ReceptionistSchedule> findActiveSchedules(DayOfWeek day, LocalTime time);
}
