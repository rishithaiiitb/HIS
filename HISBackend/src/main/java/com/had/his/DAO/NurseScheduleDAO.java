package com.had.his.DAO;

import com.had.his.Entity.NurseSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface NurseScheduleDAO extends JpaRepository<NurseSchedule,Integer> {

    @Query("select n from NurseSchedule n where n.nurse.nurseId=?1")
    List<NurseSchedule> getNurseScheduleById(String nurseId);

    @Query("SELECT ns FROM NurseSchedule ns WHERE ns.day=?1 AND  ns.start_time <= ?2 AND ns.end_time >= ?2")
    List<NurseSchedule> findActiveSchedules(DayOfWeek day, LocalTime time);
}

