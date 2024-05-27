package com.had.his.DAO;

import com.had.his.Entity.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface NurseDAO extends JpaRepository<Nurse,Long> {

    Nurse findByEmail(String email);

    @Query("select n from Nurse n where n.email=?1")
    Nurse findDetailsByEmail(String email);

    @Modifying
    @Query("update Nurse n set n.devicetoken=?1 where n.email=?2")
    void updatetoken(String devicetoken,String email);

    Nurse findByNurseId(String nurseId);

    @Query("select n from Nurse n where n.nurseId=?1")
    Nurse findDetailsById(String nurseId);

    @Query("select n from Nurse n  where n.active=true")
    List<Nurse> getNurseByActive();

    @Query("select count(n) from Nurse n where n.active=true")
    Integer countNurseByActive();

    @Query("select n.contact from Nurse n where n.email=?1")
    String getContactFromEmail(String email);

}
