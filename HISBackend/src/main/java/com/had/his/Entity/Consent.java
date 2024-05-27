package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

@Table(name="consent")
@Entity
public class Consent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="consent_id")
    private Long cId;

    @Column(name = "consent_token")
    private String token;

    private Boolean expired;

    @NotEmpty(message = "Receptionist Email must be provided")
    @NotNull(message = "Receptionist Email must be provided")
    @Column(name = "consent_taken_by",nullable = false)
    private String takenBy;

    @Column(name = "consent_taken_on",nullable = false)
    private LocalDate takenOn;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "pid" ,referencedColumnName = "patient_id",nullable = false)
    private Patient patient;

    public void generateNewToken() {
        this.token = generateRandomToken();
    }

    private String generateRandomToken() {
        return UUID.randomUUID().toString();
    }

    public Consent() {
        this.takenOn = LocalDate.now();
    }

    public Consent(Long cId, String token, Boolean expired, String takenBy, LocalDate takenOn, Patient patient) {
        this.cId = cId;
        this.token = token;
        this.expired = expired;
        this.takenBy = takenBy;
        this.takenOn = takenOn;
        this.patient = patient;
    }

    public Long getcId() {
        return cId;
    }

    public void setcId(Long cId) {
        this.cId = cId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getExpired() {
        return expired;
    }

    public void setExpired(Boolean expired) {
        this.expired = expired;
    }


    public String getTakenBy() {
        return takenBy;
    }

    public void setTakenBy(String takenBy) {
        this.takenBy = takenBy;
    }

    public LocalDate getTakenOn() {
        return takenOn;
    }

    public void setTakenOn(LocalDate takenOn) {
        this.takenOn = takenOn;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @Override
    public String toString() {
        return "Consent{" +
                "cId=" + cId +
                ", token='" + token + '\'' +
                ", expired=" + expired +
                ", takenBy='" + takenBy + '\'' +
                ", takenOn=" + takenOn +
                ", patient=" + patient +
                '}';
    }
}
