package com.had.his.DAO;

import com.had.his.Entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface DoctorDAO extends JpaRepository<Doctor,Long> {

     @Query("select d from Doctor d where d.email=?1")
     Doctor findByEmail(String email);

     Doctor findByDoctorId(String did);

     @Query("select d from Doctor d where d.department=?1 and d.active=true")
     List<Doctor> getDoctorByDepartmentAndActive(String department);

     @Query("select d from Doctor d where d.availability=true and d.active=true and d.department = 'IP' and d.specialization.specializationName=?1")
     List<Doctor> getIPDoctorsBySpecialization(String specialization);

     @Query("select d from Doctor d where d.department = 'IP'")
     List<Doctor> findIndoorDoctorDetails();

     @Query("select d from Doctor d where d.department = 'OP'")
     List<Doctor> findOutdoorDoctorDetails();

     @Query("select d from Doctor d where d.availability=true and d.active=true and d.department = 'OP' and d.specialization.specializationName=?1")
     List<Doctor> getOutdoorDoctorsBySpecialization(String specialization);

//     @Query("SELECT d.specialization.specializationName, " +
//             "SUM(CASE WHEN d.department = 'OP' THEN 1 ELSE 0 END), " +
//             "SUM(CASE WHEN d.department = 'IP' THEN 1 ELSE 0 END) " +
//             "FROM Doctor d " +
//             "WHERE d.active = true AND d.availability = true " +
//             "GROUP BY d.specialization.specializationName")
//     List<Object[]> countDoctorsBySpecialization();

     @Query("SELECT s.specializationName, " +
             "COALESCE(SUM(CASE WHEN d.department = 'OP' THEN 1 ELSE 0 END), 0), " +
             "COALESCE(SUM(CASE WHEN d.department = 'IP' THEN 1 ELSE 0 END), 0) " +
             "FROM Specialization s " +
             "LEFT JOIN Doctor d ON s.specializationName = d.specialization.specializationName " +
             "AND d.active = true AND d.availability = true " +
             "GROUP BY s.specializationName")
     List<Object[]> countDoctorsBySpecialization();

     @Query("select count(d) from Doctor d where d.active=true ")
     Integer countDoctorsByActive();

     @Query("select d.contact from Doctor d where d.email=?1")
     String getContactFromEmail(String email);

}
