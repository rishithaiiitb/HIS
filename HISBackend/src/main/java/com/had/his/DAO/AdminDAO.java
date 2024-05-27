package com.had.his.DAO;

import com.had.his.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminDAO extends JpaRepository<Admin,String> {
    @Query("select a from Admin a where a.email=?1")
    Admin findAdminByEmail(String email);

}