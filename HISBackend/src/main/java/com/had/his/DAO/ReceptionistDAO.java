package com.had.his.DAO;

import com.had.his.Entity.Nurse;
import com.had.his.Entity.Receptionist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReceptionistDAO extends JpaRepository<Receptionist,String> {

    @Query("select r from Receptionist r where r.email=?1")
    Receptionist findByEmail(String email);

    Receptionist findByReceptionistId(String recepId);

    @Query("select recep from Receptionist recep where recep.receptionistId=?1")
    Receptionist findReceptionistByReceptionistId(String rid);

    @Query("select r from Receptionist r where r.active=true")
    List<Receptionist> getReceptionistByActive();

    @Query("select count(r) from Receptionist r where r.active=true")
    Integer countReceptionistByActive();

    @Query("select r.contact from Receptionist r where r.email=?1")
    String getContactFromEmail(String email);
}