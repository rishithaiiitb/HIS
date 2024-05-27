package com.had.his.Service;

import com.had.his.Entity.Message;

import java.util.List;

public interface MessageService {
    List<Message> findMessagesByDoctorEmail(String DoctorEmail);
}
