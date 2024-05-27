package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.had.his.Encryption.StringCryptoConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;


import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "patient_seq")
    @SequenceGenerator(name = "patient_seq", sequenceName = "patient_sequence", allocationSize = 1)
    private Long Id;


    @Column(name="patient_id",unique = true,nullable = false)
    private String patientId;

    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "age", nullable = false)
    private String age;

    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "sex", nullable = false)
    private String sex;

    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "contact", nullable = false)
    private String contact;

    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "email")
    private String email;


    @Column(name = "department", nullable = false)
    private String department;

    @JsonIgnore
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL)
    private List<PastHistory> pastHistories;

    @JsonIgnore
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private Symptoms symptoms;

    @JsonIgnore
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private Vitals vitals;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "patient"})
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private Consent consent;

    @JsonIgnore
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL)
    private List<SymptomImages> symptomImages;

    @OneToOne(mappedBy = "patient")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "patient"})
    private Bed bed;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Progress> progress;

    @OneToMany(mappedBy = "patient", cascade= CascadeType.ALL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "patient"})
    private List<Visit> visit;

    public Patient(Long id, String patientId, String patientName, String age, String sex, String contact, String email, String department, List<PastHistory> pastHistories, Symptoms symptoms, Vitals vitals, Consent consent, List<SymptomImages> symptomImages, Bed bed, List<Progress> progress, List<Visit> visit) {
        Id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.age = age;
        this.sex = sex;
        this.contact = contact;
        this.email = email;
        this.department = department;
        this.pastHistories = pastHistories;
        this.symptoms = symptoms;
        this.vitals = vitals;
        this.consent = consent;
        this.symptomImages = symptomImages;
        this.bed = bed;
        this.progress = progress;
        this.visit = visit;
    }

    public Patient() {
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long Id) {
        this.Id = Id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<PastHistory> getPastHistories() {
        return pastHistories;
    }

    public void setPastHistories(List<PastHistory> pastHistories) {
        this.pastHistories = pastHistories;
    }

    public Symptoms getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(Symptoms symptoms) {
        this.symptoms = symptoms;
    }

    public Vitals getVitals() {
        return vitals;
    }

    public void setVitals(Vitals vitals) {
        this.vitals = vitals;
    }

    public Consent getConsent() {
        return consent;
    }

    public void setConsent(Consent consent) {
        this.consent = consent;
    }

    public List<SymptomImages> getSymptomImages() {
        return symptomImages;
    }

    public void setSymptomImages(List<SymptomImages> symptomImages) {
        this.symptomImages = symptomImages;
    }

    public Bed getBed() {
        return bed;
    }

    public void setBed(Bed bed) {
        this.bed = bed;
    }


    public List<Progress> getProgress() {
        return progress;
    }

    public void setProgress(List<Progress> progress) {
        this.progress = progress;
    }

    public List<Visit> getVisit() {
        return visit;
    }

    public void setVisit(List<Visit> visit) {
        this.visit = visit;
    }

    @PrePersist
    public void generatePatientId() {
        if (Id != null) {
            patientId = "P" + String.format("%03d", Id);
        }
    }

    public void addVisit(Visit newVisit) {
        if (visit == null) {
            visit = new ArrayList<>();
        }
        visit.add(newVisit);
        newVisit.setPatient(this);
    }

    @Override
    public String toString() {
        return "Patient{" +
                "Id=" + Id +
                ", patientId='" + patientId + '\'' +
                ", patientName='" + patientName + '\'' +
                ", age='" + age + '\'' +
                ", sex='" + sex + '\'' +
                ", contact='" + contact + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", pastHistories=" + pastHistories +
                ", symptoms=" + symptoms +
                ", vitals=" + vitals +
                ", consent=" + consent +
                ", symptomImages=" + symptomImages +
                ", bed=" + bed +
                ", progress=" + progress +
                ", visit=" + visit +
                '}';
    }
}
