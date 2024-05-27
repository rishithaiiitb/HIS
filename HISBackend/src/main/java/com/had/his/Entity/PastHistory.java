package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "past_history")
public class PastHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;


    @NotEmpty(message = "Please mention the disease name")
    @Size(min=1,max=30,message = "Invalid disease name")
    @Column(name = "disease", nullable = false)
    private String disease;

    @NotEmpty(message = "Please mention the medicine")
    @Size(min=2,max=30,message = "Invalid medicine name")
    @Column(name = "medicine", nullable = false, columnDefinition = "TEXT")
    private String medicine;

    @NotEmpty(message = "Please mention dosage")
    @Size(min=2,max=30,message = "Invalid dosage")
    @Column(name = "dosage", nullable = false, columnDefinition = "TEXT")
    private String dosage;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;


    @NotNull(message = "Prescription date must be provided")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "recorded_at", nullable = false)
    private LocalDate recordedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "pastHistory",cascade = CascadeType.ALL)
    private List<PastImages> pastImages;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pid",referencedColumnName = "patient_id",nullable = false)
    private Patient patient;

    public PastHistory() {

    }

    public PastHistory(Long historyId, String disease, String medicine, String dosage, String remarks, List<PastImages> pastImages, Patient patient, LocalDate recordedAt) {
        this.historyId = historyId;
        this.disease = disease;
        this.medicine = medicine;
        this.dosage = dosage;
        this.remarks = remarks;
        this.pastImages = pastImages;
        this.patient = patient;
        this.recordedAt = recordedAt;
    }

    public Long getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Long historyId) {
        this.historyId = historyId;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getMedicine() {
        return medicine;
    }

    public void setMedicine(String medicine) {
        this.medicine = medicine;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }


    public List<PastImages> getPastImages() {
        return pastImages;
    }

    public void setPastImages(List<PastImages> pastImages) {
        this.pastImages = pastImages;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public LocalDate getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDate recordedAt) {
        this.recordedAt = recordedAt;
    }

    @Override
    public String toString() {
        return "PastHistory{" +
                "historyId=" + historyId +
                ", disease='" + disease + '\'' +
                ", medicine='" + medicine + '\'' +
                ", dosage='" + dosage + '\'' +
                ", remarks='" + remarks + '\'' +
                ", recordedAt=" + recordedAt +
                ", pastImages=" + pastImages +
                ", patient=" + patient +
                '}';
    }
}
