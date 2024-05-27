package com.had.his.DAO;

import com.had.his.Entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HospitalDAO extends JpaRepository<Hospital,String> {

    @Query("SELECT h FROM Hospital h")
    Hospital getHospitalDetails();
}
