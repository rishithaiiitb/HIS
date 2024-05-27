package com.had.his.DAO;

import com.had.his.Entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface
PharmacyDAO extends JpaRepository<Pharmacy,Long> {

    Pharmacy findByEmail(String email);

    @Query("SELECT ph FROM Pharmacy ph WHERE ph.pharmacyId= ?1")
    Pharmacy findPharmacyByPharmacyId(String pharmacyId);

    @Query("select ph from Pharmacy ph where ph.active=true")
    List<Pharmacy> getPharmaciesByActive();

    @Query("select count(ph) from Pharmacy ph where ph.active=true")
    Integer getPharmaciesByActiveCount();

    @Query("select ph.contact from Pharmacy ph where ph.email=?1")
    String getContactFromEmail(String email);


}
