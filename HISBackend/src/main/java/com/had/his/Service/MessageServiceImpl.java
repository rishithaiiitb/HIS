package com.had.his.Service;

import com.had.his.DAO.MessageDAO;
import com.had.his.Entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageDAO messageDAO;

    public List<Message> findMessagesByDoctorEmail(String doctorEmail) {
        return messageDAO.findByDoctorEmail(doctorEmail);
    }
}
