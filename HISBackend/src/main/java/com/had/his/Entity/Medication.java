package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;


import java.time.LocalDate;

@Entity
@Table(name = "medications")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="medicne_id")
    private Long medicineId;

    @NotEmpty(message = "Medicine name cannot be blank")
    @Size(min=2,message = "Medicine name should contain at least 2 characters")
    @Column(name = "medicine_name", nullable = false)
    private String medicineName;


    @Column(name = "prescribed_on", nullable = false)
    private LocalDate prescribedOn;

    @NotEmpty(message = "Mention the dosage")
    @Column(name = "dosage",nullable = false)
    private String dosage;

    @NotEmpty(message = "Mention the fequency to take medicine")
    @Column(name = "frequency",nullable = false)
    private String frequency;

    @NotEmpty(message = "Mention the duration")
    @Column(name = "duration",nullable = false)
    private String duration;

    @Column(name = "special_instructions",columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "past_medication",nullable = false)
    private Boolean pastMedication;

    @Column(name = "served",nullable = false)
    private Boolean served;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "medications"})
    @ManyToOne
    @JoinColumn(name = "vid", nullable = false)
    private Visit visit;


    public Medication(Long medicineId, String medicineName, LocalDate prescribedOn, String dosage, String frequency, String duration, String specialInstructions, Boolean pastMedication, Boolean served, Visit visit) {
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.prescribedOn = prescribedOn;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.specialInstructions = specialInstructions;
        this.pastMedication = pastMedication;
        this.served = served;
        this.visit = visit;
    }

    public Medication() {

    }


    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public LocalDate getPrescribedOn() {
        return prescribedOn;
    }

    public void setPrescribedOn(LocalDate prescribedOn) {
        this.prescribedOn = prescribedOn;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public Boolean getServed() {
        return served;
    }

    public void setServed(Boolean served) {
        this.served = served;
    }

    public Boolean getPastMedication() {
        return pastMedication;
    }

    public void setPastMedication(Boolean pastMedication) {
        this.pastMedication = pastMedication;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public Visit getVisit() {
        return visit;
    }

    public void setVisit(Visit visit) {
        this.visit = visit;
    }


    @Override
    public String toString() {
        return "Medication{" +
                "medicineId=" + medicineId +
                ", medicineName='" + medicineName + '\'' +
                ", prescribedOn=" + prescribedOn +
                ", dosage='" + dosage + '\'' +
                ", frequency='" + frequency + '\'' +
                ", duration='" + duration + '\'' +
                ", specialInstructions='" + specialInstructions + '\'' +
                ", pastMedication=" + pastMedication +
                ", served=" + served +
                ", visit=" + visit +
                '}';
    }
}
