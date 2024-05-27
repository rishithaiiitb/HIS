package com.had.his.DAO;

import com.had.his.Entity.PastHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PastHistoryDAO extends JpaRepository<PastHistory,Long> {

    @Query("select ph from PastHistory ph where ph.patient.patientId=?1")
    List<PastHistory> getPastHistoriesByPatient(String pid);

    @Query("select ph from PastHistory ph where ph.patient.patientId=?1 and ph.historyId=?2")
    PastHistory getPastHistoriesById(String pid,Long historyId);

    @Modifying
    @Query("delete from PastHistory p where p.historyId=?1")
    void deleteByPastHistoryId(Long historyid);

}

