package com.had.his.DAO;

import com.had.his.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageDAO extends JpaRepository<Message,Long> {
    List<Message> findByDoctorEmail(String doctorEmail);
}
