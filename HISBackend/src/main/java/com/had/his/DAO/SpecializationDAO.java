package com.had.his.DAO;

import com.had.his.Entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SpecializationDAO extends JpaRepository<Specialization,Long> {

    @Query("select distinct s.specializationName from Specialization s")
    List<String> findALLSpecializations();

    @Query("select distinct s.specializationName from Specialization s,Doctor d where d.specialization=s and d.department = 'IP'")
    List<String> findSpecializationByIP();

    @Query("select s from Specialization s where s.specializationName=?1")
    Specialization getSpecializationByName(String spec);

    @Query("SELECT s FROM Specialization s ORDER BY s.sId")
    List<Specialization> findAllSortedBySid();
}
