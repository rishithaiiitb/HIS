package com.had.his.Entity;


import jakarta.persistence.*;
import org.springframework.stereotype.Component;

@Entity
@Component
@Table(name = "message", uniqueConstraints = {@UniqueConstraint(columnNames = {"messageId", "DoctorEmail", "PatientId", "body"})})
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="messageId")
    private Long messageId;

    @Column(name="DoctorEmail")
    private String doctorEmail;

    @Column(name="PatientId")
    private String patientId;
    @Column(name="body")
    private String body;


    public Message(Long messageId, String doctorEmail, String patientId, String body) {
        this.messageId = messageId;
        this.doctorEmail = doctorEmail;
        this.patientId = patientId;
        this.body = body;
    }

    public Message() {
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public String getDoctorEmail() {
        return doctorEmail;
    }

    public void setDoctorEmail(String doctorEmail) {
        this.doctorEmail = doctorEmail;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "Message{" +
                "messageId=" + messageId +
                ", doctorEmail='" + doctorEmail + '\'' +
                ", patientId='" + patientId + '\'' +
                ", body='" + body + '\'' +
                '}';
    }
}
