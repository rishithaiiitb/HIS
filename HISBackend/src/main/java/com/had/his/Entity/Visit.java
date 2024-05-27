package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name="visits",uniqueConstraints = {@UniqueConstraint(columnNames = {"doctor", "patient", "discharged_date"})})
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="visit_id")
    private Long visitId;

    @Column(name="admitted_date",nullable = false)
    private LocalDate admittedDate;

    @Column(name="admitted_time",nullable = false)
    private LocalTime admittedTime;

    @Column(name="discharge_date")
    private LocalDate dischargedDate;

    @Column(name = "emergency", nullable = false)
    private Boolean emergency;

    @Column(name = "specialization", nullable = false)
    private String specialization;

    @Column(name="disease")
    private String disease;

    @Column(name = "checked", nullable = false)
    private Boolean checked;

    @ManyToOne
    @JoinColumn(name = "did", nullable = false,referencedColumnName = "doctor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "visits"})
    private Doctor doctor;

    @JsonIgnore
    @OneToMany(mappedBy = "visit",cascade = CascadeType.ALL)
    private List<Medication> medications;

    @JsonIgnore
    @OneToOne(mappedBy = "visit",cascade = CascadeType.ALL)
    private Canvas canvas;

    @JsonIgnore
    @OneToMany(mappedBy = "visit",cascade = CascadeType.ALL)
    private List<Test> tests;

    @ManyToOne
    @JoinColumn(name = "pid", nullable = false,referencedColumnName = "patient_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "visits"})
    private Patient patient;

    public Visit() {
    }

    public Visit(Long visitId, LocalDate admittedDate, LocalTime admittedTime, LocalDate dischargedDate, Boolean emergency, String specialization, String disease, String doctorId, String patientId, Boolean checked, Canvas canvas) {
        this.visitId = visitId;
        this.admittedDate = admittedDate;
        this.admittedTime = admittedTime;
        this.dischargedDate = dischargedDate;
        this.emergency = emergency;
        this.specialization = specialization;
        this.disease = disease;
        this.checked = checked;
        this.canvas = canvas;

        this.doctor = new Doctor();
        doctor.setDoctorId(doctorId);

        this.patient = new Patient();
        patient.setPatientId(patientId);
    }

    public Long getVisitId() {
        return visitId;
    }

    public void setVisitId(Long visitId) {
        this.visitId = visitId;
    }


    public LocalDate getAdmittedDate() {
        return admittedDate;
    }

    public void setAdmittedDate(LocalDate admittedDate) {
        this.admittedDate = admittedDate;
    }

    public LocalTime getAdmittedTime() {
        return admittedTime;
    }

    public void setAdmittedTime(LocalTime admittedTime) {
        this.admittedTime = admittedTime;
    }

    public LocalDate getDischargedDate() {
        return dischargedDate;
    }

    public void setDischargedDate(LocalDate dischargedDate) {
        this.dischargedDate = dischargedDate;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Boolean getEmergency() {
        return emergency;
    }

    public void setEmergency(Boolean emergency) {
        this.emergency = emergency;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    public Canvas getCanvas() {
        return canvas;
    }

    public void setCanvas(Canvas canvas) {
        this.canvas = canvas;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }

    public List<Test> getTests() {
        return tests;
    }

    public void setTests(List<Test> tests) {
        this.tests = tests;
    }

    @Override
    public String toString() {
        return "Visit{" +
                "visitId=" + visitId +
                ", admittedDate=" + admittedDate +
                ", admittedTime=" + admittedTime +
                ", dischargedDate=" + dischargedDate +
                ", emergency=" + emergency +
                ", specialization='" + specialization + '\'' +
                ", disease='" + disease + '\'' +
                ", checked=" + checked +
                ", doctor=" + doctor +
                ", medications=" + medications +
                ", canvas=" + canvas +
                ", tests=" + tests +
                ", patient=" + patient +
                '}';
    }
}
