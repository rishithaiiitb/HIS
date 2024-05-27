package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import org.checkerframework.checker.units.qual.N;

import java.util.List;

@Entity
@Table(name="symptoms")
public class Symptoms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="symptom_id")
    private Long symptomid;

    @NotEmpty(message = "Please mention the symptom")
    @Column(name="symptom1",nullable = false)
    private String symptom1;

    @NotEmpty(message = "Please mention the symptom")
    @Column(name="symptom2",nullable = false)
    private String symptom2;

    @Column(name = "symptom3")
    private String symptom3;

    @Column(name="symptom4")
    private String symptom4;


    @Column(name="symptom5")
    private String symptom5;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name="pid",referencedColumnName = "patient_id",nullable = false)
    private Patient patient;

    public Symptoms() {
    }

    public Symptoms(Long symptomid, String symptom1, String symptom2, String symptom3, String symptom4, String symptom5, Patient patient) {
        this.symptomid = symptomid;
        this.symptom1 = symptom1;
        this.symptom2 = symptom2;
        this.symptom3 = symptom3;
        this.symptom4 = symptom4;
        this.symptom5 = symptom5;
        this.patient = patient;
    }

    public Long getSymptomid() {
        return symptomid;
    }

    public void setSymptomid(Long symptomid) {
        this.symptomid = symptomid;
    }

    public String getSymptom1() {
        return symptom1;
    }

    public void setSymptom1(String symptom1) {
        this.symptom1 = symptom1;
    }

    public String getSymptom2() {
        return symptom2;
    }

    public void setSymptom2(String symptom2) {
        this.symptom2 = symptom2;
    }

    public String getSymptom3() {
        return symptom3;
    }

    public void setSymptom3(String symptom3) {
        this.symptom3 = symptom3;
    }

    public String getSymptom4() {
        return symptom4;
    }

    public void setSymptom4(String symptom4) {
        this.symptom4 = symptom4;
    }

    public String getSymptom5() {
        return symptom5;
    }

    public void setSymptom5(String symptom5) {
        this.symptom5 = symptom5;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @Override
    public String toString() {
        return "Symptoms{" +
                "symptomid=" + symptomid +
                ", symptom1='" + symptom1 + '\'' +
                ", symptom2='" + symptom2 + '\'' +
                ", symptom3='" + symptom3 + '\'' +
                ", symptom4='" + symptom4 + '\'' +
                ", symptom5='" + symptom5 + '\'' +
                ", patient=" + patient +
                '}';
    }
}
